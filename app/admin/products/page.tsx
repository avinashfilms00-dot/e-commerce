'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import { useToast } from '@/components/Toast';

export default function AdminProductsPage() {
    const router = useRouter();
    const { showToast, ToastComponent } = useToast();
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
            showToast('Failed to load products', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this product?')) return;

        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`/api/products/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.ok) {
                showToast('Product deleted successfully', 'success');
                loadProducts();
            } else {
                showToast('Failed to delete product', 'error');
            }
        } catch (error) {
            showToast('An error occurred', 'error');
        }
    };

    return (
        <div className="p-8">
            {ToastComponent}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-4xl font-bold text-gray-900">Products</h1>
                    <p className="text-gray-600 mt-2">Manage your product catalog</p>
                </div>
                <button
                    onClick={() => router.push('/admin/products/new')}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all font-medium shadow-lg"
                >
                    + Add New Product
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                </div>
            ) : products.length === 0 ? (
                <div className="bg-white rounded-xl shadow-md p-16 text-center">
                    <div className="text-6xl mb-4">📦</div>
                    <h2 className="text-2xl font-semibold text-gray-700 mb-4">No products yet</h2>
                    <p className="text-gray-500 mb-8">Start by creating your first product</p>
                    <button
                        onClick={() => router.push('/admin/products/new')}
                        className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                    >
                        Create Product
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                        <div key={product._id} className="relative">
                            <ProductCard product={product} />
                            <div className="absolute top-3 left-3 flex gap-2 z-10">
                                <button
                                    onClick={() => router.push(`/admin/products/edit/${product._id}`)}
                                    className="bg-blue-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-600 transition-colors"
                                >
                                    ✏️ Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(product._id)}
                                    className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600 transition-colors"
                                >
                                    🗑️ Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
