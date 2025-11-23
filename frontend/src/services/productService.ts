import api from './api';
import type { Product, PaginatedResponse } from '../types';

export const productService = {
    getAllProducts: async (page = 0, size = 10, sortBy = 'id', sortDir = 'asc') => {
        const response = await api.get<PaginatedResponse<Product>>('/products', {
            params: { page, size, sortBy, sortDir },
        });
        return response.data;
    },

    getProductById: async (id: number) => {
        const response = await api.get<Product>(`/products/${id}`);
        return response.data;
    },

    getProductBySlug: async (slug: string) => {
        // Assuming backend supports fetching by slug, otherwise we might need to filter or add an endpoint
        // For now, let's assume there's an endpoint or we use ID. 
        // If the backend only has getById, we might need to adjust.
        // Let's assume we use getById for now in the UI if slug isn't supported directly yet.
        // Or better, let's add a TODO to check backend support.
        const response = await api.get<Product>(`/products/${slug}`);
        return response.data;
    },

    getProductsByCategory: async (categoryId: number, page = 0, size = 10) => {
        const response = await api.get<PaginatedResponse<Product>>(`/products/category/${categoryId}`, {
            params: { page, size }
        });
        return response.data;
    }
};
