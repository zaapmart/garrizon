import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    ShoppingCart,
    CreditCard,
    Package,
    FolderTree,
    Image,
    Users,
    Warehouse,
    UserCog,
    Settings,
    LogOut,
    Menu,
    X
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export const AdminLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const menuItems = [
        { path: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
        { path: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
        { path: '/admin/transactions', icon: CreditCard, label: 'Transactions' },
        { path: '/admin/products', icon: Package, label: 'Products' },
        { path: '/admin/categories', icon: FolderTree, label: 'Categories' },
        { path: '/admin/banners', icon: Image, label: 'Banners & Promotions' },
        { path: '/admin/customers', icon: Users, label: 'Customers' },
        { path: '/admin/inventory', icon: Warehouse, label: 'Inventory' },
        { path: '/admin/staff', icon: UserCog, label: 'Staff & Roles', adminOnly: true },
        { path: '/admin/settings', icon: Settings, label: 'Settings', adminOnly: true },
    ];

    const isActive = (path: string, exact?: boolean) => {
        if (exact) {
            return location.pathname === path;
        }
        return location.pathname.startsWith(path);
    };

    const filteredMenuItems = menuItems.filter(item => {
        if (item.adminOnly && user?.role !== 'ADMIN') {
            return false;
        }
        return true;
    });

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Top Header */}
            <header className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-30">
                <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="hidden lg:block p-2 rounded-md hover:bg-gray-100"
                        >
                            <Menu className="h-5 w-5 text-gray-600" />
                        </button>
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="lg:hidden p-2 rounded-md hover:bg-gray-100"
                        >
                            {isMobileMenuOpen ? (
                                <X className="h-5 w-5 text-gray-600" />
                            ) : (
                                <Menu className="h-5 w-5 text-gray-600" />
                            )}
                        </button>
                        <Link to="/admin" className="flex items-center space-x-2">
                            <span className="text-xl font-bold text-primary">Garrizon</span>
                            <span className="hidden sm:inline-block px-2 py-1 text-xs font-semibold text-purple-700 bg-purple-100 rounded">
                                Admin
                            </span>
                        </Link>
                    </div>

                    <div className="flex items-center space-x-4">
                        <Link
                            to="/"
                            className="hidden sm:flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary"
                        >
                            View Store
                        </Link>
                        <div className="flex items-center space-x-3 border-l pl-4">
                            <div className="hidden sm:block text-right">
                                <p className="text-sm font-medium text-gray-900">{user?.firstName} {user?.lastName}</p>
                                <p className="text-xs text-gray-500">{user?.role}</p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="p-2 rounded-md hover:bg-gray-100 text-gray-600"
                                title="Logout"
                            >
                                <LogOut className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Sidebar - Desktop */}
            <aside
                className={`hidden lg:block fixed left-0 top-16 bottom-0 bg-white border-r border-gray-200 transition-all duration-300 z-20 ${
                    isSidebarOpen ? 'w-64' : 'w-20'
                }`}
            >
                <nav className="h-full overflow-y-auto py-4">
                    <ul className="space-y-1 px-3">
                        {filteredMenuItems.map((item) => {
                            const Icon = item.icon;
                            const active = isActive(item.path, item.exact);
                            return (
                                <li key={item.path}>
                                    <Link
                                        to={item.path}
                                        className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${
                                            active
                                                ? 'bg-primary text-white'
                                                : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                    >
                                        <Icon className="h-5 w-5 flex-shrink-0" />
                                        {isSidebarOpen && (
                                            <span className="text-sm font-medium">{item.label}</span>
                                        )}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>
            </aside>

            {/* Mobile Sidebar */}
            {isMobileMenuOpen && (
                <div className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50" onClick={() => setIsMobileMenuOpen(false)}>
                    <aside
                        className="fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-gray-200 overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <nav className="py-4">
                            <ul className="space-y-1 px-3">
                                {filteredMenuItems.map((item) => {
                                    const Icon = item.icon;
                                    const active = isActive(item.path, item.exact);
                                    return (
                                        <li key={item.path}>
                                            <Link
                                                to={item.path}
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${
                                                    active
                                                        ? 'bg-primary text-white'
                                                        : 'text-gray-700 hover:bg-gray-100'
                                                }`}
                                            >
                                                <Icon className="h-5 w-5 flex-shrink-0" />
                                                <span className="text-sm font-medium">{item.label}</span>
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        </nav>
                    </aside>
                </div>
            )}

            {/* Main Content */}
            <main
                className={`pt-16 transition-all duration-300 ${
                    isSidebarOpen ? 'lg:pl-64' : 'lg:pl-20'
                }`}
            >
                <div className="p-6">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};
