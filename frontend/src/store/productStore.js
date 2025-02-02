import { create } from "zustand";
import axios from "axios";

const API_URL = "http://3.80.235.113:6000/api/product";

// Menggunakan default axios tanpa withCredentials karena tidak ada autentikasi
export const useProductStore = create((set) => ({
  products: [], // Inisialisasi produk dengan array kosong
  error: null,
  isLoading: false,

  // Fungsi untuk mengambil data produk
  fetchProducts: async () => {
    set({ isLoading: true, error: null }); // Set loading true saat fetch dimulai
    try {
      const response = await axios.get(`${API_URL}/all-products`);
      set({
        products: response.data.data, // Simpan data produk yang didapat dari API
        isLoading: false, // Set loading false setelah data diterima
      });
    } catch (error) {
      set({
        error: error.response?.data.message || "Error fetching products", // Tangani error jika ada
        isLoading: false,
      });
      throw error; // Lempar error untuk debugging lebih lanjut
    }
  },
}));
