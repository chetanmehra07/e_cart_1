import type { CartItem } from "../../app/api/apiSlice";

// 🟢 Fetch guest cart from localStorage
export const getGuestCart = (): CartItem[] => {
  const cart = localStorage.getItem("guestCart");
  return cart ? JSON.parse(cart) : [];
};

// 🟢 Save guest cart
// 🟢 Save guest cart
export const saveGuestCart = (cart: CartItem[]) => {
  localStorage.setItem("guestCart", JSON.stringify(cart));
  window.dispatchEvent(new Event("storage")); // 🔁 Notify listeners like NavBar
};

// ✅ NEW: Clear guest cart
export const clearGuestCart = () => {
  localStorage.removeItem("guestCart");
};
