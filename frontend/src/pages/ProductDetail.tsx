import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Minus, Plus, Check } from 'lucide-react';
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
    const [isAdding, setIsAdding] = useState(false);

    const { isAuthenticated } = useAuthStore();
    const { setCart } = useCartStore();

    useEffect(() => {
        const fetchProduct = async () => {
            if (!slug) return;
            try {
                // Note: Assuming backend has getBySlug, otherwise we might need to adjust
                // If backend only has getById, we might need to pass ID or fetch all and find.
                // For now, let's try to fetch by slug as defined in service.
                // If slug is actually an ID in the URL (which is common if we didn't implement slug lookup), 
                // we might need to parse it.
                // Let's assume the URL is /products/:slug

                // If the slug is numeric, it might be an ID.
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
        const newQuantity = quantity + delta;
        if (newQuantity >= 1 && newQuantity <= (product?.stock || 1)) {
            setQuantity(newQuantity);
        }
    };

    const handleAddToCart = async () => {
        if (!isAuthenticated) {
            toast.error('Please login to add items to cart');
            navigate('/login');
            return;
        }

        if (!product) return;

        setIsAdding(true);
        try {
            const response = await api.post('/cart/items', {
                productId: product.id,
                quantity: quantity,
            });

            const { items, totalAmount } = response.data;
            setCart(items, totalAmount);
            toast.success('Added to cart');
        } catch (error) {
            console.error('Add to cart error:', error);
            toast.error('Failed to add to cart');
        } finally {
            setIsAdding(false);
        }
    };

    if (isLoading) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="animate-pulse flex flex-col md:flex-row gap-8">
                    <div className="w-full md:w-1/2 bg-gray-200 h-96 rounded-lg"></div>
                    <div className="w-full md:w-1/2 space-y-4">
                        <div className="h-8 bg-gray-200 w-3/4 rounded"></div>
                        <div className="h-4 bg-gray-200 w-1/4 rounded"></div>
                        <div className="h-24 bg-gray-200 w-full rounded"></div>
                        <div className="h-10 bg-gray-200 w-1/3 rounded"></div>
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <Button
                variant="ghost"
                onClick={() => navigate(-1)}
                className="mb-6 pl-0 hover:bg-transparent hover:text-primary"
            >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Product Image */}
                <div className="rounded-2xl overflow-hidden bg-gray-100 border border-gray-200">
                    <img
                        src={product.imageUrl || 'https://placehold.co/600x600?text=No+Image'}
                        alt={product.name}
                        className="w-full h-full object-cover object-center"
                    />
                </div>

                {/* Product Info */}
                <div className="flex flex-col">
                    <div className="mb-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                            {product.categoryName}
                        </span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        {product.name}
                    </h1>
                    <div className="text-2xl font-bold text-primary mb-6">
                        {formatPrice(product.price)}
                    </div>

                    <div className="prose prose-sm text-gray-500 mb-8">
                        <p>{product.description}</p>
                    </div>

                    <div className="border-t border-b border-gray-200 py-6 mb-8">
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
                        <div className="space-y-6">
                            <div className="flex items-center space-x-4">
                                <span className="text-sm font-medium text-gray-700">Quantity</span>
                                <div className="flex items-center border border-gray-300 rounded-md">
                                    <button
                                        onClick={() => handleQuantityChange(-1)}
                                        className="p-2 hover:bg-gray-100 disabled:opacity-50"
                                        disabled={quantity <= 1}
                                    >
                                        <Minus className="h-4 w-4 text-gray-500" />
                                    </button>
                                    <span className="w-12 text-center font-medium">{quantity}</span>
                                    <button
                                        onClick={() => handleQuantityChange(1)}
                                        className="p-2 hover:bg-gray-100 disabled:opacity-50"
                                        disabled={quantity >= product.stock}
                                    >
                                        <Plus className="h-4 w-4 text-gray-500" />
                                    </button>
                                </div>
                            </div>

                            <Button
                                size="lg"
                                className="w-full"
                                onClick={handleAddToCart}
                                disabled={isAdding}
                            >
                                <ShoppingCart className="mr-2 h-5 w-5" />
                                {isAdding ? 'Adding to Cart...' : 'Add to Cart'}
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
