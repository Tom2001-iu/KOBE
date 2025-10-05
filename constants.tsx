import React from 'react';
import type { NavItem, Product, BlogPost, AiSubscriptionTier, Course, Ebook, Order, Notification, Action } from './types';
// FIX: Removed circular import of `VIEWS`. This file defines `VIEWS` and should not import it from itself.

export const VIEWS = {
    DASHBOARD: 'Dashboard',
    GLOBAL_ANALYTICS: 'Global Analytics',
    BEOK: 'BEOK',
    WORDS: "WORD'S",
    VOID_AI: 'VÓID AI',
    ESCAN: 'ESCAN',
    EBOK: 'EBOK',
} as const;

export const NAV_ITEMS: NavItem[] = [
    { id: VIEWS.DASHBOARD, label: 'Dashboard', icon: <HomeIcon /> },
    { id: VIEWS.GLOBAL_ANALYTICS, label: 'Global Analytics', icon: <GlobeIcon /> },
    { id: VIEWS.BEOK, label: 'BEOK', icon: <ShirtIcon /> },
    { id: VIEWS.WORDS, label: "WORD'S", icon: <PenSquareIcon /> },
    { id: VIEWS.VOID_AI, label: 'VÓID AI', icon: <BotIcon /> },
    { id: VIEWS.ESCAN, label: 'ESCAN', icon: <BookOpenIcon /> },
    { id: VIEWS.EBOK, label: 'EBOK', icon: <LibraryIcon /> },
];

// Mock Data
export const MOCK_PRODUCTS: Product[] = [
    { id: 'p1', name: 'Quantum Hoodie', category: 'Apparel', price: 89.99, currency: 'USD', stock: 120, status: 'In Stock', imageUrls: ['https://picsum.photos/seed/p1/400'] },
    { id: 'p2', name: 'Nebula T-Shirt', category: 'Apparel', price: 34.99, currency: 'USD', stock: 35, status: 'Low Stock', imageUrls: ['https://picsum.photos/seed/p2/400'] },
    { id: 'p3', name: 'Cyber Sneakers', category: 'Footwear', price: 129.99, currency: 'USD', stock: 0, status: 'Out of Stock', imageUrls: ['https://picsum.photos/seed/p3/400'] },
    { id: 'p4', name: 'Urban Explorer Jacket', category: 'Outerwear', price: 199.99, currency: 'USD', stock: 75, status: 'In Stock', imageUrls: ['https://picsum.photos/seed/p4/400'] },
];

export const MOCK_ORDERS: Order[] = [
    { id: 'ORD-001', customerName: 'Alice Johnson', date: '2024-07-21', total: 124.98, status: 'Shipped', items: [{productId: 'p1', quantity: 1}, {productId: 'p2', quantity: 1}] },
    { id: 'ORD-002', customerName: 'Bob Williams', date: '2024-07-21', total: 199.99, status: 'Processing', items: [{productId: 'p4', quantity: 1}] },
    { id: 'ORD-003', customerName: 'Charlie Brown', date: '2024-07-20', total: 259.98, status: 'Delivered', items: [{productId: 'p3', quantity: 2}] },
    { id: 'ORD-004', customerName: 'Diana Prince', date: '2024-07-19', total: 89.99, status: 'Cancelled', items: [{productId: 'p1', quantity: 1}] },
];


export const MOCK_POSTS: BlogPost[] = [
    { id: 'b1', title: 'The Future of AI in Content Creation', author: 'Jane Doe', date: '2024-07-20', status: 'Published', traffic: 12500, imageUrls: ['https://picsum.photos/seed/b1/400/200'] },
    { id: 'b2', title: 'Top 10 React Hooks for 2024', author: 'John Smith', date: '2024-07-18', status: 'Published', traffic: 8900, imageUrls: ['https://picsum.photos/seed/b2/400/200'] },
    { id: 'b3', title: 'Unlocking Creativity with VÓID AI', author: 'AI Assistant', date: '2024-07-15', status: 'Draft', traffic: 0, imageUrls: [] },
];

export const MOCK_AI_TIERS: AiSubscriptionTier[] = [
    { name: 'Free', price: '$0/mo', users: '1 User', features: ['Basic Chatbot', '100 requests/day', 'Community Support'] },
    { name: 'Pro', price: '$49/mo', users: '5 Users', features: ['Advanced AI', '10,000 requests/day', 'API Access', 'Email Support'] },
    { name: 'Business', price: '$199/mo', users: '20 Users', features: ['Pro Features', 'Custom Models', 'Dedicated Support', 'SSO'] },
    { name: 'Enterprise', price: 'Custom', users: 'Unlimited', features: ['Business Features', 'On-premise option', 'SLA', '24/7 Support'] },
];

export const MOCK_COURSES: Course[] = [
    { id: 'c1', title: 'Advanced Machine Learning', instructor: 'Dr. Eva Rostova', students: 1240, price: 299, status: 'Live', coverImageUrl: 'https://picsum.photos/seed/c1/400/200' },
    { id: 'c2', title: 'React for Beginners', instructor: 'Tom West', students: 8560, price: 99, status: 'Live', coverImageUrl: 'https://picsum.photos/seed/c2/400/200' },
    { id: 'c3', title: 'UX Design Fundamentals', instructor: 'Maria Garcia', students: 0, price: 149, status: 'Upcoming', coverImageUrl: 'https://picsum.photos/seed/c3/400/200' },
];

export const MOCK_EBOOKS: Ebook[] = [
    { id: 'e1', title: 'The Silicon Mind', author: 'Kenji Tanaka', sales: 5400, revenue: 53460, status: 'Published', coverImageUrl: 'https://picsum.photos/seed/e1/200/300' },
    { id: 'e2', title: 'Digital Nomad\'s Guide', author: 'Aisha Khan', sales: 12000, revenue: 119880, status: 'Published', coverImageUrl: 'https://picsum.photos/seed/e2/200/300' },
    { id: 'e3', title: 'Cooking with Code', author: 'Chef GPT', sales: 0, revenue: 0, status: 'Pending', coverImageUrl: 'https://picsum.photos/seed/e3/200/300' },
];

export const CHART_DATA = [
  { name: 'Jan', BEOK: 4000, WORDS: 2400, VOID_AI: 1800, ESCAN: 3200, EBOK: 1500, amt: 2400 },
  { name: 'Feb', BEOK: 3000, WORDS: 1398, VOID_AI: 2210, ESCAN: 3500, EBOK: 1800, amt: 2210 },
  { name: 'Mar', BEOK: 2000, WORDS: 9800, VOID_AI: 2290, ESCAN: 3900, EBOK: 2100, amt: 2290 },
  { name: 'Apr', BEOK: 2780, WORDS: 3908, VOID_AI: 2000, ESCAN: 4100, EBOK: 2500, amt: 2000 },
  { name: 'May', BEOK: 1890, WORDS: 4800, VOID_AI: 2181, ESCAN: 4500, EBOK: 2800, amt: 2181 },
  { name: 'Jun', BEOK: 2390, WORDS: 3800, VOID_AI: 2500, ESCAN: 4800, EBOK: 3100, amt: 2500 },
  { name: 'Jul', BEOK: 3490, WORDS: 4300, VOID_AI: 2100, ESCAN: 5100, EBOK: 3500, amt: 2100 },
];

export const SUBSCRIPTION_GROWTH_DATA = [
  { name: 'Jan', Free: 12000, Pro: 2400, Business: 500 },
  { name: 'Feb', Free: 15000, Pro: 3500, Business: 750 },
  { name: 'Mar', Free: 18000, Pro: 5200, Business: 1200 },
  { name: 'Apr', Free: 20000, Pro: 6800, Business: 1800 },
  { name: 'May', Free: 22000, Pro: 8100, Business: 2500 },
  { name: "Jun", Free: 25000, Pro: 9500, Business: 3100 },
  { name: "Jul", Free: 28000, Pro: 11000, Business: 3800 },
];

// FIX: Export INITIAL_USER_GROWTH so it can be shared between Dashboard and GlobalAnalytics components.
export const INITIAL_USER_GROWTH = [
  { name: 'Jan', users: 180000 },
  { name: 'Feb', users: 195000 },
  { name: 'Mar', users: 205000 },
  { name: 'Apr', users: 218000 },
  { name: 'May', users: 235000 },
  { name: 'Jun', users: 245301 },
];

export const MOCK_NOTIFICATIONS: Notification[] = [
    {
        id: 'notif-1',
        icon: <>📦</>,
        iconBgColor: 'bg-blue-500/20 text-blue-400',
        text: <>New large order on <span className="text-brand-accent">BEOK</span> for $2,450.</>,
        timestamp: '2 minutes ago'
    },
    {
        id: 'notif-2',
        icon: <>📈</>,
        iconBgColor: 'bg-green-500/20 text-green-400',
        text: <><span className="text-brand-accent">VÓID AI</span> Pro subscriptions are up 15% this week.</>,
        timestamp: '1 hour ago'
    },
    {
        id: 'notif-3',
        icon: <>✍️</>,
        iconBgColor: 'bg-yellow-500/20 text-yellow-400',
        text: <>New blog post "AI in 2025" published on <span className="text-brand-accent">WORD'S</span>.</>,
        timestamp: '4 hours ago'
    },
    {
        id: 'notif-4',
        icon: <>🎓</>,
        iconBgColor: 'bg-pink-500/20 text-pink-400',
        text: <>12 new enrollments in 'Advanced ML' on <span className="text-brand-accent">ESCAN</span>.</>,
        timestamp: 'Yesterday'
    },
     {
        id: 'notif-5',
        icon: <>💾</>,
        iconBgColor: 'bg-teal-500/20 text-teal-400',
        text: <>"The Silicon Mind" on <span className="text-brand-accent">EBOK</span> has passed 5,000 sales.</>,
        timestamp: 'Yesterday'
    },
];

export const MOCK_QUICK_ACTIONS: Action[] = [
    { id: 'qa-1', label: 'Add Product', subsidiary: 'BEOK', view: VIEWS.BEOK },
    { id: 'qa-2', label: 'New Post', subsidiary: "WORD'S", view: VIEWS.WORDS },
    { id: 'qa-3', label: 'Add Course', subsidiary: 'ESCAN', view: VIEWS.ESCAN },
    { id: 'qa-4', label: 'Upload Ebook', subsidiary: 'EBOK', view: VIEWS.EBOK },
];

// Icons
export function HomeIcon() { return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;}
export function GlobeIcon() { return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>;}
export function ShirtIcon() { return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99 .84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/></svg>;}
export function PenSquareIcon() { return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;}
export function BotIcon() { return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>;}
export function BookOpenIcon() { return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>;}
export function LibraryIcon() { return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m16 6 4 14"/><path d="M12 6v14"/><path d="M8 8v12"/><path d="M4 4v16"/></svg>;}
