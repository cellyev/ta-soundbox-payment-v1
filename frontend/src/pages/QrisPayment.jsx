import { useTransactionStore } from "../store/transactionStore";

export default function QrisPayment() {
  const { transactionDetails, qrCode } = useTransactionStore();

  if (!transactionDetails || !qrCode) {
    return <p>Loading transaction details...</p>;
  }

  const paymentLink = `http://3.80.235.113:6000/paying/${transactionDetails._id}`;

  return (
    <div className="container mx-auto px-4 py-8 text-center">
      <h1 className="text-3xl font-bold mb-4">Complete your payment soon</h1>
      <p className="text-lg text-gray-600 mb-6">
        Scan the QR code below to make your payment.
      </p>

      <div className="flex justify-center">
        <img src={qrCode} alt="QR Code" className="w-64 h-64 object-contain" />
      </div>

      <button
        onClick={() => window.open(paymentLink, "_blank")}
        className="mt-6 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
      >
        Pay Now
      </button>
    </div>
  );
}
