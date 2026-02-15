import { useEffect, useState } from 'react';
import {
    DollarSign,
    ShoppingCart,
    Clock,
    XCircle,
    Package,
    TrendingUp,
    AlertTriangle,
    ArrowUp,
    ArrowDown
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { formatPrice } from '../../lib/utils';
import toast from 'react-hot-toast';

interface DashboardStats {
    todayRevenue: number;
    ordersToday: number;
    pendingOrders: number;
    failedTransactions: number;
    lowStockItems: number;
    revenueChange: number;
    ordersChange: number;
}

interface RecentOrder {
    id: number;
    orderNumber: string;
    customerName: string;
    totalAmount: number;
    status: string;
    createdAt: string;
}

interface TopProduct {
    id: number;
    name: string;
    sales: number;
    revenue: number;
    imageUrl: string;
}

export const AdminDashboard = () => {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
    const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [metricsData] = await Promise.all([
                adminService.getMetrics(),
                // TODO: Add endpoints for recent orders and top products
            ]);

            // For now, using mock data - replace with real API calls
            setStats({
                todayRevenue: metricsData.totalRevenue || 0,
                ordersToday: metricsData.totalOrders || 0,
                pendingOrders: 0,
                failedTransactions: 0,
                lowStockItems: 0,
                revenueChange: 12.5,
                ordersChange: -3.2
            });

            // Mock recent orders - replace with real data
            setRecentOrders([]);
            setTopProducts([]);
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
            toast.error('Failed to load dashboard data');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 w-1/4 rounded mb-6"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    const statCards = [
        {
            title: "Today's Revenue",
            value: formatPrice(stats?.todayRevenue || 0),
            change: stats?.revenueChange || 0,
            icon: DollarSign,
            color: 'bg-green-500',
            bgColor: 'bg-green-50',
            textColor: 'text-green-700'
        },
        {
            title: 'Orders Today',
            value: stats?.ordersToday || 0,
            change: stats?.ordersChange || 0,
            icon: ShoppingCart,
            color: 'bg-blue-500',
            bgColor: 'bg-blue-50',
            textColor: 'text-blue-700'
        },
        {
            title: 'Pending Orders',
            value: stats?.pendingOrders || 0,
            icon: Clock,
            color: 'bg-yellow-500',
            bgColor: 'bg-yellow-50',
            textColor: 'text-yellow-700'
        },
        {
            title: 'Failed Transactions',
            value: stats?.failedTransactions || 0,
            icon: XCircle,
            color: 'bg-red-500',
            bgColor: 'bg-red-50',
            textColor: 'text-red-700'
        },
        {
            title: 'Low Stock Items',
            value: stats?.lowStockItems || 0,
            icon: AlertTriangle,
            color: 'bg-orange-500',
            bgColor: 'bg-orange-50',
            textColor: 'text-orange-700'
        }
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-sm text-gray-500 mt-1">Welcome back! Here's what's happening today.</p>
                </div>
                <button
                    onClick={fetchDashboardData}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                    Refresh
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                {statCards.map((stat, index) => {
                    const Icon = stat.icon;
                    const isPositive = stat.change ? stat.change > 0 : null;
                    return (
                        <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                                    <Icon className={`h-6 w-6 ${stat.textColor}`} />
                                </div>
                                {stat.change !== undefined && (
                                    <span className={`flex items-center text-sm font-medium ${
                                        isPositive ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                        {isPositive ? (
                                            <ArrowUp className="h-4 w-4 mr-1" />
                                        ) : (
                                            <ArrowDown className="h-4 w-4 mr-1" />
                                        )}
                                        {Math.abs(stat.change)}%
                                    </span>
                                )}
                            </div>
                            <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        </div>
                    );
                })}
            </div>

            {/* Recent Orders & Top Products */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Orders */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
                    </div>
                    <div className="p-6">
                        {recentOrders.length === 0 ? (
                            <div className="text-center py-12">
                                <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                                <p className="text-gray-500">No recent orders</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {recentOrders.map((order) => (
                                    <div key={order.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                                        <div>
                                            <p className="font-medium text-gray-900">{order.orderNumber}</p>
                                            <p className="text-sm text-gray-500">{order.customerName}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-gray-900">{formatPrice(order.totalAmount)}</p>
                                            <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                                                {order.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Top Products */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900">Top Selling Products</h2>
                    </div>
                    <div className="p-6">
                        {topProducts.length === 0 ? (
                            <div className="text-center py-12">
                                <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                                <p className="text-gray-500">No sales data available</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {topProducts.map((product, index) => (
                                    <div key={product.id} className="flex items-center space-x-4">
                                        <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full text-sm font-semibold text-gray-600">
                                            {index + 1}
                                        </span>
                                        <img
                                            src={product.imageUrl || 'https://placehold.co/40x40?text=No+Image'}
                                            alt={product.name}
                                            className="w-10 h-10 rounded object-cover"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-gray-900 truncate">{product.name}</p>
                                            <p className="text-sm text-gray-500">{product.sales} sales</p>
                                        </div>
                                        <p className="font-semibold text-gray-900">{formatPrice(product.revenue)}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Inventory Alerts */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Inventory Alerts</h2>
                </div>
                <div className="p-6">
                    <div className="text-center py-12">
                        <Package className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-500">All products are well stocked</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
