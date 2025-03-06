import { CartItem } from "@/types/types";

interface PurchaseSlice {
    status: "PENDING" | "COMPLETED" | "CANCELED";
    totalAmount: number;
    items: CartItem[];
}

export const purchaseSlice = (set: any) => ({
    status: "PENDING",
    totalAmount: 0,
    items: [],
    addItem: (item: CartItem) =>
        set((state: any) => {
            const newItems = [...state.items, item];
            const newTotal = newItems.reduce(
                (sum, item) => sum + item.subtotal,
                0
            );
            return {
                items: newItems,
                totalAmount: newTotal,
            };
        }),
    removeItem: (itemId: number) =>
        set((state: any) => {
            const filtered = state.items.filter(
                (item: any) => item.id !== itemId
            );
            return {
                items: filtered,
                total: 0,
            };
        }),
});
