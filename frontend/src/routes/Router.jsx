import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "../pages/HomePage";
import CartPage from "../pages/CartPage";
// import QrisPaymentPage from "../pages/QrisPaymentPage";
// import PayingPage from "../pages/PayingPage";
import PaymentSuccessPage from "../pages/PaymentSuccessPage";
import PaymentFailedPage from "../pages/paymentFailedPage";

export default function RouterComponent() {
  return (
    <Routes>
      <Route path="/home" element={<HomePage />} />
      <Route path="/cart" element={<CartPage />} />
      {/* <Route path="/qris-payment" element={<QrisPaymentPage />} /> */}
      {/* <Route path="/paying/:transaction_id/:status" element={<PayingPage />} /> */}
      <Route path="/payment-success" element={<PaymentSuccessPage />} />
      <Route path="/payment-failed" element={<PaymentFailedPage />} />
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}
