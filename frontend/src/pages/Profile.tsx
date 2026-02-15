import { useNavigate } from 'react-router-dom';
import { User, Mail, Shield, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export const Profile = () => {
    const { user } = useAuthStore();
    const navigate = useNavigate();

    if (!user) {
        return null;
    }

    const isAdmin = user.role === 'ADMIN';

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                {/* Profile Header */}
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-primary to-primary/80 h-32"></div>
                    <div className="px-6 pb-6">
                        <div className="flex items-center -mt-16 mb-6">
                            <div className="bg-white rounded-full p-2 shadow-lg">
                                <div className="bg-gradient-to-br from-primary to-primary/70 rounded-full p-6">
                                    <User className="h-16 w-16 text-white" />
                                </div>
                            </div>
                            <div className="ml-6 mt-16">
                                <h1 className="text-3xl font-bold text-gray-900">
                                    {user.firstName} {user.lastName}
                                </h1>
                                <div className="flex items-center mt-2">
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                        isAdmin 
                                            ? 'bg-purple-100 text-purple-800' 
                                            : 'bg-green-100 text-green-800'
                                    }`}>
                                        {isAdmin && <Shield className="h-4 w-4 mr-1" />}
                                        {user.role}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Admin Dashboard Button */}
                        {isAdmin && (
                            <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                            <Shield className="h-5 w-5 mr-2 text-purple-600" />
                                            Admin Access
                                        </h3>
                                        <p className="text-sm text-gray-600 mt-1">
                                            Manage products, orders, and view analytics
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => navigate('/admin')}
                                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200"
                                    >
                                        Admin Dashboard
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Profile Information */}
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                    Profile Information
                                </h2>
                                <div className="grid grid-cols-1 gap-4">
                                    <div className="flex items-start p-4 bg-gray-50 rounded-lg">
                                        <Mail className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Email Address</p>
                                            <p className="mt-1 text-base text-gray-900">{user.email}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start p-4 bg-gray-50 rounded-lg">
                                        <User className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Full Name</p>
                                            <p className="mt-1 text-base text-gray-900">
                                                {user.firstName} {user.lastName}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start p-4 bg-gray-50 rounded-lg">
                                        <Shield className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Account Type</p>
                                            <p className="mt-1 text-base text-gray-900">
                                                {isAdmin ? 'Administrator' : 'Customer'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                    Quick Actions
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <button
                                        onClick={() => navigate('/cart')}
                                        className="flex items-center justify-center px-4 py-3 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                                    >
                                        View Cart
                                    </button>
                                    <button
                                        onClick={() => navigate('/products')}
                                        className="flex items-center justify-center px-4 py-3 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                                    >
                                        Browse Products
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
