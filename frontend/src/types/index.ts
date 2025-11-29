export interface Product {
    id: number;
    name: string;
    slug: string;
    description: string;
    price: number;
    imageUrl: string;
    categoryId: number;
    categoryName: string;
    stock: number;
    isActive: boolean;
}

export interface Category {
    id: number;
    name: string;
    slug: string;
    description?: string;
    imageUrl?: string;
    parentId?: number;
    parentName?: string;
    subcategories?: Category[];
    isActive?: boolean;
}

export interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role: 'USER' | 'ADMIN';
}

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    user: User;
}

export interface PaginatedResponse<T> {
    content: T[];
    pageNo: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    last: boolean;
}
