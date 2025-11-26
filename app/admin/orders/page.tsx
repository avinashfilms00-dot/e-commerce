'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { useToast } from '@/components/Toast';

export default function AdminOrdersPage() {
    const { showToast, ToastComponent } = useToast();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch('/api/orders', {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (data.success) {
                setOrders(data.data);
            }
        } catch (error) {
            showToast('Failed to load orders', 'error');
        } finally {
            setLoading(false);
        }
    };

    const updateOrderStatus = async (orderId: string, orderStatus: string) => {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`/api/orders/${orderId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ orderStatus }),
            });

            if (res.ok) {
                showToast('Order status updated', 'success');
                loadOrders();
            } else {
                showToast('Failed to update order', 'error');
            }
        } catch (error) {
            showToast('An error occurred', 'error');
        }
    };

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            pending: 'bg-yellow-100 text-yellow-800',
            paid: 'bg-green-100 text-green-800',
            failed: 'bg-red-100 text-red-800',
            processing: 'bg-blue-100 text-blue-800',
            shipped: 'bg-purple-100 text-purple-800',
            delivered: 'bg-green-100 text-green-800',
            cancelled: 'bg-gray-100 text-gray-800',
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    return (
        <div className="p-8">
            {ToastComponent}
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900">Orders</h1>
                <p className="text-gray-600 mt-2">Manage customer orders</p>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                </div>
            ) : orders.length === 0 ? (
                <div className="bg-white rounded-xl shadow-md p-16 text-center">
                    <div className="text-6xl mb-4">📦</div>
                    <h2 className="text-2xl font-semibold text-gray-700 mb-4">No orders yet</h2>
                    <p className="text-gray-500">Orders will appear here once customers make purchases</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <div key={order._id} className="bg-white rounded-xl shadow-md p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Order #{order._id.slice(-8)}
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        {format(new Date(order.createdAt), 'MMM dd, yyyy h:mm a')}
                                    </p>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Customer: {order.user?.name || 'Unknown'} ({order.user?.email || 'N/A'})
                                    </p>
                                </div>
                                <div className="text-right">
                                    <div className="flex gap-2 mb-3">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                                order.paymentStatus
                                            )}`}
                                        >
                                            {order.paymentStatus.toUpperCase()}
                                        </span>
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                                order.orderStatus
                                            )}`}
                                        >
                                            {order.orderStatus.toUpperCase()}
                                        </span>
                                    </div>
                                    <p className="text-2xl font-bold text-indigo-600">
                                        ${order.totalAmount.toFixed(2)}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-2 mb-4">
                                {order.items.map((item: any, index: number) => (
                                    <div key={index} className="flex items-center gap-4 py-2 border-t">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-16 h-16 object-cover rounded-lg"
                                        />
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900">{item.name}</p>
                                            <p className="text-sm text-gray-600">
                                                ${item.price.toFixed(2)} × {item.quantity}
                                            </p>
                                        </div>
                                        <p className="font-semibold text-gray-900">
                                            ${(item.price * item.quantity).toFixed(2)}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t pt-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Update Order Status
                                </label>
                                <select
                                    value={order.orderStatus}
                                    onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="processing">Processing</option>
                                    <option value="shipped">Shipped</option>
                                    <option value="delivered">Delivered</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
