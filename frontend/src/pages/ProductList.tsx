import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import type { Product, Category } from '../types';
import { Button } from '../components/ui/button';

export const ProductList = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();

    const page = parseInt(searchParams.get('page') || '0');
    const categoryId = searchParams.get('category') ? parseInt(searchParams.get('category')!) : null;

    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await categoryService.getAllCategories();
                setCategories(data);
            } catch (error) {
                console.error('Failed to fetch categories:', error);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            try {
                let data;
                if (categoryId) {
                    data = await productService.getProductsByCategory(categoryId, page);
                } else {
                    data = await productService.getAllProducts(page);
                }
                setProducts(data.content);
                setTotalPages(data.totalPages);
            } catch (error) {
                console.error('Failed to fetch products:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, [page, categoryId]);

    const handleCategoryChange = (id: number | null) => {
        if (id) {
            setSearchParams({ category: id.toString(), page: '0' });
        } else {
            setSearchParams({ page: '0' });
        }
    };

    const handlePageChange = (newPage: number) => {
        const params: any = { page: newPage.toString() };
        if (categoryId) params.category = categoryId.toString();
        setSearchParams(params);
        window.scrollTo(0, 0);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Filters Sidebar */}
                <div className="w-full md:w-64 flex-shrink-0">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex items-center mb-4">
                            <Filter className="h-5 w-5 mr-2" />
                            <h2 className="text-lg font-semibold">Filters</h2>
                        </div>

                        <div className="space-y-2">
                            <h3 className="font-medium text-gray-900 mb-2">Categories</h3>
                            <button
                                onClick={() => handleCategoryChange(null)}
                                className={`block w-full text-left px-2 py-1 rounded text-sm ${!categoryId ? 'bg-primary/10 text-primary font-medium' : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                All Products
                            </button>
                            {categories.map((category) => (
                                <React.Fragment key={category.id}>
                                    <button
                                        onClick={() => handleCategoryChange(category.id)}
                                        className={`block w-full text-left px-2 py-1 rounded text-sm ${categoryId === category.id ? 'bg-primary/10 text-primary font-medium' : 'text-gray-600 hover:bg-gray-50'
                                            }`}
                                    >
                                        {category.name}
                                    </button>
                                    {category.subcategories?.map((sub) => (
                                        <button
                                            key={sub.id}
                                            onClick={() => handleCategoryChange(sub.id)}
                                            className={`block w-full text-left pl-6 pr-2 py-1 rounded text-sm ${categoryId === sub.id ? 'bg-primary/10 text-primary font-medium' : 'text-gray-600 hover:bg-gray-50'
                                                }`}
                                        >
                                            ↳ {sub.name}
                                        </button>
                                    ))}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Product Grid */}
                <div className="flex-1">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">
                            {categoryId
                                ? categories.find(c => c.id === categoryId)?.name || 'Products'
                                : 'All Products'}
                        </h1>
                        <p className="text-gray-500 mt-1">
                            Showing {products.length} results
                        </p>
                    </div>

                    {isLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="bg-gray-100 rounded-lg h-80 animate-pulse" />
                            ))}
                        </div>
                    ) : products.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                                {products.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex justify-center items-center space-x-2">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => handlePageChange(page - 1)}
                                        disabled={page === 0}
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </Button>
                                    <span className="text-sm font-medium text-gray-700">
                                        Page {page + 1} of {totalPages}
                                    </span>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => handlePageChange(page + 1)}
                                        disabled={page === totalPages - 1}
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-12 bg-white rounded-lg border border-dashed border-gray-300">
                            <p className="text-gray-500 text-lg">No products found in this category.</p>
                            <Button
                                variant="link"
                                onClick={() => handleCategoryChange(null)}
                                className="mt-2"
                            >
                                View all products
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
