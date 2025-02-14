import { useState, useEffect } from "react";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Router from "./routes/Router";
import { ToastContainer } from "react-toastify";
import TermsAndConditionsModal from "./components/TermsAndConditionsModal";

export default function App() {
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Cek status terms yang diterima
  useEffect(() => {
    const hasAcceptedTerms = sessionStorage.getItem("hasAcceptedTerms"); // Menggunakan sessionStorage
    console.log("hasAcceptedTerms on load:", hasAcceptedTerms); // Log untuk memastikan status
    if (hasAcceptedTerms === "true") {
      setTermsAccepted(true);
    }
  }, []);

  const handleAcceptTerms = () => {
    sessionStorage.setItem("hasAcceptedTerms", "true"); // Simpan status di sessionStorage
    setTermsAccepted(true); // Perbarui status aplikasi
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <ToastContainer />
      <Navbar />
      <div className="flex-grow">
        {/* Tampilkan Terms & Conditions modal jika belum diterima */}
        {!termsAccepted && (
          <TermsAndConditionsModal onAccept={handleAcceptTerms} />
        )}
        <Router />
      </div>
      <Footer />
    </div>
  );
}
