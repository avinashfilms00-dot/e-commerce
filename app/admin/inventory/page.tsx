'use client';

import { useEffect, useState } from 'react';

export default function AdminInventoryPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            const res = await fetch('/api/products');
            const data = await res.json();
            if (data.success) {
                setProducts(data.data);
            }
        } catch (error) {
            console.error('Failed to load products:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateStock = async (id: string, newStock: number) => {
        const token = localStorage.getItem('token');
        try {
            await fetch(`/api/products/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ stock: newStock }),
            });
            loadProducts();
        } catch (error) {
            console.error('Failed to update stock:', error);
        }
    };

    const getStockStatus = (stock: number) => {
        if (stock === 0) return { label: 'Out of Stock', color: 'text-red-600 bg-red-50' };
        if (stock < 10) return { label: 'Low Stock', color: 'text-yellow-600 bg-yellow-50' };
        return { label: 'In Stock', color: 'text-green-600 bg-green-50' };
    };

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900">Inventory Management</h1>
                <p className="text-gray-600 mt-2">Track and manage product stock levels</p>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold">Image</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold">Product</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold">Category</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold">Price</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold">Stock</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {products.map((product) => {
                                const status = getStockStatus(product.stock);
                                return (
                                    <tr key={product._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="w-16 h-16 object-cover rounded-lg"
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{product.name}</div>
                                            <div className="text-sm text-gray-500 line-clamp-1">
                                                {product.description}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">{product.category}</td>
                                        <td className="px-6 py-4 font-semibold text-indigo-600">
                                            ${product.price.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-2xl font-bold text-gray-900">{product.stock}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${status.color}`}>
                                                {status.label}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => updateStock(product._id, product.stock + 10)}
                                                    className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                                                >
                                                    + 10
                                                </button>
                                                <button
                                                    onClick={() => updateStock(product._id, Math.max(0, product.stock - 10))}
                                                    className="bg-orange-500 text-white px-3 py-1 rounded text-sm hover:bg-orange-600"
                                                >
                                                    − 10
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
