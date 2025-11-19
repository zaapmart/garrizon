import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag, Truck, ShieldCheck } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { productService } from '../services/productService';
import type { Product } from '../types';
import { Button } from '../components/ui/button';

export const Home = () => {
    const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await productService.getAllProducts(0, 4); // Fetch first 4 products
                setFeaturedProducts(data.content);
            } catch (error) {
                console.error('Failed to fetch products:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="relative bg-gray-900 text-white py-20 lg:py-32 overflow-hidden">
                <div className="absolute inset-0 overflow-hidden">
                    <img
                        src="https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
                        alt="Fresh food background"
                        className="w-full h-full object-cover opacity-20"
                    />
                </div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="lg:w-2/3">
                        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
                            Freshness Delivered <br />
                            <span className="text-primary">Straight to You</span>
                        </h1>
                        <p className="text-xl text-gray-300 mb-8 max-w-2xl">
                            Experience the finest quality food products sourced directly from premium suppliers.
                            Garrizon brings the market to your doorstep with just a few clicks.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link to="/products">
                                <Button size="lg" className="w-full sm:w-auto text-lg px-8">
                                    Shop Now <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                            <Link to="/register">
                                <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-8 bg-transparent text-white border-white hover:bg-white hover:text-gray-900">
                                    Sign Up
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-sm">
                            <div className="p-3 bg-primary/10 rounded-full mb-4">
                                <ShoppingBag className="h-8 w-8 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Premium Selection</h3>
                            <p className="text-gray-600">Curated collection of high-quality food products for your daily needs.</p>
                        </div>
                        <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-sm">
                            <div className="p-3 bg-primary/10 rounded-full mb-4">
                                <Truck className="h-8 w-8 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Fast Delivery</h3>
                            <p className="text-gray-600">Swift and reliable delivery service to ensure your items arrive fresh.</p>
                        </div>
                        <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-sm">
                            <div className="p-3 bg-primary/10 rounded-full mb-4">
                                <ShieldCheck className="h-8 w-8 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Quality Guarantee</h3>
                            <p className="text-gray-600">We stand by the quality of our products with a satisfaction guarantee.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Products Section */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-end mb-8">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900">Featured Products</h2>
                            <p className="mt-2 text-gray-600">Check out our latest arrivals</p>
                        </div>
                        <Link to="/products" className="hidden sm:flex items-center text-primary hover:text-primary/80 font-medium">
                            View all products <ArrowRight className="ml-1 h-4 w-4" />
                        </Link>
                    </div>

                    {isLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="bg-gray-100 rounded-lg h-80 animate-pulse" />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {featuredProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}

                    <div className="mt-8 text-center sm:hidden">
                        <Link to="/products">
                            <Button variant="outline" className="w-full">
                                View all products
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};
