import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from './ui/dialog';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import type { Product } from '../types';

interface AddToCartModalProps {
    product: Product;
    isOpen: boolean;
    onClose: () => void;
}

export const AddToCartModal: React.FC<AddToCartModalProps> = ({ product, isOpen, onClose }) => {
    const { isAuthenticated } = useAuthStore();
    const { setCart } = useCartStore();
    const [quantity, setQuantity] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleAdd = async () => {
        if (!isAuthenticated) {
            toast.error('You must be logged in to add items to the cart');
            return;
        }
        setIsSubmitting(true);
        try {
            const response = await api.post('/cart/items', {
                productId: product.id,
                quantity,
            });
            const { items, totalAmount } = response.data;
            setCart(items, totalAmount);
            toast.success('Added to cart');
            onClose();
        } catch (error) {
            toast.error('Failed to add to cart');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{product.name}</DialogTitle>
                    <DialogDescription>{product.description}</DialogDescription>
                </DialogHeader>
                <div className="flex items-center space-x-4 mt-4">
                    <label className="font-medium" htmlFor="quantity">
                        Quantity
                    </label>
                    <input
                        id="quantity"
                        type="number"
                        min={1}
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                        className="w-20 border rounded px-2 py-1"
                    />
                </div>
                <div className="flex justify-end space-x-2 mt-6">
                    <DialogClose asChild>
                        <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button onClick={handleAdd} disabled={isSubmitting}>
                        {isSubmitting ? 'Adding...' : 'Add to Cart'}
                    </Button>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={onClose}
                >
                    <X className="h-4 w-4" />
                </Button>
            </DialogContent>
        </Dialog>
    );
};
