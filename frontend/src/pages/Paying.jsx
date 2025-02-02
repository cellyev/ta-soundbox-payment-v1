import { useEffect, useState } from "react";
import { useTransactionStore } from "../store/transactionStore";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Impor gaya toast

const Paying = () => {
  const { transaction_id } = useParams();
  const navigate = useNavigate();
  const { paying, setTransactionDetails, isLoading, error } =
    useTransactionStore();

  const [amountFormatted, setAmountFormatted] = useState(""); // Untuk tampilan
  const [amountRaw, setAmountRaw] = useState(0); // Untuk dikirim ke API

  useEffect(() => {
    const fetchTransactionDetails = async () => {
      try {
        const response = await fetch(
          `http://3.80.235.113:8000/api/transaction/get-by-id/${transaction_id}`
        );
        const data = await response.json();

        if (!data.success) {
          toast.error(data.message);
          return navigate("/");
        }

        setTransactionDetails(data.data);

        // Simpan nilai asli (tanpa titik) dan format untuk tampilan
        const amountValue = data.data.total_amount;
        setAmountRaw(amountValue); // Simpan angka asli
        setAmountFormatted(amountValue.toLocaleString("id-ID")); // Format untuk tampilan
      } catch (err) {
        console.error(err);
        toast.error("Error fetching transaction details");
      }
    };

    fetchTransactionDetails();
  }, [transaction_id, setTransactionDetails, navigate]);

  const handlePayment = async () => {
    try {
      if (isNaN(amountRaw) || amountRaw <= 0) {
        toast.error("Amount must be a valid number!");
        return;
      }

      const response = await paying(transaction_id, amountRaw); // Kirim angka asli

      if (response && response.data) {
        const { items, success } = response.data;

        console.log("Items from response:", items);

        if (success && Array.isArray(items) && items.length > 0) {
          toast.success("Payment successful!");

          navigate("/payment-success", {
            state: {
              status: "Success",
              transaction_id,
              amount: amountRaw, // Kirim angka asli ke halaman sukses
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
              type="text"
              value={amountFormatted} // Tampilkan angka terformat
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
