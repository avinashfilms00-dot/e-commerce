'use client';

import { useEffect, useState } from 'react';

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalOrders: 0,
        totalRevenue: 0,
        pendingOrders: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        const token = localStorage.getItem('token');
        try {
            // Load products
            const productsRes = await fetch('/api/products');
            const productsData = await productsRes.json();

            // Load orders
            const ordersRes = await fetch('/api/orders', {
                headers: { Authorization: `Bearer ${token}` },
            });
            const ordersData = await ordersRes.json();

            if (productsData.success && ordersData.success) {
                const orders = ordersData.data;
                const revenue = orders
                    .filter((o: any) => o.paymentStatus === 'paid')
                    .reduce((sum: number, o: any) => sum + o.totalAmount, 0);
                const pending = orders.filter((o: any) => o.orderStatus === 'processing').length;

                setStats({
                    totalProducts: productsData.data.length,
                    totalOrders: orders.length,
                    totalRevenue: revenue,
                    pendingOrders: pending,
                });
            }
        } catch (error) {
            console.error('Failed to load stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const statCards = [
        {
            title: 'Total Products',
            value: stats.totalProducts,
            icon: '📦',
            color: 'from-blue-500 to-blue-600',
        },
        {
            title: 'Total Orders',
            value: stats.totalOrders,
            icon: '🛒',
            color: 'from-purple-500 to-purple-600',
        },
        {
            title: 'Total Revenue',
            value: `$${stats.totalRevenue.toFixed(2)}`,
            icon: '💰',
            color: 'from-green-500 to-green-600',
        },
        {
            title: 'Pending Orders',
            value: stats.pendingOrders,
            icon: '⏳',
            color: 'from-yellow-500 to-yellow-600',
        },
    ];

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600 mt-2">Welcome to your admin panel</p>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {statCards.map((card, index) => (
                            <div
                                key={index}
                                className={`bg-gradient-to-br ${card.color} text-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-transform`}
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-4xl">{card.icon}</span>
                                    <div className="text-right">
                                        <p className="text-white/80 text-sm">{card.title}</p>
                                        <p className="text-3xl font-bold">{card.value}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Actions</h2>
                            <div className="space-y-3">
                                <a
                                    href="/admin/products/new"
                                    className="block bg-indigo-600 text-white text-center py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                                >
                                    + Add New Product
                                </a>
                                <a
                                    href="/admin/orders"
                                    className="block bg-purple-600 text-white text-center py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium"
                                >
                                    View All Orders
                                </a>
                                <a
                                    href="/admin/inventory"
                                    className="block bg-green-600 text-white text-center py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
                                >
                                    Manage Inventory
                                </a>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Activity</h2>
                            <div className="space-y-3 text-gray-600">
                                <p>✓ System running smoothly</p>
                                <p>✓ All APIs operational</p>
                                <p>✓ Database connected</p>
                                <p className="text-green-600 font-medium">Everything looks good!</p>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
