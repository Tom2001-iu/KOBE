import React, { useState, useMemo, useEffect } from 'react';
import { getProducts, getOrders } from '../services/api';
import type { Product, Order } from '../types';
import ConfirmationModal from './shared/ConfirmationModal';
import OrderDetailsModal from './shared/OrderDetailsModal';
import { MOCK_PRODUCTS } from '../constants';


const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
};

const ImagePreviewModal: React.FC<{ imageUrls: string[]; onClose: () => void; productName: string }> = ({ imageUrls, onClose, productName }) => {
    // Basic preview for now, can be enhanced to a carousel
    const imageUrl = imageUrls[0];
    return (
        <div 
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fade-in"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="image-preview-title"
        >
            <div 
                className="relative bg-brand-secondary p-2 rounded-lg shadow-xl animate-scale-in max-w-[90vw]"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 id="image-preview-title" className="sr-only">{productName} - Image Preview</h2>
                <img src={imageUrl} alt={productName} className="max-w-full max-h-[80vh] object-contain rounded-md" />
                <button 
                    onClick={onClose} 
                    className="absolute top-0 right-0 m-2 bg-brand-dark/50 hover:bg-brand-dark/80 text-white rounded-full p-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-accent active:scale-95"
                    aria-label="Close image preview"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
            </div>
        </div>
    );
};

const ProductModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (product: Product) => void;
    product?: Product | null;
}> = ({ isOpen, onClose, onSubmit, product }) => {
    const isEditMode = !!product;
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [currency, setCurrency] = useState('USD');
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isEditMode && product) {
            setName(product.name);
            setCategory(product.category);
            setPrice(product.price.toString());
            setStock(product.stock.toString());
            setCurrency(product.currency);
            setImagePreviews(product.imageUrls);
        } else {
            // Reset form for "Add" mode or when modal closes
            setName('');
            setCategory('');
            setPrice('');
            setStock('');
            setCurrency('USD');
            setImagePreviews([]);
        }
    }, [product, isEditMode, isOpen]);


    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setError('');
            const files = Array.from(e.target.files);
            if (files.length + imagePreviews.length > 5) {
                setError("You can upload a maximum of 5 images.");
                return;
            }
            const base64Promises = files.map(fileToBase64);
            const newPreviews = await Promise.all(base64Promises);
            setImagePreviews(prev => [...prev, ...newPreviews]);
        }
    };

    const removeImage = (index: number) => {
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const priceNum = parseFloat(price);
        const stockNum = parseInt(stock, 10);
        if (!name || !category || isNaN(priceNum) || isNaN(stockNum) || priceNum <= 0 || stockNum < 0) {
            setError('Please fill in all fields with valid data.');
            return;
        }
         if (imagePreviews.length === 0) {
            setError('Please upload at least one product image.');
            return;
        }
        
        const submittedProduct: Product = {
            id: isEditMode ? product.id : `p${Date.now()}`,
            name,
            category,
            price: priceNum,
            stock: stockNum,
            imageUrls: imagePreviews,
            currency,
            status: stockNum > 40 ? 'In Stock' : stockNum > 0 ? 'Low Stock' : 'Out of Stock',
        };

        onSubmit(submittedProduct);
        onClose();
    };
    
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-fade-in p-4" onClick={onClose}>
            <div className="bg-brand-secondary rounded-lg shadow-xl p-6 md:p-8 w-full max-w-2xl animate-scale-in" onClick={(e) => e.stopPropagation()}>
                <h3 className="text-xl md:text-2xl font-bold mb-6">{isEditMode ? 'Edit Product' : 'Add New Product'}</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="text" placeholder="Product Name" value={name} onChange={e => setName(e.target.value)} className="w-full bg-brand-dark border border-gray-700 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-brand-accent" />
                        <input type="text" placeholder="Category" value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-brand-dark border border-gray-700 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-brand-accent" />
                        <div className="flex space-x-2">
                            <input type="number" placeholder="Price" value={price} onChange={e => setPrice(e.target.value)} className="w-full bg-brand-dark border border-gray-700 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-brand-accent" min="0.01" step="0.01" />
                            <select value={currency} onChange={e => setCurrency(e.target.value)} className="bg-brand-dark border border-gray-700 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-brand-accent">
                                <option value="USD">USD</option>
                                <option value="EUR">EUR</option>
                                <option value="GBP">GBP</option>
                                <option value="JPY">JPY</option>
                            </select>
                        </div>
                        <input type="number" placeholder="Stock" value={stock} onChange={e => setStock(e.target.value)} className="w-full bg-brand-dark border border-gray-700 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-brand-accent" min="0" step="1" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-brand-text-secondary mb-2">Product Images (up to 5)</label>
                        <input type="file" multiple accept="image/*" onChange={handleImageChange} className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-brand-accent file:text-white hover:file:bg-brand-accent-hover"/>
                        <div className="mt-4 grid grid-cols-3 sm:grid-cols-5 gap-4">
                            {imagePreviews.map((src, index) => (
                                <div key={index} className="relative group">
                                    <img src={src} alt={`Preview ${index + 1}`} className="w-24 h-24 object-cover rounded-md" />
                                    <button type="button" onClick={() => removeImage(index)} className="absolute top-0 right-0 bg-red-600/80 text-white rounded-full p-0.5 m-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                    {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
                    <div className="mt-6 flex justify-end space-x-4">
                        <button type="button" onClick={onClose} className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-all duration-200 active:scale-95">Cancel</button>
                        <button type="submit" className="bg-brand-accent hover:bg-brand-accent-hover text-white font-bold py-2 px-4 rounded-lg transition-all duration-200 active:scale-95">{isEditMode ? 'Update Product' : 'Add Product'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


const TableLoadingSpinner: React.FC<{ colSpan: number }> = ({ colSpan }) => (
    <tr>
        <td colSpan={colSpan} className="text-center py-10">
            <div className="flex justify-center items-center">
                <svg className="animate-spin h-8 w-8 text-brand-accent" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="ml-4 text-brand-text-secondary">Loading data...</span>
            </div>
        </td>
    </tr>
);

const BeokControl: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoadingProducts, setIsLoadingProducts] = useState(true);
    const [isLoadingOrders, setIsLoadingOrders] = useState(true);

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<Product['status'] | 'All'>('All');
    const [sortConfig, setSortConfig] = useState<{ key: keyof Product | null; direction: 'ascending' | 'descending' }>({ key: 'name', direction: 'ascending' });
    
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [isOrderDetailsModalOpen, setIsOrderDetailsModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [productToEdit, setProductToEdit] = useState<Product | null>(null);
    const [productToDelete, setProductToDelete] = useState<Product | null>(null);
    const [modalProductImage, setModalProductImage] = useState<Product | null>(null);

    useEffect(() => {
        let isMounted = true;
        setIsLoadingProducts(true);
        getProducts().then(data => {
            if (isMounted) {
                setProducts(data);
                setIsLoadingProducts(false);
            }
        });

        setIsLoadingOrders(true);
        getOrders().then(data => {
            if (isMounted) {
                setOrders(data);
                setIsLoadingOrders(false);
            }
        });

        const intervalId = setInterval(() => {
            if (!isMounted) return;

            // Simulate product stock changes
            setProducts(prevProducts => {
                if (prevProducts.length === 0 || Math.random() < 0.5) return prevProducts;
                const newProducts = [...prevProducts];
                const productIndex = Math.floor(Math.random() * newProducts.length);
                const productToUpdate = { ...newProducts[productIndex] };
                
                const change = Math.random() > 0.8 ? Math.floor(Math.random() * 5) : -Math.floor(Math.random() * 2);
                productToUpdate.stock = Math.max(0, productToUpdate.stock + change);

                if (productToUpdate.stock <= 0) productToUpdate.status = 'Out of Stock';
                else if (productToUpdate.stock < 40) productToUpdate.status = 'Low Stock';
                else productToUpdate.status = 'In Stock';

                newProducts[productIndex] = productToUpdate;
                return newProducts;
            });

            // Simulate order status changes
            setOrders(prevOrders => {
                if (prevOrders.length === 0 || Math.random() < 0.7) return prevOrders;
                const processableOrders = prevOrders.filter(o => o.status === 'Processing');
                if (processableOrders.length === 0) return prevOrders;
                
                const newOrders = [...prevOrders];
                const orderToUpdate = processableOrders[Math.floor(Math.random() * processableOrders.length)];
                const orderIndex = newOrders.findIndex(o => o.id === orderToUpdate.id);
                if (orderIndex !== -1) {
                    newOrders[orderIndex] = { ...orderToUpdate, status: 'Shipped' };
                }
                return newOrders;
            });

        }, 4000);

        return () => {
            isMounted = false;
            clearInterval(intervalId);
        };
    }, []);

    const filteredAndSortedProducts = useMemo(() => {
        let sortableItems = [...products];

        // Filtering
        sortableItems = sortableItems.filter(product =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (statusFilter === 'All' || product.status === statusFilter)
        );

        // Sorting
        if (sortConfig.key) {
            sortableItems.sort((a, b) => {
                const key = sortConfig.key as keyof Omit<Product, 'imageUrls'>;
                if (a[key] < b[key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[key] > b[key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }

        return sortableItems;
    }, [products, searchTerm, statusFilter, sortConfig]);

    const requestSort = (key: keyof Product) => {
        if (key === 'imageUrls') return;
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const getProductStatusClass = (status: Product['status']) => {
        switch (status) {
            case 'In Stock': return 'bg-green-500/20 text-green-400';
            case 'Low Stock': return 'bg-yellow-500/20 text-yellow-400';
            case 'Out of Stock': return 'bg-red-500/20 text-red-400';
        }
    }

    const getOrderStatusClass = (status: Order['status']) => {
        switch (status) {
            case 'Processing': return 'bg-blue-500/20 text-blue-400';
            case 'Shipped': return 'bg-purple-500/20 text-purple-400';
            case 'Delivered': return 'bg-green-500/20 text-green-400';
            case 'Cancelled': return 'bg-red-500/20 text-red-400';
        }
    };
    
    const handleAddProduct = (newProduct: Product) => {
        setProducts(prev => [newProduct, ...prev]);
    };

    const handleUpdateProduct = (updatedProduct: Product) => {
        setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    };
    
    const handleDeleteProduct = () => {
        if (!productToDelete) return;
        setProducts(prev => prev.filter(p => p.id !== productToDelete.id));
        setProductToDelete(null);
    };

    const handleOpenEditModal = (product: Product) => {
        setProductToEdit(product);
        setIsProductModalOpen(true);
    };
    
    const handleOpenAddModal = () => {
        setProductToEdit(null);
        setIsProductModalOpen(true);
    };
    
    const handleViewOrderDetails = (order: Order) => {
        setSelectedOrder(order);
        setIsOrderDetailsModalOpen(true);
    };

    const handleCloseProductModal = () => {
        setIsProductModalOpen(false);
        setProductToEdit(null);
    };

    const formatCurrency = (amount: number, currency: string) => {
        try {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: currency,
            }).format(amount);
        } catch (e) {
            // Fallback for unsupported currency codes in this simple setup
            return `${currency} ${amount.toFixed(2)}`;
        }
    };

    return (
        <div className="space-y-8">
            {modalProductImage && <ImagePreviewModal imageUrls={modalProductImage.imageUrls} productName={modalProductImage.name} onClose={() => setModalProductImage(null)} />}
            <ProductModal 
                isOpen={isProductModalOpen}
                onClose={handleCloseProductModal}
                onSubmit={productToEdit ? handleUpdateProduct : handleAddProduct}
                product={productToEdit}
            />
            {selectedOrder && (
                <OrderDetailsModal 
                    isOpen={isOrderDetailsModalOpen}
                    onClose={() => setIsOrderDetailsModalOpen(false)}
                    order={selectedOrder}
                    allProducts={MOCK_PRODUCTS}
                />
            )}
            <ConfirmationModal
                isOpen={!!productToDelete}
                onClose={() => setProductToDelete(null)}
                onConfirm={handleDeleteProduct}
                title="Delete Product"
                message={<>Are you sure you want to permanently delete <strong>{productToDelete?.name}</strong>? This action cannot be undone.</>}
                confirmButtonText="Delete"
            />
            
            <div className="flex flex-col md:flex-row justify-between md:items-center space-y-4 md:space-y-0">
                <h2 className="text-3xl font-bold">BEOK Management</h2>
                <button 
                    onClick={handleOpenAddModal}
                    className="bg-brand-accent hover:bg-brand-accent-hover text-white font-bold py-2 px-4 rounded-lg transition-all duration-200 self-start md:self-auto active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-dark focus:ring-brand-accent"
                >
                    Add New Product
                </button>
            </div>
            
            {/* Product Management Section */}
            <div className="space-y-6">
                <h3 className="text-2xl font-bold">Product Inventory</h3>
                <div className="bg-brand-secondary p-4 rounded-lg shadow-lg flex flex-col md:flex-row items-stretch md:items-center space-y-4 md:space-y-0 md:space-x-4">
                    <input
                        type="text"
                        placeholder="Search by name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-brand-dark border border-gray-700 rounded-lg py-2 px-4 w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-brand-accent"
                    />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as Product['status'] | 'All')}
                        className="bg-brand-dark border border-gray-700 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-brand-accent w-full md:w-auto"
                    >
                        <option value="All">All Statuses</option>
                        <option value="In Stock">In Stock</option>
                        <option value="Low Stock">Low Stock</option>
                        <option value="Out of Stock">Out of Stock</option>
                    </select>
                </div>

                <div className="bg-brand-secondary rounded-lg shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-brand-text-secondary whitespace-nowrap">
                            <thead className="text-xs text-brand-text uppercase bg-gray-700/50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 cursor-pointer select-none" onClick={() => requestSort('name')}>
                                        Product Name
                                    </th>
                                    <th scope="col" className="px-6 py-3 cursor-pointer select-none" onClick={() => requestSort('category')}>
                                        Category
                                    </th>
                                    <th scope="col" className="px-6 py-3 cursor-pointer select-none" onClick={() => requestSort('price')}>
                                        Price
                                    </th>
                                    <th scope="col" className="px-6 py-3 cursor-pointer select-none" onClick={() => requestSort('stock')}>
                                        Stock
                                    </th>
                                    <th scope="col" className="px-6 py-3">Status</th>
                                    <th scope="col" className="px-6 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoadingProducts ? (
                                    <TableLoadingSpinner colSpan={6} />
                                ) : (
                                    filteredAndSortedProducts.map((product, index) => (
                                        <tr key={product.id} className="bg-brand-secondary border-b border-gray-700 hover:bg-gray-700/50 animate-fade-in-up" style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'backwards' }}>
                                            <th scope="row" className="px-6 py-4 font-medium text-white flex items-center">
                                                <button 
                                                    onClick={() => setModalProductImage(product)} 
                                                    className="mr-4 flex-shrink-0 cursor-pointer transition-transform duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2 focus:ring-offset-brand-secondary rounded-md relative group"
                                                    aria-label={`View larger image for ${product.name}`}
                                                >
                                                    <img src={product.imageUrls[0]} alt={product.name} className="w-10 h-10 rounded-md object-cover"/>
                                                    {product.imageUrls.length > 1 && (
                                                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <span className="text-white text-xs font-bold">+{product.imageUrls.length - 1}</span>
                                                        </div>
                                                    )}
                                                </button>
                                                <span className="whitespace-normal">{product.name}</span>
                                            </th>
                                            <td className="px-6 py-4">{product.category}</td>
                                            <td className="px-6 py-4">{formatCurrency(product.price, product.currency)}</td>
                                            <td className="px-6 py-4">{product.stock}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getProductStatusClass(product.status)}`}>
                                                    {product.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 space-x-2">
                                                <button onClick={() => handleOpenEditModal(product)} className="font-medium text-blue-500 hover:underline focus:outline-none focus:ring-2 focus:ring-brand-accent rounded">Edit</button>
                                                <button onClick={() => setProductToDelete(product)} className="font-medium text-red-500 hover:underline focus:outline-none focus:ring-2 focus:ring-brand-accent rounded">Remove</button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Order Management Section */}
            <div className="space-y-6">
                <h3 className="text-2xl font-bold">Recent Orders</h3>
                 <div className="bg-brand-secondary rounded-lg shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-brand-text-secondary whitespace-nowrap">
                            <thead className="text-xs text-brand-text uppercase bg-gray-700/50">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Order ID</th>
                                    <th scope="col" className="px-6 py-3">Customer</th>
                                    <th scope="col" className="px-6 py-3">Date</th>
                                    <th scope="col" className="px-6 py-3">Total</th>
                                    <th scope="col" className="px-6 py-3">Status</th>
                                    <th scope="col" className="px-6 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoadingOrders ? (
                                    <TableLoadingSpinner colSpan={6} />
                                ) : (
                                    orders.map((order, index) => (
                                        <tr key={order.id} className="bg-brand-secondary border-b border-gray-700 hover:bg-gray-700/50 animate-fade-in-up" style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'backwards' }}>
                                            <th scope="row" className="px-6 py-4 font-medium text-white">{order.id}</th>
                                            <td className="px-6 py-4">{order.customerName}</td>
                                            <td className="px-6 py-4">{order.date}</td>
                                            <td className="px-6 py-4">${order.total.toFixed(2)}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getOrderStatusClass(order.status)}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <button onClick={() => handleViewOrderDetails(order)} className="font-medium text-blue-500 hover:underline focus:outline-none focus:ring-2 focus:ring-brand-accent rounded">View Details</button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BeokControl;
