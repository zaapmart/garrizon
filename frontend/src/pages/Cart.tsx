import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useCartStore } from '../store/cartStore';
import { cartService } from '../services/cartService';
import { formatPrice } from '../lib/utils';
import { Button } from '../components/ui/button';

export const Cart = () => {
    const { items, totalAmount, setCart } = useCartStore();
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState<number | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const data = await cartService.getCart();
                setCart(data.items, data.totalAmount);
            } catch (error) {
                console.error('Failed to fetch cart:', error);
                // If 401, it might be handled by interceptor, but just in case
            } finally {
                setIsLoading(false);
            }
        };

        fetchCart();
    }, [setCart]);

    const handleUpdateQuantity = async (itemId: number, newQuantity: number) => {
        if (newQuantity < 1) return;

        setIsUpdating(itemId);
        try {
            const data = await cartService.updateCartItemQuantity(itemId, newQuantity);
            setCart(data.items, data.totalAmount);
        } catch (error) {
            console.error('Failed to update quantity:', error);
            toast.error('Failed to update quantity');
        } finally {
            setIsUpdating(null);
        }
    };

    const handleRemoveItem = async (itemId: number) => {
        setIsUpdating(itemId);
        try {
            const data = await cartService.removeCartItem(itemId);
            setCart(data.items, data.totalAmount);
            toast.success('Item removed');
        } catch (error) {
            console.error('Failed to remove item:', error);
            toast.error('Failed to remove item');
        } finally {
            setIsUpdating(null);
        }
    };

    if (isLoading) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-gray-200 w-1/4 rounded"></div>
                    <div className="h-64 bg-gray-200 w-full rounded"></div>
                </div>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
                <div className="flex justify-center mb-6">
                    <div className="p-6 bg-gray-100 rounded-full">
                        <ShoppingBag className="h-12 w-12 text-gray-400" />
                    </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
                <p className="text-gray-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
                <Link to="/products">
                    <Button size="lg">
                        Start Shopping <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

            <div className="flex flex-col lg:flex-row gap-12">
                {/* Cart Items */}
                <div className="flex-1">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        <ul className="divide-y divide-gray-200">
                            {items.map((item) => (
                                <li key={item.id} className="p-6 flex flex-col sm:flex-row items-center sm:items-start gap-6">
                                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                        <img
                                            src={item.productImageUrl || 'https://placehold.co/200x200?text=No+Image'}
                                            alt={item.productName}
                                            className="h-full w-full object-cover object-center"
                                        />
                                    </div>

                                    <div className="flex-1 flex flex-col sm:flex-row justify-between w-full">
                                        <div>
                                            <h3 className="text-base font-medium text-gray-900">
                                                <Link to={`/products/${item.productSlug}`} className="hover:text-primary">
                                                    {item.productName}
                                                </Link>
                                            </h3>
                                            <p className="mt-1 text-sm text-gray-500">
                                                {formatPrice(item.price)}
                                            </p>
                                        </div>

                                        <div className="mt-4 sm:mt-0 flex flex-col items-end justify-between">
                                            <div className="flex items-center border border-gray-300 rounded-md">
                                                <button
                                                    onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                                    disabled={isUpdating === item.id || item.quantity <= 1}
                                                    className="p-1 hover:bg-gray-100 disabled:opacity-50"
                                                >
                                                    <Minus className="h-4 w-4 text-gray-500" />
                                                </button>
                                                <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                                                <button
                                                    onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                                    disabled={isUpdating === item.id}
                                                    className="p-1 hover:bg-gray-100 disabled:opacity-50"
                                                >
                                                    <Plus className="h-4 w-4 text-gray-500" />
                                                </button>
                                            </div>

                                            <button
                                                onClick={() => handleRemoveItem(item.id)}
                                                disabled={isUpdating === item.id}
                                                className="mt-4 text-sm font-medium text-red-600 hover:text-red-500 flex items-center"
                                            >
                                                <Trash2 className="h-4 w-4 mr-1" /> Remove
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Order Summary */}
                <div className="w-full lg:w-80">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>

                        <div className="flow-root">
                            <dl className="-my-4 divide-y divide-gray-200">
                                <div className="py-4 flex items-center justify-between">
                                    <dt className="text-sm text-gray-600">Subtotal</dt>
                                    <dd className="text-sm font-medium text-gray-900">{formatPrice(totalAmount)}</dd>
                                </div>
                                <div className="py-4 flex items-center justify-between">
                                    <dt className="text-sm text-gray-600">Shipping</dt>
                                    <dd className="text-sm font-medium text-gray-900">Calculated at checkout</dd>
                                </div>
                                <div className="py-4 flex items-center justify-between">
                                    <dt className="text-base font-bold text-gray-900">Total</dt>
                                    <dd className="text-base font-bold text-primary">{formatPrice(totalAmount)}</dd>
                                </div>
                            </dl>
                        </div>

                        <div className="mt-6">
                            <Button className="w-full" size="lg" onClick={() => navigate('/checkout')}>
                                Proceed to Checkout
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
