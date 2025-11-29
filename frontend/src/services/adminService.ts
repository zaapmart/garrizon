import api from './api';
import type { Product } from '../types';

export interface DashboardMetrics {
    totalRevenue: number;
    totalOrders: number;
    totalProducts: number;
    totalCustomers: number;
}

export interface UserDTO {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
}

export const adminService = {
    getMetrics: async () => {
        const response = await api.get<DashboardMetrics>('/admin/metrics');
        return response.data;
    },

    getCustomers: async (page = 0, size = 20) => {
        const response = await api.get<{ content: UserDTO[] }>('/admin/customers', {
            params: { page, size }
        });
        return response.data;
    },

    createProduct: async (productData: Partial<Product>) => {
        const response = await api.post<Product>('/admin/products', productData);
        return response.data;
    },

    uploadProductImage: async (productId: number, file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await api.post<string>(`/admin/products/${productId}/upload-image`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    uploadProductImageFromUrl: async (productId: number, imageUrl: string) => {
        const response = await api.post<string>(`/admin/products/${productId}/upload-image-url`, null, {
            params: { url: imageUrl }
        });
        return response.data;
    },


    deleteProduct: async (productId: number) => {
        await api.delete(`/admin/products/${productId}`);
    },

    getAllProductsForAdmin: async (page = 0, size = 100) => {
        const response = await api.get<{ content: Product[] }>('/admin/products', {
            params: { page, size }
        });
        return response.data;
    },

    updateProduct: async (productId: number, productData: Partial<Product>) => {
        const response = await api.put<Product>(`/admin/products/${productId}`, productData);
        return response.data;
    }
};
