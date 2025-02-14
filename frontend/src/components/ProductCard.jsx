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

  const incrementQty = () => setQuantity(quantity + 1);
  const decrementQty = () => {
    if (quantity > 0) setQuantity(quantity - 1);
  };

  return (
    <div className="flex flex-col justify-between bg-gradient-to-r from-gray-900 to-gray-700 text-white rounded-lg shadow-xl hover:shadow-2xl transition duration-300 h-full">
      <div className="relative p-6 flex flex-col justify-between flex-grow">
        {/* Gambar dengan ukuran persegi */}
        <img
          src={product.image}
          alt={product.name}
          className="w-64 h-64 object-cover rounded-lg mx-auto border-2 border-gray-500 mb-4"
        />
        {/* Konten teks dengan penyusunan yang konsisten */}
        <div className="text-center flex-grow">
          <h2 className="text-2xl font-extrabold text-gray-100">
            {product.name}
          </h2>
          <p className="text-gray-300 text-md mt-2 text-justify">
            {product.description}
          </p>
        </div>
      </div>

      {/* Kontainer harga yang konsisten, sekarang di tengah */}
      <div className="flex justify-center items-center px-6 py-2">
        <p className="text-2xl font-semibold text-green-400">
          {product.price.toLocaleString("id-ID", {
            style: "currency",
            currency: "IDR",
          })}
        </p>
      </div>

      {/* Kontrol kuantitas produk */}
      <div className="mt-6 flex items-center justify-center space-x-6">
        <button
          onClick={decrementQty}
          className="bg-red-600 text-white p-3 rounded-full hover:bg-red-700 transition duration-200 focus:outline-none text-xl"
        >
          <FaMinus />
        </button>
        <span className="text-2xl font-semibold">{quantity}</span>
        <button
          onClick={incrementQty}
          className="bg-green-600 text-white p-3 rounded-full hover:bg-green-700 transition duration-200 focus:outline-none text-xl"
        >
          <FaPlus />
        </button>
      </div>

      {/* Tombol "Add to Cart" dengan responsif */}
      <button
        className="mb-4 mt-8 bg-blue-600 text-white px-6 py-3 rounded-full w-80 sm:w-56 md:w-40 lg:w-52 xl:w-72 mx-auto text-lg font-semibold hover:bg-blue-700 transition duration-200"
        onClick={handleAddToCart}
      >
        Add to Cart
      </button>
    </div>
  );
}
