import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Router from "./routes/Router";
import { ToastContainer } from "react-toastify";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-center mb-10">
        Welcome to Vailovent!
      </h1>
      <ToastContainer />
      <Navbar />
      <Router />
      <Footer />
    </div>
  );
}
