import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { ProductModal } from './ProductModal';
import { formatPrice } from '../lib/utils';

import type { Product } from '../types';

interface ProductCardProps {
    product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
    const { isAuthenticated } = useAuthStore();
    const [isModalOpen, setIsModalOpen] = React.useState(false);

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent navigation if clicking the button inside a Link

        if (!isAuthenticated) {
            toast.error('Please login to add items to cart');
            return;
        }

        setIsModalOpen(true);
    };

    return (
        <>
            <Link to={`/products/${product.slug}`}>
                <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-200 overflow-hidden group">
                    <div className="aspect-w-16 aspect-h-9 relative overflow-hidden bg-gray-200 h-48">
                        <img
                            src={product.imageUrl || 'https://placehold.co/600x400?text=No+Image'}
                            alt={product.name}
                            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200"
                        />
                    </div>
                    <CardHeader className="p-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm text-muted-foreground">{product.categoryName}</p>
                                <CardTitle className="text-lg line-clamp-1">{product.name}</CardTitle>
                            </div>
                            <span className="font-bold text-lg text-primary">
                                {formatPrice(product.price)}
                            </span>
                        </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 flex-grow">
                        <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                        <Button
                            className="w-full"
                            onClick={handleAddToCart}
                            disabled={product.stock <= 0}
                        >
                            {product.stock > 0 ? (
                                <>
                                    <ShoppingCart className="mr-2 h-4 w-4" />
                                    Add to Cart
                                </>
                            ) : (
                                'Out of Stock'
                            )}
                        </Button>
                    </CardFooter>
                </Card>
            </Link>

            <ProductModal
                product={product}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    );
};
