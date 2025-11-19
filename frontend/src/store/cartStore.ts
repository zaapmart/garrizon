import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
    id: number;
    productId: number;
    productName: string;
    productSlug: string;
    productImageUrl: string;
    price: number;
    quantity: number;
    subtotal: number;
}

interface CartState {
    items: CartItem[];
    totalAmount: number;
    setCart: (items: CartItem[], totalAmount: number) => void;
    clearCart: () => void;
}

export const useCartStore = create<CartState>()(
    persist(
        (set) => ({
            items: [],
            totalAmount: 0,
            setCart: (items, totalAmount) => set({ items, totalAmount }),
            clearCart: () => set({ items: [], totalAmount: 0 }),
        }),
        {
            name: 'cart-storage',
        }
    )
);
