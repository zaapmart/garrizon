import React, { useEffect, useState } from 'react';
import { Package, ShoppingCart, Users, DollarSign } from 'lucide-react';
import { adminService } from '../services/adminService';
import type { DashboardMetrics, UserDTO } from '../services/adminService';
import { formatPrice } from '../lib/utils';

export const Admin = () => {
    const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
    const [customers, setCustomers] = useState<UserDTO[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [metricsData, customersData] = await Promise.all([
                    adminService.getMetrics(),
                    adminService.getCustomers(0, 10)
                ]);
                setMetrics(metricsData);
                setCustomers(customersData.content);
            } catch (error) {
                console.error('Failed to fetch admin data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    if (isLoading) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-gray-200 w-1/4 rounded"></div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-32 bg-gray-200 rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    const metricCards = [
        { title: 'Total Revenue', value: formatPrice(metrics?.totalRevenue || 0), icon: DollarSign, color: 'bg-green-500' },
        { title: 'Total Orders', value: metrics?.totalOrders || 0, icon: ShoppingCart, color: 'bg-blue-500' },
        { title: 'Total Products', value: metrics?.totalProducts || 0, icon: Package, color: 'bg-purple-500' },
        { title: 'Total Customers', value: metrics?.totalCustomers || 0, icon: Users, color: 'bg-orange-500' }
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

            {/* Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {metricCards.map((metric, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                                <p className="text-2xl font-bold text-gray-900 mt-2">{metric.value}</p>
                            </div>
                            <div className={`p-3 rounded-full ${metric.color}`}>
                                <metric.icon className="h-6 w-6 text-white" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Customers */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Recent Customers</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Role
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {customers.map((customer) => (
                                <tr key={customer.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {customer.firstName} {customer.lastName}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {customer.email}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${customer.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                                            }`}>
                                            {customer.role}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
