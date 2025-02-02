import { create } from "zustand";
import axios from "axios";

const API_URL = "http://3.80.235.113:8000/api/transaction";

export const useTransactionStore = create((set, get) => ({
  table_code: "",
  customer_name: "",
  customer_email: "",
  products: [],
  transactionDetails: null, // Menyimpan detail transaksi
  qrCode: null, // Menyimpan data QR Code
  error: null,
  isLoading: false,

  // Set input untuk transaksi
  setTransactionDetails: (details) =>
    set((state) => ({
      ...state,
      ...details,
    })),

  // Tambah produk ke daftar transaksi
  addProduct: (product) =>
    set((state) => ({
      products: [...state.products, product],
    })),

  // Buat transaksi
  createTransaction: async () => {
    set({ isLoading: true, error: null });
    try {
      const { table_code, customer_name, customer_email, products } = get();

      const response = await axios.post(`${API_URL}/create-transaction`, {
        table_code,
        customer_name,
        customer_email,
        products,
      });

      const { savedTransaction, qrCode } = response.data.data;

      // Update state dengan detail transaksi dan QR code
      set({
        transactionDetails: savedTransaction,
        qrCode,
        isLoading: false,
      });

      return response.data;
    } catch (error) {
      set({
        error: error.response?.data.message || "Error creating transaction",
        isLoading: false,
      });
      throw error;
    }
  },

  paying: async (transaction_id, amount) => {
    set({ isLoading: true, error: null });
    try {
      if (!transaction_id) {
        throw new Error("Transaction ID is required");
      }

      // Pastikan transaction_id diembed ke URL
      const response = await axios.post(`${API_URL}/paying/${transaction_id}`, {
        amount,
      });

      if (response && response.data) {
        const { result, items } = response.data;

        set({
          transactionDetails: result,
          items,
          isLoading: false,
        });

        return response; // Pastikan return response untuk digunakan di frontend
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error paying",
        isLoading: false,
      });
      throw error; // Re-throw untuk logging atau handling lanjutan
    }
  },
}));
