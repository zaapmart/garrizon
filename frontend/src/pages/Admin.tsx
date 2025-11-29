import React, { useEffect, useState } from 'react';
import { Package, ShoppingCart, Users, DollarSign, Plus, Upload, Trash2, Edit } from 'lucide-react';
import { adminService } from '../services/adminService';
import { categoryService } from '../services/categoryService';
import type { DashboardMetrics, UserDTO } from '../services/adminService';
import type { Category, Product } from '../types';
import { formatPrice } from '../lib/utils';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import toast from 'react-hot-toast';

export const Admin = () => {
    const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
    const [customers, setCustomers] = useState<UserDTO[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showAddProduct, setShowAddProduct] = useState(false);
    const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'customers' | 'categories'>('overview');
    const [showAddCategory, setShowAddCategory] = useState(false);
    const [categoryFormData, setCategoryFormData] = useState({
        name: '',
        slug: '',
        description: '',
        parentId: ''
    });

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        categoryId: '',
        slug: ''
    });
    const [imageFile, setImageFile] = useState<File | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [metricsData, customersData, categoriesData, productsData] = await Promise.all([
                    adminService.getMetrics(),
                    adminService.getCustomers(0, 10),
                    categoryService.getAllCategories(),
                    adminService.getAllProductsForAdmin(0, 100)
                ]);
                setMetrics(metricsData);
                setCustomers(customersData.content);
                setCategories(categoriesData);
                setProducts(productsData.content);
            } catch (error) {
                console.error('Failed to fetch admin data:', error);
                toast.error('Failed to load dashboard data');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const newData = { ...prev, [name]: value };
            if (name === 'name') {
                newData.slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
            }
            return newData;
        });
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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const productData = {
                name: formData.name,
                slug: formData.slug,
                description: formData.description,
                price: parseFloat(formData.price),
                stock: parseInt(formData.stock),
                categoryId: parseInt(formData.categoryId),
                isActive: true
            };

            const createdProduct = await adminService.createProduct(productData);

            if (imageFile) {
                await adminService.uploadProductImage(createdProduct.id, imageFile);
            }

            toast.success('Product created successfully!');
            setShowAddProduct(false);
            setFormData({
                name: '',
                description: '',
                price: '',
                stock: '',
                categoryId: '',
                slug: ''
            });
            setImageFile(null);

            // Refresh metrics and products
            const [metricsData, productsData] = await Promise.all([
                adminService.getMetrics(),
                adminService.getAllProductsForAdmin(0, 100)
            ]);
            setMetrics(metricsData);
            setProducts(productsData.content);

        } catch (error) {
            console.error('Failed to create product:', error);
            toast.error('Failed to create product');
        } finally {
            setIsSubmitting(false);
        }
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
            const categoriesData = await categoryService.getAllCategories();
            setCategories(categoriesData);

        } catch (error) {
            console.error('Failed to create category:', error);
            toast.error('Failed to create category');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteProduct = async (productId: number, productName: string) => {
        if (!window.confirm(`Are you sure you want to delete "${productName}"?`)) {
            return;
        }

        try {
            await adminService.deleteProduct(productId);
            toast.success('Product deleted successfully');

            // Refresh products list and metrics
            const [productsData, metricsData] = await Promise.all([
                adminService.getAllProductsForAdmin(0, 100),
                adminService.getMetrics()
            ]);
            setProducts(productsData.content);
            setMetrics(metricsData);
        } catch (error) {
            console.error('Failed to delete product:', error);
            toast.error('Failed to delete product');
        }
    };

    const handleDeleteCategory = async (categoryId: number, categoryName: string) => {
        if (!window.confirm(`Are you sure you want to delete "${categoryName}"? This will also delete all subcategories.`)) {
            return;
        }

        try {
            await categoryService.deleteCategory(categoryId);
            toast.success('Category deleted successfully');
            const categoriesData = await categoryService.getAllCategories();
            setCategories(categoriesData);
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
        return cats.map(cat => (
            <React.Fragment key={cat.id}>
                <tr className={level > 0 ? 'bg-gray-50' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center" style={{ paddingLeft: `${level * 20}px` }}>
                            {level > 0 && <span className="text-gray-400 mr-2">↳</span>}
                            <div className="text-sm font-medium text-gray-900">{cat.name}</div>
                        </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {cat.slug}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {cat.description || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                            onClick={() => handleDeleteCategory(cat.id, cat.name)}
                            className="text-red-600 hover:text-red-900 ml-4"
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
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-gray-200 w-1/4 rounded"></div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-32 bg-gray-200 rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    const metricCards = [
        { title: 'Total Revenue', value: formatPrice(metrics?.totalRevenue || 0), icon: DollarSign, color: 'bg-green-500' },
        { title: 'Total Orders', value: metrics?.totalOrders || 0, icon: ShoppingCart, color: 'bg-blue-500' },
        { title: 'Total Products', value: metrics?.totalProducts || 0, icon: Package, color: 'bg-purple-500' },
        { title: 'Total Customers', value: metrics?.totalCustomers || 0, icon: Users, color: 'bg-orange-500' }
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                <div className="space-x-4">
                    {activeTab === 'categories' && (
                        <Button onClick={() => setShowAddCategory(!showAddCategory)}>
                            <Plus className="h-4 w-4 mr-2" />
                            {showAddCategory ? 'Cancel' : 'Add Category'}
                        </Button>
                    )}
                    {activeTab === 'products' && (
                        <Button onClick={() => setShowAddProduct(!showAddProduct)}>
                            <Plus className="h-4 w-4 mr-2" />
                            {showAddProduct ? 'Cancel' : 'Add Product'}
                        </Button>
                    )}
                </div>
            </div>

            {/* Tabs */}
            <div className="mb-6 border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`${activeTab === 'overview' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                    >
                        Overview
                    </button>
                    <button
                        onClick={() => setActiveTab('products')}
                        className={`${activeTab === 'products' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                    >
                        Products ({products.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('categories')}
                        className={`${activeTab === 'categories' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                    >
                        Categories
                    </button>
                    <button
                        onClick={() => setActiveTab('customers')}
                        className={`${activeTab === 'customers' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                    >
                        Customers
                    </button>
                </nav>
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {metricCards.map((metric, index) => (
                        <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-2">{metric.value}</p>
                                </div>
                                <div className={`p-3 rounded-full ${metric.color}`}>
                                    <metric.icon className="h-6 w-6 text-white" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Categories Tab */}
            {activeTab === 'categories' && (
                <>
                    {showAddCategory && (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
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
                                        <Input
                                            id="cat-description"
                                            name="description"
                                            value={categoryFormData.description}
                                            onChange={handleCategoryInputChange}
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <Button type="submit" disabled={isSubmitting}>
                                        {isSubmitting ? 'Creating...' : 'Create Category'}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    )}

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900">All Categories</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                                    {renderCategoryList(categories)}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}

            {/* Products Tab */}
            {activeTab === 'products' && (
                <>
                    {showAddProduct && (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
                            <h2 className="text-xl font-bold mb-6">Add New Product</h2>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Product Name</Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="slug">Slug</Label>
                                        <Input
                                            id="slug"
                                            name="slug"
                                            value={formData.slug}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="price">Price</Label>
                                        <Input
                                            id="price"
                                            name="price"
                                            type="number"
                                            step="0.01"
                                            value={formData.price}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="stock">Stock</Label>
                                        <Input
                                            id="stock"
                                            name="stock"
                                            type="number"
                                            value={formData.stock}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="category">Category</Label>
                                        <select
                                            id="category"
                                            name="categoryId"
                                            value={formData.categoryId}
                                            onChange={handleInputChange}
                                            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            required
                                        >
                                            <option value="">Select a category</option>
                                            {renderCategoryOptions(categories)}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="image">Product Image</Label>
                                        <div className="flex items-center space-x-2">
                                            <Input
                                                id="image"
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFileChange}
                                                className="cursor-pointer"
                                            />
                                            <Upload className="h-4 w-4 text-gray-500" />
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="flex justify-end">
                                    <Button type="submit" disabled={isSubmitting}>
                                        {isSubmitting ? 'Creating...' : 'Create Product'}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    )}

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900">All Products</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Product
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Category
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Price
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Stock
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {products.map((product) => (
                                        <tr key={product.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="h-10 w-10 flex-shrink-0">
                                                        <img className="h-10 w-10 rounded object-cover" src={product.imageUrl || 'https://placehold.co/40x40?text=No+Image'} alt={product.name} />
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                                        <div className="text-sm text-gray-500">{product.slug}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {product.categoryName}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {formatPrice(product.price)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {product.stock}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                    {product.isActive ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteProduct(product.id, product.name);
                                                    }}
                                                    className="text-red-600 hover:text-red-900 ml-4"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}

            {/* Categories Tab */}
            {activeTab === 'categories' && (
                <>
                    {showAddCategory && (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Add New Category</h2>
                            <form onSubmit={handleCategorySubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="categoryName">Category Name</Label>
                                        <Input
                                            id="categoryName"
                                            name="name"
                                            value={categoryFormData.name}
                                            onChange={handleCategoryInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="categorySlug">Slug</Label>
                                        <Input
                                            id="categorySlug"
                                            name="slug"
                                            value={categoryFormData.slug}
                                            onChange={handleCategoryInputChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="categoryDescription">Description</Label>
                                    <Textarea
                                        id="categoryDescription"
                                        name="description"
                                        value={categoryFormData.description}
                                        onChange={handleCategoryInputChange}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="parentCategory">Parent Category (Optional)</Label>
                                    <select
                                        id="parentCategory"
                                        name="parentId"
                                        value={categoryFormData.parentId}
                                        onChange={handleCategoryInputChange}
                                        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <option value="">None (Root Category)</option>
                                        {renderCategoryOptions(categories)}
                                    </select>
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
                        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                            <h2 className="text-lg font-semibold text-gray-900">All Categories</h2>
                            <Button onClick={() => setShowAddCategory(!showAddCategory)}>
                                <Plus className="h-4 w-4 mr-2" />
                                Add Category
                            </Button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                                    {renderCategoryList(categories)}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}

            {/* Customers Tab */}
            {activeTab === 'customers' && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900">Recent Customers</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Email
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Role
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {customers.map((customer) => (
                                    <tr key={customer.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {customer.firstName} {customer.lastName}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {customer.email}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${customer.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}>
                                                {customer.role}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};
