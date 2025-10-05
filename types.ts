import type { ReactNode } from 'react';
import { VIEWS } from './constants';

export type View = typeof VIEWS[keyof typeof VIEWS];

export interface NavItem {
    id: View;
    label: string;
    // FIX: Use ReactNode for the icon type to resolve the JSX namespace error.
    icon: ReactNode;
}

export interface Product {
    id: string;
    name: string;
    category: string;
    price: number;
    currency: string;
    stock: number;
    status: 'In Stock' | 'Low Stock' | 'Out of Stock';
    imageUrls: string[];
}

export interface Order {
    id: string;
    customerName: string;
    date: string;
    total: number;
    status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
    items: { productId: string; quantity: number }[];
}

export interface BlogPost {
    id: string;
    title: string;
    author: string;
    date: string;
    status: 'Published' | 'Draft';
    traffic: number;
    imageUrls: string[];
}

export interface AiSubscriptionTier {
    name: string;
    price: string;
    users: string;
    features: string[];
}

export interface Course {
    id: string;
    title: string;
    instructor: string;
    students: number;
    price: number;
    status: 'Live' | 'Upcoming';
    coverImageUrl: string;
    materialsFile?: {
        name: string;
        size: number; // in bytes
    };
}

export interface Ebook {
    id: string;
    title: string;
    author: string;
    sales: number;
    revenue: number;
    status: 'Published' | 'Pending';
    coverImageUrl: string;
    file?: {
        name: string;
        size: number; // in bytes
    };
}

export interface Notification {
    id: string;
    icon: ReactNode;
    iconBgColor: string;
    text: ReactNode;
    timestamp: string;
}

export interface Action {
    id: string;
    label: string;
    subsidiary: string;
    view: View;
}

export interface SearchResult {
  id: string;
  type: 'Navigation' | 'Product' | 'Blog Post' | 'Course' | 'Ebook';
  title: string;
  subsidiary?: string;
  view: View;
  icon: ReactNode;
}
