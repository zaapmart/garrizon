import api from './api';
import type { Category } from '../types';

export const categoryService = {
    getAllCategories: async () => {
        const response = await api.get<Category[]>('/categories');
        return response.data;
    },

    createCategory: async (categoryData: Partial<Category>) => {
        const response = await api.post<Category>('/categories', categoryData);
        return response.data;
    },

    deleteCategory: async (id: number) => {
        await api.delete(`/categories/${id}`);
    }
};
