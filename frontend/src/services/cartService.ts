import api from './api';
import { CartItem } from '../store/cartStore';

export interface CartResponse {
    items: CartItem[];
    totalAmount: number;
}

export const cartService = {
    getCart: async () => {
        const response = await api.get<CartResponse>('/cart');
        return response.data;
    },

    addToCart: async (productId: number, quantity: number) => {
        const response = await api.post<CartResponse>('/cart/items', {
            productId,
            quantity,
        });
        return response.data;
    },

    updateCartItemQuantity: async (itemId: number, quantity: number) => {
        const response = await api.put<CartResponse>(`/cart/items/${itemId}`, null, {
            params: { quantity },
        });
        return response.data;
    },

    removeCartItem: async (itemId: number) => {
        const response = await api.delete<CartResponse>(`/cart/items/${itemId}`);
        return response.data;
    },

    clearCart: async () => {
        await api.delete('/cart');
    }
};
