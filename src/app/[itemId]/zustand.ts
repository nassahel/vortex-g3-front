import { create } from "zustand";
import { CartItem } from "@/types/types";

interface CartState {
    cart: CartItem[];
    addItem: (item: CartItem) => void;
    removeItem: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    syncCartWithLocalStorage: () => void;
}


const useCartStore = create<CartState>((set) => ({
    cart: JSON.parse(localStorage.getItem("cart") || "[]"), 
    addToCart: (item: CartItem) => set((state) => ({ cart: [...state.cart, item] })),

    syncCartWithLocalStorage: () => {
        const localCart = JSON.parse(localStorage.getItem("cart") || "[]");
        set({ cart: localCart || [] }); // 🔥 Asegura que `cart` nunca sea undefined
    },

    addItem: (item) =>
        set((state) => {
            const existingItem = state.cart.find((cartItem) => cartItem.productId === item.productId);
            let updatedCart;

            if (existingItem) {
                updatedCart = state.cart.map((cartItem) =>
                    cartItem.productId === item.productId
                        ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
                        : cartItem
                );
            } else {
                updatedCart = [...state.cart, item];
            }

            localStorage.setItem("cart", JSON.stringify(updatedCart));
            return { cart: updatedCart };
        }),

    removeItem: (productId) =>
        set((state) => {
            const updatedCart = state.cart.filter((item) => item.productId !== productId);
            localStorage.setItem("cart", JSON.stringify(updatedCart));
            return { cart: updatedCart };
        }),

    updateQuantity: (productId, quantity) =>
        set((state) => {
            const updatedCart = state.cart.map((item) =>
                item.productId === productId ? { ...item, quantity } : item
            );
            localStorage.setItem("cart", JSON.stringify(updatedCart));
            return { cart: updatedCart };
        }),

    clearCart: () => {
        localStorage.removeItem("cart");
        set({ cart: [] });
    },

}));

export default useCartStore;

