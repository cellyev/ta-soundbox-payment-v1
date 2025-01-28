import { useState } from "react";
import { Link } from "react-router-dom";
import { FaShoppingCart, FaHome, FaCreditCard } from "react-icons/fa";
import { useCartStore } from "../store/cartStore"; // Import store

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { cart } = useCartStore(); // Ambil cart dari store

  // Toggle mobile menu
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Get the cart count
  const cartCount = cart.length;

  return (
    <div className="bg-white shadow-md sticky top-0 z-10 transition-shadow duration-300">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <img
            src="https://ta-project-soundbox-payment.s3.ap-southeast-2.amazonaws.com/v-logo.jpg"
            alt="Logo"
            className="w-10 h-10"
          />
          <Link to="/home" className="text-2xl font-bold text-gray-800">
            Vailovent
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6">
          <Link
            to="/home"
            className="flex items-center space-x-2 text-gray-700 hover:text-blue-500"
          >
            <FaHome />
            <span>Home</span>
          </Link>

          <Link
            to="/cart"
            className="flex items-center space-x-2 text-gray-700 hover:text-blue-500"
          >
            <FaShoppingCart />
            <span>Cart</span>
            {cartCount > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2">
                {cartCount}
              </span>
            )}
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="text-gray-700 focus:outline-none"
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Menu - Slide In from Right */}
      <div
        className={`fixed inset-y-0 right-0 w-64 bg-white shadow-md transform transition-transform duration-300 z-20 ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="py-4">
          <button
            onClick={toggleMenu}
            className="block ml-auto mr-6 text-gray-700 text-xl"
          >
            ✕
          </button>
          <Link
            to="/home"
            className="block px-6 py-2 text-gray-700 hover:text-blue-500"
          >
            <FaHome />
            <span>Home</span>
          </Link>

          <Link
            to="/cart"
            className="block px-6 py-2 text-gray-700 hover:text-blue-500"
          >
            <FaShoppingCart />
            <span>Cart</span>
            {cartCount > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2">
                {cartCount}
              </span>
            )}
          </Link>

          <Link
            to="/payment"
            className="block px-6 py-2 text-gray-700 hover:text-blue-500"
          >
            <FaCreditCard />
            <span>Payment</span>
          </Link>
        </div>
      </div>

      {/* Overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-10"
          onClick={toggleMenu}
        ></div>
      )}
    </div>
  );
}
