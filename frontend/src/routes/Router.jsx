import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/HomePage";
import Cart from "../pages/Cart";
import QrisPayment from "../pages/QrisPayment";
import Paying from "../pages/Paying";
import PaymentSuccessPage from "../pages/PaymentSuccessPage";
// import Payment from "../pages/Payment";

export default function Router() {
  return (
    <Routes>
      <Route path="/home" element={<Home />} />
      <Route path="/cart" element={<Cart />} />
      {/* <Route path="/payment" element={"<Payment />"} /> */}
      <Route path="/qris-payment" element={<QrisPayment />} />
      <Route path="/paying/:transaction_id" element={<Paying />} />
      <Route path="/payment-success" element={<PaymentSuccessPage />} />

      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}
