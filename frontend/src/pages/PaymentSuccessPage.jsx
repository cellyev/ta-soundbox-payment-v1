import { useLocation, useNavigate } from "react-router-dom";

const PaymentSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Pastikan ada data di state, jika tidak redirect
  const paymentDetails = location.state || null;

  if (!paymentDetails) {
    return (
      <div className="p-4 max-w-md mx-auto text-center">
        <p>Data not found. Redirecting to home...</p>
        {setTimeout(() => navigate("/"), 3000)}
      </div>
    );
  }

  const { status, transaction_id, amount, items } = paymentDetails;

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold text-center mb-6">
        Payment Successful
      </h1>
      <div className="mb-4">
        <p className="text-green-600 font-semibold text-lg mb-2">
          Status: {status}
        </p>
        <p className="text-sm text-gray-600">
          Transaction ID: <span className="font-medium">{transaction_id}</span>
        </p>
        <p className="text-sm text-gray-600">
          Amount Paid:{" "}
          <span className="font-medium">Rp {amount.toLocaleString()}</span>
        </p>
      </div>

      <h2 className="text-2xl font-semibold mt-6 mb-4">Items Purchased</h2>
      <table className="min-w-full table-auto border-collapse mb-6">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
              Item
            </th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
              Quantity
            </th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
              Price
            </th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(items) && items.length > 0 ? (
            items.map((item, index) => (
              <tr key={index} className="border-t">
                <td className="px-4 py-2">{item.product_name}</td>
                <td className="px-4 py-2">{item.qty}</td>
                <td className="px-4 py-2">
                  Rp{" "}
                  {item.amount
                    ? parseFloat(item.amount).toLocaleString()
                    : "N/A"}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="3"
                className="px-4 py-2 text-center text-sm text-gray-500"
              >
                No items found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="flex justify-between items-center mt-4">
        <p className="text-lg font-bold">Total Amount:</p>
        <p className="text-lg font-medium text-blue-600">
          Rp {amount ? parseFloat(amount).toLocaleString() : "N/A"}
        </p>
      </div>

      <button
        onClick={() => navigate("/")}
        className="w-full mt-6 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
      >
        Go to Home
      </button>
    </div>
  );
};

export default PaymentSuccessPage;
