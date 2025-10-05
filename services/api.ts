
import { MOCK_PRODUCTS, MOCK_ORDERS, MOCK_POSTS, MOCK_COURSES, MOCK_EBOOKS, NAV_ITEMS, VIEWS } from '../constants';
import type { Product, Order, SearchResult } from '../types';
import React from 'react';

// Icons for the search results
// FIX: Converted JSX to React.createElement to be valid in a .ts file.
const ShirtIcon = () => React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, React.createElement('path', { d: "M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99 .84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" }));
const PenSquareIcon = () => React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, React.createElement('path', { d: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" }), React.createElement('path', { d: "M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" }));
const BookOpenIcon = () => React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, React.createElement('path', { d: "M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" }), React.createElement('path', { d: "M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" }));
const LibraryIcon = () => React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, React.createElement('path', { d: "m16 6 4 14" }), React.createElement('path', { d: "M12 6v14" }), React.createElement('path', { d: "M8 8v12" }), React.createElement('path', { d: "M4 4v16" }));

const RESULT_ICONS: Record<SearchResult['type'], React.ReactNode> = {
    'Navigation': React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, React.createElement('path', { d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" })),
    'Product': React.createElement(ShirtIcon),
    'Blog Post': React.createElement(PenSquareIcon),
    'Course': React.createElement(BookOpenIcon),
    'Ebook': React.createElement(LibraryIcon),
};

// Simulate network latency
const API_LATENCY = 300; // ms

/**
 * Fetches a list of products.
 * In a real app, this would be a network request to your backend.
 * @returns {Promise<Product[]>} A promise that resolves to an array of products.
 */
export const getProducts = (): Promise<Product[]> => {
    console.log("Fetching products from API...");
    return new Promise(resolve => {
        setTimeout(() => {
            console.log("...products fetched.");
            resolve([...MOCK_PRODUCTS]); // Return a copy to prevent mutation of mock data
        }, API_LATENCY);
    });
};

/**
 * Fetches a list of recent orders.
 * In a real app, this would be a network request to your backend.
 * @returns {Promise<Order[]>} A promise that resolves to an array of orders.
 */
export const getOrders = (): Promise<Order[]> => {
    console.log("Fetching orders from API...");
    return new Promise(resolve => {
        setTimeout(() => {
            console.log("...orders fetched.");
            resolve([...MOCK_ORDERS]); // Return a copy
        }, API_LATENCY + 200); // Stagger loading slightly
    });
};

/**
 * Performs a global search across all subsidiaries' data.
 * @param {string} query The search term.
 * @returns {Promise<SearchResult[]>} A promise that resolves to an array of unified search results.
 */
export const globalSearch = (query: string): Promise<SearchResult[]> => {
    console.log(`Searching for: "${query}"`);
    return new Promise(resolve => {
        setTimeout(() => {
            const lowerCaseQuery = query.toLowerCase();
            const results: SearchResult[] = [];
            
            if (!query) {
                // Return default navigation items if search is empty
                NAV_ITEMS.forEach(item => results.push({ id: item.id, type: 'Navigation', title: `Go to ${item.label}`, view: item.id, icon: item.icon }));
                resolve(results);
                return;
            }


            // Search Navigation
            NAV_ITEMS.filter(item => item.label.toLowerCase().includes(lowerCaseQuery))
                .forEach(item => results.push({ id: item.id, type: 'Navigation', title: `Go to ${item.label}`, view: item.id, icon: item.icon }));

            // Search Products
            MOCK_PRODUCTS.filter(p => p.name.toLowerCase().includes(lowerCaseQuery) || p.category.toLowerCase().includes(lowerCaseQuery))
                .forEach(p => results.push({ id: p.id, type: 'Product', title: p.name, subsidiary: 'BEOK', view: VIEWS.BEOK, icon: RESULT_ICONS['Product'] }));

            // Search Posts
            MOCK_POSTS.filter(p => p.title.toLowerCase().includes(lowerCaseQuery) || p.author.toLowerCase().includes(lowerCaseQuery))
                .forEach(p => results.push({ id: p.id, type: 'Blog Post', title: p.title, subsidiary: "WORD'S", view: VIEWS.WORDS, icon: RESULT_ICONS['Blog Post'] }));

            // Search Courses
            MOCK_COURSES.filter(c => c.title.toLowerCase().includes(lowerCaseQuery) || c.instructor.toLowerCase().includes(lowerCaseQuery))
                .forEach(c => results.push({ id: c.id, type: 'Course', title: c.title, subsidiary: 'ESCAN', view: VIEWS.ESCAN, icon: RESULT_ICONS['Course'] }));
            
            // Search Ebooks
            MOCK_EBOOKS.filter(e => e.title.toLowerCase().includes(lowerCaseQuery) || e.author.toLowerCase().includes(lowerCaseQuery))
                .forEach(e => results.push({ id: e.id, type: 'Ebook', title: e.title, subsidiary: 'EBOK', view: VIEWS.EBOK, icon: RESULT_ICONS['Ebook'] }));
            
            console.log(`...found ${results.length} results.`);
            resolve(results);
        }, 150); // Simulate network latency for search
    });
};
