import api from './api';
import { CartItem } from '../store/cartStore';

export interface OrderDTO {
    id: number;
    totalAmount: number;
    status: string;
    paymentStatus: string;
    shippingAddress: string;
    paymentProvider: 'STRIPE' | 'PAYSTACK';
    items: CartItem[];
    createdAt: string;
}

export const orderService = {
    createOrder: async (shippingAddress: string, paymentProvider: 'STRIPE' | 'PAYSTACK') => {
        const response = await api.post<OrderDTO>('/orders', null, {
            params: { shippingAddress, paymentProvider },
        });
        return response.data;
    },

    initializePaystack: async (orderId: number) => {
        const response = await api.post<{ authorization_url: string; reference: string }>('/checkout/paystack/initialize', {
            orderId,
        });
        return response.data;
    },

    createStripePaymentIntent: async (orderId: number) => {
        const response = await api.post<{ clientSecret: string }>('/checkout/stripe/create-payment-intent', {
            orderId,
        });
        return response.data;
    },

    verifyPayment: async (orderId: number, provider: 'STRIPE' | 'PAYSTACK', reference: string) => {
        const response = await api.post<OrderDTO>('/checkout/verify-payment', {
            orderId,
            provider,
            reference,
        });
        return response.data;
    }
};
