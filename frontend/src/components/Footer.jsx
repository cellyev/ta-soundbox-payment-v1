import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <div className="bg-gradient-to-r from-gray-900 to-gray-700 text-white py-8 mt-12 shadow-inner">
      <div className="container mx-auto px-6 text-center md:text-left">
        {/* Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          <div>
            <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
            <ul>
              <li>
                <Link
                  to="/home"
                  className="hover:text-blue-400 block mb-2 text-sm"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/cart"
                  className="hover:text-blue-400 block mb-2 text-sm"
                >
                  Cart
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-4">Follow Us</h4>
            <div className="flex justify-center md:justify-start space-x-4">
              <a href="#" className="text-white hover:text-blue-400 text-xl">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="text-white hover:text-blue-400 text-xl">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-white hover:text-blue-400 text-xl">
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-4">Contact</h4>
            <p className="text-sm mb-2">Email: vailovent@gmail.com</p>
            <p className="text-sm">Phone: +62 895 2774 9870</p>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t pt-6 text-sm text-gray-400">
          <p>&copy; 2025 Vailovent. All Rights Reserved.</p>
        </div>
      </div>
    </div>
  );
}
