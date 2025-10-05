import React from 'react';
import type { Order, Product } from '../../types';

interface OrderDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    order: Order;
    allProducts: Product[];
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ isOpen, onClose, order, allProducts }) => {
    if (!isOpen) return null;

    const getProductDetails = (productId: string) => {
        return allProducts.find(p => p.id === productId);
    };
    
    const getStatusClass = (status: Order['status']) => {
        switch (status) {
            case 'Processing': return 'bg-blue-500/20 text-blue-400';
            case 'Shipped': return 'bg-purple-500/20 text-purple-400';
            case 'Delivered': return 'bg-green-500/20 text-green-400';
            case 'Cancelled': return 'bg-red-500/20 text-red-400';
        }
    };

    return (
        <div 
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-fade-in p-4"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="order-details-title"
        >
            <div 
                className="bg-brand-secondary rounded-lg shadow-xl p-6 md:p-8 w-full max-w-2xl animate-scale-in max-h-[90vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h3 id="order-details-title" className="text-2xl font-bold text-white">Order Details</h3>
                        <p className="text-sm text-brand-text-secondary font-mono">{order.id}</p>
                    </div>
                     <span className={`px-3 py-1.5 rounded-full text-sm font-semibold ${getStatusClass(order.status)}`}>
                        {order.status}
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-brand-dark p-4 rounded-lg">
                        <h4 className="font-semibold text-brand-text-secondary text-sm mb-2">Customer</h4>
                        <p className="text-white font-medium">{order.customerName}</p>
                    </div>
                     <div className="bg-brand-dark p-4 rounded-lg">
                        <h4 className="font-semibold text-brand-text-secondary text-sm mb-2">Order Date</h4>
                        <p className="text-white font-medium">{order.date}</p>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto -mx-6 px-6">
                    <h4 className="font-semibold text-brand-text-secondary text-sm mb-2">Items</h4>
                    <ul className="divide-y divide-gray-700/50">
                        {order.items.map(item => {
                            const product = getProductDetails(item.productId);
                            if (!product) return null;
                            return (
                                <li key={item.productId} className="flex items-center py-4">
                                    <img src={product.imageUrls[0]} alt={product.name} className="w-16 h-16 rounded-md object-cover mr-4" />
                                    <div className="flex-1">
                                        <p className="font-semibold text-white">{product.name}</p>
                                        <p className="text-sm text-brand-text-secondary">Qty: {item.quantity}</p>
                                    </div>
                                    <p className="font-medium text-white">${(product.price * item.quantity).toFixed(2)}</p>
                                </li>
                            );
                        })}
                    </ul>
                </div>

                <div className="border-t border-gray-700/50 mt-6 pt-4 flex justify-between items-center">
                    <span className="font-bold text-lg text-white">Total</span>
                    <span className="font-bold text-lg text-brand-accent">${order.total.toFixed(2)}</span>
                </div>

                <div className="mt-8 flex justify-end">
                    <button
                        onClick={onClose}
                        className="bg-brand-accent hover:bg-brand-accent-hover text-white font-bold py-2 px-4 rounded-lg transition-all duration-200 active:scale-95"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailsModal;
