import { useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";
import { toast } from "react-toastify";
import { useCartStore } from "../store/cartStore";

export default function ProductCard({ product }) {
  const { addItemToCart } = useCartStore();
  const [quantity, setQuantity] = useState(0);

  const handleAddToCart = () => {
    if (quantity <= 0) {
      toast.error(
        "Product quantity must be greater than 0 to add to the cart!"
      );
      return;
    }

    addItemToCart({ ...product, quantity });
    toast.success(`${product.name} has been added to the cart!`);
    setQuantity(0);
  };

  // Function to increment or decrement the product quantity
  const incrementQty = () => setQuantity(quantity + 1);
  const decrementQty = () => {
    if (quantity > 0) setQuantity(quantity - 1);
  };

  // Format price to Indonesian currency
  const formatCurrency = (amount) => {
    return amount.toLocaleString("id-ID", {
      style: "currency",
      currency: "IDR",
    });
  };

  return (
    <div className="flex flex-col md:flex-row p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
      <img
        src={product.image}
        alt={product.name}
        className="w-64 h-64 object-cover rounded-lg mx-auto md:mx-0"
      />
      <div className="flex-1 mt-4 md:mt-0 md:ml-6">
        <h2 className="text-2xl font-bold text-gray-800 text-center md:text-left">
          {product.name}
        </h2>

        <p className="text-gray-600 text-justify">{product.description}</p>

        <p className="text-2xl font-semibold mt-2 text-green-700">
          {formatCurrency(product.price)}
        </p>

        <div className="mt-4 flex items-center justify-center md:justify-start space-x-6">
          <button
            onClick={decrementQty}
            className="bg-red-500 text-white p-3 rounded-full hover:bg-red-600 transition-colors duration-200 focus:outline-none text-2xl"
          >
            <FaMinus />
          </button>

          <span className="text-xl font-semibold">{quantity}</span>

          <button
            onClick={incrementQty}
            className="bg-green-500 text-white p-3 rounded-full hover:bg-green-600 transition-colors duration-200 focus:outline-none text-2xl"
          >
            <FaPlus />
          </button>
        </div>

        <button
          className="mt-6 bg-blue-500 text-white px-6 py-2 rounded-lg w-full md:w-auto mx-auto md:mx-0 hover:bg-blue-600 transition-colors duration-200"
          onClick={handleAddToCart}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
