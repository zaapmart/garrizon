import api from './api';

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
    }
};
