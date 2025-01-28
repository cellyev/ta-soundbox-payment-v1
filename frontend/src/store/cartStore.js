import { create } from "zustand";

export const useCartStore = create((set) => ({
  cart: JSON.parse(sessionStorage.getItem("cart")) || [],

  setCart: (newCart) => {
    sessionStorage.setItem("cart", JSON.stringify(newCart));
    set({ cart: newCart });
  },

  clearCart: () => {
    sessionStorage.removeItem("cart");
    set({ cart: [] });
  },

  addItemToCart: (item) =>
    set((state) => {
      const existingItem = state.cart.find((i) => i._id === item._id);

      let updatedCart;
      if (existingItem) {
        updatedCart = state.cart.map((i) =>
          i._id === item._id
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      } else {
        updatedCart = [...state.cart, item];
      }

      sessionStorage.setItem("cart", JSON.stringify(updatedCart));
      return { cart: updatedCart };
    }),

  removeItemFromCart: (itemId) =>
    set((state) => {
      const updatedCart = state.cart.filter((i) => i._id !== itemId);
      sessionStorage.setItem("cart", JSON.stringify(updatedCart));
      return { cart: updatedCart };
    }),
}));
