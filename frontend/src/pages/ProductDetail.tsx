import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Minus, Plus, ShoppingCart, Zap } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { productService } from '../services/productService';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { formatPrice } from '../lib/utils';
import type { Product } from '../types';
import { Button } from '../components/ui/button';
import api from '../services/api';

export const ProductDetail = () => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const [product, setProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [isBuyingNow, setIsBuyingNow] = useState(false);

    const { isAuthenticated } = useAuthStore();
    const { setCart, clearCart } = useCartStore();

    useEffect(() => {
        const fetchProduct = async () => {
            if (!slug) return;
            try {
                if (!isNaN(Number(slug))) {
                    const data = await productService.getProductById(Number(slug));
                    setProduct(data);
                } else {
                    const data = await productService.getProductBySlug(slug);
                    setProduct(data);
                }
            } catch (error) {
                console.error('Failed to fetch product:', error);
                toast.error('Failed to load product details');
            } finally {
                setIsLoading(false);
            }
        };
        fetchProduct();
    }, [slug]);

    const handleQuantityChange = (delta: number) => {
        const newQty = quantity + delta;
        if (newQty >= 1 && newQty <= (product?.stock || 1)) {
            setQuantity(newQty);
        }
    };

    const handleAddToCart = async () => {
        // Validation checks
        if (!isAuthenticated) {
            toast.error('Please login to add items to cart');
            navigate('/login');
            return;
        }

        if (!product) {
            toast.error('Product not loaded');
            return;
        }

        if (quantity < 1) {
            toast.error('Please select a quantity');
            return;
        }

        if (quantity > product.stock) {
            toast.error(`Only ${product.stock} items available`);
            return;
        }

        setIsAddingToCart(true);
        try {
            const response = await api.post('/cart/items', {
                productId: product.id,
                quantity,
            });
            const { items, totalAmount } = response.data;
            setCart(items, totalAmount);
            toast.success(`Added ${quantity} item(s) to cart`);
            // Stay on the same page - don't navigate
        } catch (error: any) {
            console.error('Add to cart error:', error);
            const errorMessage = error.response?.data?.message || 'Failed to add to cart';
            toast.error(errorMessage);
        } finally {
            setIsAddingToCart(false);
        }
    };

    const handleBuyNow = async () => {
        // Validation checks
        if (!isAuthenticated) {
            toast.error('Please login to continue');
            navigate('/login');
            return;
        }

        if (!product) {
            toast.error('Product not loaded');
            return;
        }

        if (quantity < 1) {
            toast.error('Please select a quantity');
            return;
        }

        if (quantity > product.stock) {
            toast.error(`Only ${product.stock} items available`);
            return;
        }

        setIsBuyingNow(true);
        try {
            // Clear the existing cart first
            try {
                await api.delete('/cart');
                clearCart();
            } catch (clearError) {
                console.warn('Cart clear warning:', clearError);
                // Continue even if clear fails
            }

            // Add only this product to cart
            const response = await api.post('/cart/items', {
                productId: product.id,
                quantity,
            });
            const { items, totalAmount } = response.data;
            setCart(items, totalAmount);

            // Redirect immediately to checkout
            navigate('/checkout');
        } catch (error: any) {
            console.error('Buy now error:', error);
            const errorMessage = error.response?.data?.message || 'Failed to process purchase';
            toast.error(errorMessage);
            setIsBuyingNow(false);
        }
        // Don't set isBuyingNow to false here - we're navigating away
    };

    if (isLoading) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                <div className="animate-pulse flex flex-col md:flex-row gap-6 md:gap-12">
                    <div className="w-full md:w-1/2 bg-gray-200 h-64 md:h-96 rounded-lg" />
                    <div className="w-full md:w-1/2 space-y-4">
                        <div className="h-8 bg-gray-200 w-3/4 rounded" />
                        <div className="h-4 bg-gray-200 w-1/4 rounded" />
                        <div className="h-24 bg-gray-200 w-full rounded" />
                        <div className="h-10 bg-gray-200 w-1/3 rounded" />
                    </div>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
                <h2 className="text-2xl font-bold text-gray-900">Product not found</h2>
                <Button variant="link" onClick={() => navigate('/products')} className="mt-4">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Products
                </Button>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12">
            <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4 md:mb-6 pl-0 hover:bg-transparent hover:text-primary">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
                {/* Image */}
                <div className="rounded-2xl overflow-hidden bg-gray-100 border border-gray-200">
                    <img
                        src={product.imageUrl || 'https://placehold.co/600x600?text=No+Image'}
                        alt={product.name}
                        className="w-full h-full object-cover object-center"
                    />
                </div>
                {/* Info */}
                <div className="flex flex-col">
                    <div className="mb-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                            {product.categoryName}
                        </span>
                    </div>
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 md:mb-4">{product.name}</h1>
                    <div className="text-xl md:text-2xl font-bold text-primary mb-4 md:mb-6">{formatPrice(product.price)}</div>
                    <div className="prose prose-sm text-gray-500 mb-6 md:mb-8"><p>{product.description}</p></div>
                    <div className="border-t border-b border-gray-200 py-4 md:py-6 mb-6 md:mb-8">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-900">Availability</span>
                            {product.stock > 0 ? (
                                <span className="flex items-center text-sm text-green-600">
                                    <Check className="h-4 w-4 mr-1" /> In Stock ({product.stock} available)
                                </span>
                            ) : (
                                <span className="text-sm text-red-600">Out of Stock</span>
                            )}
                        </div>
                    </div>

                    {product.stock > 0 && (
                        <div className="space-y-4">
                            {/* Quantity Selector */}
                            <div>
                                <label className="block text-sm font-medium text-gray-900 mb-2">Quantity</label>
                                <div className="flex items-center space-x-3">
                                    <button
                                        onClick={() => handleQuantityChange(-1)}
                                        disabled={quantity <= 1}
                                        className="w-10 h-10 flex items-center justify-center rounded-md border-2 border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        aria-label="Decrease quantity"
                                    >
                                        <Minus className="h-4 w-4" />
                                    </button>
                                    <div className="w-16 h-10 flex items-center justify-center text-lg font-semibold text-gray-900 border-2 border-gray-300 rounded-md bg-gray-50">
                                        {quantity}
                                    </div>
                                    <button
                                        onClick={() => handleQuantityChange(1)}
                                        disabled={quantity >= product.stock}
                                        className="w-10 h-10 flex items-center justify-center rounded-md border-2 border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        aria-label="Increase quantity"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Action Buttons - Side by Side */}
                            <div className="grid grid-cols-2 gap-3">
                                {/* Buy Now Button - RED (LEFT) */}
                                <button
                                    onClick={handleBuyNow}
                                    disabled={isBuyingNow || isAddingToCart || quantity < 1}
                                    className="h-12 flex items-center justify-center rounded-lg bg-red-600 text-white font-semibold text-sm md:text-base hover:bg-red-700 active:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                                >
                                    <Zap className="h-4 w-4 md:h-5 md:w-5 mr-1 md:mr-2" />
                                    {isBuyingNow ? 'Processing...' : 'Buy Now'}
                                </button>

                                {/* Add to Cart Button - GREEN (RIGHT) */}
                                <button
                                    onClick={handleAddToCart}
                                    disabled={isAddingToCart || isBuyingNow || quantity < 1}
                                    className="h-12 flex items-center justify-center rounded-lg bg-green-600 text-white font-semibold text-sm md:text-base hover:bg-green-700 active:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                                >
                                    <ShoppingCart className="h-4 w-4 md:h-5 md:w-5 mr-1 md:mr-2" />
                                    {isAddingToCart ? 'Adding...' : 'Add to Cart'}
                                </button>
                            </div>

                            {/* Helper Text */}
                            <p className="text-xs text-gray-500 text-center">
                                Buy Now clears your cart and takes you directly to checkout
                            </p>
                        </div>
                    )}

                    {product.stock === 0 && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                            <p className="text-red-800 font-medium">This product is currently out of stock</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
