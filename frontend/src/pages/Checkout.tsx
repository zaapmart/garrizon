import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { CreditCard, Truck, Lock } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { orderService } from '../services/orderService';
import { formatPrice } from '../lib/utils';
import { Button } from '../components/ui/button';

interface CheckoutForm {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    paymentMethod: 'STRIPE' | 'PAYSTACK';
}

export const Checkout = () => {
    const { items, totalAmount, clearCart } = useCartStore();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm<CheckoutForm>({
        defaultValues: {
            paymentMethod: 'PAYSTACK'
        }
    });

    if (items.length === 0) {
        navigate('/cart');
        return null;
    }

    const onSubmit = async (data: CheckoutForm) => {
        setIsProcessing(true);
        try {
            const fullAddress = `${data.address}, ${data.city}, ${data.state} ${data.zipCode}`;

            // 1. Create Order
            const order = await orderService.createOrder(fullAddress, data.paymentMethod);

            // 2. Process Payment
            if (data.paymentMethod === 'PAYSTACK') {
                const paystackResponse = await orderService.initializePaystack(order.id);
                // Redirect to Paystack
                window.location.href = paystackResponse.authorization_url;
            } else if (data.paymentMethod === 'STRIPE') {
                // For Stripe, we would typically redirect to a dedicated payment page 
                // or show the Stripe Elements form here.
                // For now, let's just show a toast as we haven't set up the full Stripe frontend.
                toast.success('Stripe integration coming soon. Please use Paystack.');
                setIsProcessing(false);
            }

            // Note: We don't clear cart here immediately because payment might fail.
            // Ideally, we clear it after successful payment webhook or verification.
            // But for this flow, if we redirect, the user leaves the app.

        } catch (error) {
            console.error('Checkout error:', error);
            toast.error('Failed to process order. Please try again.');
            setIsProcessing(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Checkout Form */}
                <div className="md:col-span-2">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                        {/* Shipping Address */}
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                            <div className="flex items-center mb-4">
                                <Truck className="h-5 w-5 text-primary mr-2" />
                                <h2 className="text-lg font-semibold">Shipping Address</h2>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Street Address</label>
                                    <input
                                        type="text"
                                        {...register('address', { required: 'Address is required' })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 border"
                                    />
                                    {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">City</label>
                                        <input
                                            type="text"
                                            {...register('city', { required: 'City is required' })}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 border"
                                        />
                                        {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">State</label>
                                        <input
                                            type="text"
                                            {...register('state', { required: 'State is required' })}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 border"
                                        />
                                        {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state.message}</p>}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Zip Code</label>
                                    <input
                                        type="text"
                                        {...register('zipCode', { required: 'Zip Code is required' })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 border"
                                    />
                                    {errors.zipCode && <p className="text-red-500 text-xs mt-1">{errors.zipCode.message}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                            <div className="flex items-center mb-4">
                                <CreditCard className="h-5 w-5 text-primary mr-2" />
                                <h2 className="text-lg font-semibold">Payment Method</h2>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center">
                                    <input
                                        id="paystack"
                                        type="radio"
                                        value="PAYSTACK"
                                        {...register('paymentMethod')}
                                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                                    />
                                    <label htmlFor="paystack" className="ml-3 block text-sm font-medium text-gray-700">
                                        Paystack (Debit/Credit Card)
                                    </label>
                                </div>
                                <div className="flex items-center">
                                    <input
                                        id="stripe"
                                        type="radio"
                                        value="STRIPE"
                                        {...register('paymentMethod')}
                                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                                    />
                                    <label htmlFor="stripe" className="ml-3 block text-sm font-medium text-gray-700">
                                        Stripe (Credit Card)
                                    </label>
                                </div>
                            </div>
                        </div>

                        <Button type="submit" className="w-full" size="lg" disabled={isProcessing}>
                            {isProcessing ? 'Processing...' : `Pay ${formatPrice(totalAmount)}`}
                        </Button>

                        <div className="flex items-center justify-center text-sm text-gray-500">
                            <Lock className="h-4 w-4 mr-2" />
                            Secure Checkout
                        </div>
                    </form>
                </div>

                {/* Order Summary Sidebar */}
                <div className="md:col-span-1">
                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 sticky top-24">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h3>
                        <ul className="space-y-4 mb-4">
                            {items.map((item) => (
                                <li key={item.id} className="flex justify-between text-sm">
                                    <span className="text-gray-600 truncate pr-4">{item.quantity}x {item.productName}</span>
                                    <span className="font-medium text-gray-900">{formatPrice(item.price * item.quantity)}</span>
                                </li>
                            ))}
                        </ul>
                        <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
                            <span className="font-bold text-gray-900">Total</span>
                            <span className="font-bold text-primary text-lg">{formatPrice(totalAmount)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
