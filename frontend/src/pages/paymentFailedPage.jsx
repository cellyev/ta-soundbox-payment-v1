import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const PaymentFailedPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const paymentDetails = location.state || null;
  // console.log("Payment Details:", paymentDetails);

  useEffect(() => {
    if (!paymentDetails) {
      setTimeout(() => navigate("/"), 3000);
    }
  }, [paymentDetails, navigate]);

  if (!paymentDetails) {
    return (
      <div className="p-4 max-w-md mx-auto text-center">
        <p>Data not found. Redirecting to home...</p>
      </div>
    );
  }

  const { status, transaction_id, amount, items } = paymentDetails;

  // console.log("Raw items:", items);

  let itemsArray = [];

  if (Array.isArray(items)) {
    itemsArray = items;
  } else if (typeof items === "object" && items !== null) {
    itemsArray = [items];
  } else {
    console.error("Items is not in the expected format:", items);
  }

  // console.log("Parsed itemsArray:", itemsArray);

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold text-center mb-6 text-red-600">
        Payment Failed
      </h1>
      <div className="mb-4">
        <p className="text-red-600 font-semibold text-lg mb-2">
          Status: {status}
        </p>
        <p className="text-sm text-gray-600">
          Transaction ID: <span className="font-medium">{transaction_id}</span>
        </p>
        <p className="text-sm text-gray-600">
          Amount Attempted:{" "}
          <span className="font-medium">
            Rp {parseFloat(amount).toLocaleString()}
          </span>
        </p>
      </div>

      <h2 className="text-2xl font-semibold mt-6 mb-4">Items Attempted</h2>
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
          {itemsArray.length > 0 ? (
            itemsArray.map((item, index) => (
              <tr key={index} className="border-t">
                <td className="px-4 py-2">{item.product_name}</td>
                <td className="px-4 py-2">{item.qty}</td>
                <td className="px-4 py-2">
                  Rp {parseFloat(item.amount).toLocaleString()}
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
        <p className="text-lg font-bold">Total Attempted:</p>
        <p className="text-lg font-medium text-red-600">
          Rp {amount ? parseFloat(amount).toLocaleString() : "N/A"}
        </p>
      </div>

      <button
        onClick={() => navigate("/")}
        className="w-full mt-6 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition"
      >
        Go to Home
      </button>
    </div>
  );
};

export default PaymentFailedPage;
