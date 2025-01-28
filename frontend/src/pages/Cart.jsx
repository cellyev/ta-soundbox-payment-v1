import { useState, useEffect } from "react";
import { FaTrash, FaPlus, FaMinus } from "react-icons/fa";
import { useTransactionStore } from "../store/transactionStore";
import { toast } from "react-toastify";

import { useNavigate } from "react-router-dom";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [tableCode, setTableCode] = useState("");
  const navigate = useNavigate();

  const { setTransactionDetails, createTransaction, error, isLoading } =
    useTransactionStore();

  useEffect(() => {
    const storedCart = JSON.parse(sessionStorage.getItem("cart")) || [];
    setCart(storedCart);

    const storedCustomer = JSON.parse(sessionStorage.getItem("customer"));
    if (storedCustomer) {
      setCustomerName(storedCustomer.name);
      setCustomerEmail(storedCustomer.email);
      setTableCode(storedCustomer.tableCode);
    }
  }, []);

  const handleIncrement = (index) => {
    const updatedCart = [...cart];
    updatedCart[index].quantity += 1;
    setCart(updatedCart);
    sessionStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleDecrement = (index) => {
    const updatedCart = [...cart];
    if (updatedCart[index].quantity > 1) {
      updatedCart[index].quantity -= 1;
    } else {
      updatedCart.splice(index, 1);
    }
    setCart(updatedCart);
    sessionStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleRemoveItem = (index) => {
    const updatedCart = cart.filter((_, i) => i !== index);
    setCart(updatedCart);
    sessionStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const formatCurrency = (amount) => {
    return amount.toLocaleString("id-ID", {
      style: "currency",
      currency: "IDR",
    });
  };

  const handleCheckout = async () => {
    if (!customerName || !customerEmail || !tableCode) {
      toast.error("Please fill out all details before checking out!");
      return;
    }

    const transactionData = {
      table_code: tableCode,
      customer_name: customerName,
      customer_email: customerEmail,
      products: cart.map((item) => ({
        product_id: item._id,
        qty: item.quantity,
      })),
    };

    setTransactionDetails(transactionData);

    try {
      await createTransaction();
      toast.success("Transaction created successfully!");
      setCart([]);
      sessionStorage.removeItem("cart");
      setCustomerName("");
      setCustomerEmail("");
      setTableCode("");

      navigate("/qris-payment");
    } catch (error) {
      console.log(error);
      toast.error("Failed to create transaction!");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Shopping Cart</h1>

      {cart.length === 0 ? (
        <p className="text-gray-500 text-center">Your cart is empty.</p>
      ) : (
        <div className="space-y-6">
          {cart.map((item, index) => (
            <div
              key={item.id || `cart-item-${index}`}
              className="flex flex-wrap items-center justify-between p-4 border-b"
            >
              <div className="flex items-center space-x-4 w-full sm:w-auto">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded"
                />
                <div className="flex-1">
                  <h2 className="text-xl font-semibold">{item.name}</h2>
                  <p className="text-gray-500">
                    {formatCurrency(item.price)} x {item.quantity}
                  </p>
                  <p className="text-lg font-semibold text-green-700">
                    {formatCurrency(item.price * item.quantity)}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <button
                  onClick={() => handleDecrement(index)}
                  className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                >
                  <FaMinus />
                </button>

                <span className="text-xl">{item.quantity}</span>

                <button
                  onClick={() => handleIncrement(index)}
                  className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600"
                >
                  <FaPlus />
                </button>

                <button
                  onClick={() => handleRemoveItem(index)}
                  className="bg-gray-300 p-2 rounded-full hover:bg-gray-400"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}

          <div className="mt-8 space-y-4">
            <div>
              <label className="block font-medium text-gray-700">
                Customer Name
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full border p-3 rounded mt-1"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700">
                Customer Email
              </label>
              <input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="w-full border p-3 rounded mt-1"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700">
                Table Code
              </label>
              <input
                type="text"
                value={tableCode}
                onChange={(e) => setTableCode(e.target.value)}
                className="w-full border p-3 rounded mt-1"
                placeholder="Enter table code (e.g., 1)"
              />
            </div>
          </div>

          <div className="text-right mt-6">
            <p className="text-2xl font-semibold">
              Total: {formatCurrency(calculateTotal())}
            </p>
          </div>

          <div className="text-right mt-4">
            <button
              onClick={handleCheckout}
              disabled={isLoading}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              {isLoading ? "Processing..." : "Checkout"}
            </button>
            {error && <p className="text-red-500 mt-2">Failed: {error}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
