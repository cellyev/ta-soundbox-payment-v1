import { useEffect, useState } from "react";
import { useTransactionStore } from "../store/transactionStore";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Impor gaya toast

const Paying = () => {
  const { transaction_id } = useParams(); // Ambil transaction_id dari URL
  const navigate = useNavigate();
  const { paying, setTransactionDetails, isLoading, error } =
    useTransactionStore();

  const [amount, setAmount] = useState("");

  useEffect(() => {
    const fetchTransactionDetails = async () => {
      try {
        const response = await fetch(
          `http://3.80.235.113:5000/api/transaction/get-by-id/${transaction_id}`
        );
        const data = await response.json();

        if (!data.success) {
          toast.error(data.message); // Tampilkan notifikasi error
          return navigate("/");
        }

        // Simpan detail transaksi di store
        setTransactionDetails(data.data);

        // Isi otomatis kolom amount dari total amount di database
        setAmount(data.data.total_amount);
      } catch (err) {
        console.error(err);
        toast.error("Error fetching transaction details"); // Tampilkan error
      }
    };

    fetchTransactionDetails();
  }, [transaction_id, setTransactionDetails, navigate]);

  const handlePayment = async () => {
    try {
      const numericAmount = parseFloat(amount);
      if (isNaN(numericAmount)) {
        toast.error("Amount must be a valid number!");
        return;
      }

      const response = await paying(transaction_id, numericAmount);

      // Cek response data
      console.log("Response from API:", response); // Debugging: cek response

      if (response && response.data) {
        const { items, success, message } = response.data;

        // Cek apakah items ada dan valid
        console.log("Items from response:", items);

        if (success && Array.isArray(items) && items.length > 0) {
          toast.success("Payment successful!");

          navigate("/payment-success", {
            state: {
              status: "Success",
              transaction_id,
              amount,
              items,
            },
          });
        } else {
          toast.error("Payment failed: No items found or invalid response!");
        }
      } else {
        throw new Error("Invalid response from API");
      }
    } catch (err) {
      console.error("Error during payment:", err);
      toast.error("Error during payment: " + err.message);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-semibold mb-4">Confirm Payment</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Amount</label>
            <input
              type="number"
              value={amount}
              readOnly
              className="w-full p-2 border rounded"
            />
          </div>
          <button
            onClick={handlePayment}
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Confirm Payment
          </button>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </>
      )}
    </div>
  );
};

export default Paying;
