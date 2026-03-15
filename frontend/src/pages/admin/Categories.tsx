import React, { useEffect, useState } from 'react';
import { Plus, Trash2, FolderTree } from 'lucide-react';
import { categoryService } from '../../services/categoryService';
import type { Category } from '../../types';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import toast from 'react-hot-toast';

export const AdminCategories = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showAddCategory, setShowAddCategory] = useState(false);
    
    // Form State
    const [categoryFormData, setCategoryFormData] = useState({
        name: '',
        slug: '',
        description: '',
        parentId: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const categoriesData = await categoryService.getAllCategories();
            setCategories(categoriesData);
        } catch (error) {
            console.error('Failed to fetch categories:', error);
            toast.error('Failed to load categories');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCategoryInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setCategoryFormData(prev => {
            const newData = { ...prev, [name]: value };
            if (name === 'name') {
                newData.slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
            }
            return newData;
        });
    };

    const handleCategorySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const categoryData: Partial<Category> = {
                name: categoryFormData.name,
                slug: categoryFormData.slug,
                description: categoryFormData.description,
            };

            if (categoryFormData.parentId) {
                categoryData.parentId = parseInt(categoryFormData.parentId);
            }

            await categoryService.createCategory(categoryData);
            toast.success('Category created successfully!');
            setShowAddCategory(false);
            setCategoryFormData({
                name: '',
                slug: '',
                description: '',
                parentId: ''
            });

            // Refresh categories
            fetchData();

        } catch (error: any) {
            console.error('Failed to create category:', error);
            if (error.response) {
                console.error('Error response data:', error.response.data);
                console.error('Error response status:', error.response.status);
                toast.error(`Failed to create category: ${error.response.data?.message || error.response.statusText}`);
            } else if (error.request) {
                 console.error('Error request:', error.request);
                 toast.error('No response from server. Check network.');
            } else {
                console.error('Error message:', error.message);
                toast.error(`Failed to create category: ${error.message}`);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteCategory = async (categoryId: number, categoryName: string) => {
        if (!window.confirm(`Are you sure you want to delete "${categoryName}"? This will also delete all subcategories.`)) {
            return;
        }

        try {
            await categoryService.deleteCategory(categoryId);
            toast.success('Category deleted successfully');
            fetchData();
        } catch (error) {
            console.error('Failed to delete category:', error);
            toast.error('Failed to delete category');
        }
    };

    // Helper to render category options recursively
    const renderCategoryOptions = (cats: Category[], level = 0) => {
        return cats.map(cat => (
            <React.Fragment key={cat.id}>
                <option value={cat.id}>
                    {'\u00A0'.repeat(level * 4)}{cat.name}
                </option>
                {cat.subcategories && renderCategoryOptions(cat.subcategories, level + 1)}
            </React.Fragment>
        ));
    };

    // Helper to render category list recursively
    const renderCategoryList = (cats: Category[], level = 0) => {
        if (!cats || cats.length === 0) return null;
        
        return cats.map(cat => (
            <React.Fragment key={cat.id}>
                <tr className={level > 0 ? 'bg-gray-50' : 'hover:bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center" style={{ paddingLeft: `${level * 24}px` }}>
                            {level > 0 && <span className="text-gray-400 mr-2">↳</span>}
                            <FolderTree className={`h-4 w-4 mr-2 ${level === 0 ? 'text-primary' : 'text-gray-400'}`} />
                            <div className="text-sm font-medium text-gray-900">{cat.name}</div>
                        </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <code className="bg-gray-100 px-2 py-1 rounded text-xs">{cat.slug}</code>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs truncate">
                        {cat.description || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                            onClick={() => handleDeleteCategory(cat.id, cat.name)}
                            className="text-red-600 hover:text-red-900 ml-4 p-2 hover:bg-red-50 rounded-full transition-colors"
                            title="Delete Category"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                    </td>
                </tr>
                {cat.subcategories && renderCategoryList(cat.subcategories, level + 1)}
            </React.Fragment>
        ));
    };

    if (isLoading) {
        return (
            <div className="space-y-4">
                <div className="h-8 bg-gray-200 w-1/4 rounded animate-pulse"></div>
                <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage product categories and hierarchy</p>
                </div>
                <Button onClick={() => setShowAddCategory(!showAddCategory)}>
                    <Plus className="h-4 w-4 mr-2" />
                    {showAddCategory ? 'Cancel' : 'Add Category'}
                </Button>
            </div>

            {showAddCategory && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8 animate-in fade-in slide-in-from-top-4">
                    <h2 className="text-xl font-bold mb-6">Add New Category</h2>
                    <form onSubmit={handleCategorySubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="cat-name">Category Name</Label>
                                <Input
                                    id="cat-name"
                                    name="name"
                                    value={categoryFormData.name}
                                    onChange={handleCategoryInputChange}
                                    required
                                    placeholder="e.g. Electronics"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="cat-slug">Slug</Label>
                                <Input
                                    id="cat-slug"
                                    name="slug"
                                    value={categoryFormData.slug}
                                    onChange={handleCategoryInputChange}
                                    required
                                    placeholder="e.g. electronics"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="parent-category">Parent Category (Optional)</Label>
                                <select
                                    id="parent-category"
                                    name="parentId"
                                    value={categoryFormData.parentId}
                                    onChange={handleCategoryInputChange}
                                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <option value="">None (Root Category)</option>
                                    {renderCategoryOptions(categories)}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="cat-description">Description</Label>
                                <Textarea
                                    id="cat-description"
                                    name="description"
                                    value={categoryFormData.description}
                                    onChange={handleCategoryInputChange}
                                    placeholder="Category description..."
                                />
                            </div>
                        </div>
                        <div className="flex justify-end space-x-2">
                            <Button 
                                type="button" 
                                variant="outline" 
                                onClick={() => setShowAddCategory(false)}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? 'Creating...' : 'Create Category'}
                            </Button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                    <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">All Categories</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">
                                    Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Slug
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Description
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {categories.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                        <FolderTree className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                                        No categories found. Create one to get started.
                                    </td>
                                </tr>
                            ) : (
                                renderCategoryList(categories)
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
