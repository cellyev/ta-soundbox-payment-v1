import { useEffect, useState } from "react";
import { useTransactionStore } from "../store/transactionStore";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function PayingPage() {
  const { transaction_id } = useParams();
  const navigate = useNavigate();
  const { paying, setTransactionDetails, fetchTransaction, isLoading, error } =
    useTransactionStore();

  const [amountFormatted, setAmountFormatted] = useState("");
  const [amountRaw, setAmountRaw] = useState(0);

  useEffect(() => {
    const fetchTransactionDetails = async () => {
      try {
        const transactionData = await fetchTransaction(transaction_id);

        if (!transactionData) {
          toast.error("Failed to fetch transaction details!");
          return navigate("/");
        }

        setTransactionDetails(transactionData);

        const amountValue = transactionData.total_amount;
        setAmountRaw(amountValue);
        setAmountFormatted(amountValue.toLocaleString("id-ID"));
      } catch (err) {
        console.error(err);
        toast.error("Error fetching transaction details");
      }
    };

    fetchTransactionDetails();
  }, [transaction_id, setTransactionDetails, navigate, fetchTransaction]);

  const handlePayment = async () => {
    try {
      if (isNaN(amountRaw) || amountRaw <= 0) {
        toast.error("Amount must be a valid number!");
        return;
      }

      const response = await paying(transaction_id, amountRaw); // Kirim angka asli

      if (response && response.data) {
        const { items, success } = response.data;

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
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto sm:max-w-lg md:max-w-xl">
      <h1 className="text-2xl font-semibold text-center mb-6">
        Confirm Payment
      </h1>
      {isLoading ? (
        <div className="flex justify-center items-center">
          <div className="animate-spin border-t-4 border-blue-500 border-solid w-8 h-8 rounded-full"></div>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount
            </label>
            <input
              type="text"
              value={amountFormatted}
              disabled
              className="w-full p-3 bg-gray-100 border rounded-md text-gray-700"
            />
          </div>

          <button
            onClick={handlePayment}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
            disabled={isLoading}
          >
            Pay Now
          </button>
        </>
      )}
      {error && (
        <p className="text-red-600 text-center mt-4">{error.message}</p>
      )}
    </div>
  );
}
