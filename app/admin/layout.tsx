'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { FiHome, FiPackage, FiShoppingBag, FiBarChart2, FiLogOut } from 'react-icons/fi';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }

        try {
            const res = await fetch('/api/auth/me', {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();

            if (data.success && data.data.user.role === 'admin') {
                setUser(data.data.user);
            } else {
                router.push('/');
            }
        } catch (error) {
            router.push('/login');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        router.push('/');
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    const navItems = [
        { href: '/admin', icon: FiHome, label: 'Dashboard' },
        { href: '/admin/products', icon: FiPackage, label: 'Products' },
        { href: '/admin/orders', icon: FiShoppingBag, label: 'Orders' },
        { href: '/admin/inventory', icon: FiBarChart2, label: 'Inventory' },
    ];

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="w-64 bg-gradient-to-b from-indigo-900 to-purple-900 text-white">
                <div className="p-6">
                    <h2 className="text-2xl font-bold mb-2">⭐ Admin Panel</h2>
                    <p className="text-sm text-indigo-200">{user?.name}</p>
                </div>

                <nav className="mt-6">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-6 py-4 transition-colors ${isActive
                                    ? 'bg-white/20 border-r-4 border-white'
                                    : 'hover:bg-white/10'
                                    }`}
                            >
                                <Icon className="w-5 h-5" />
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        );
                    })}

                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-6 py-4 w-full hover:bg-white/10 transition-colors mt-8 border-t border-white/20"
                    >
                        <FiLogOut className="w-5 h-5" />
                        <span className="font-medium">Logout</span>
                    </button>
                </nav>

                <div className="p-6 mt-8">
                    <Link
                        href="/"
                        className="block w-full bg-white/20 hover:bg-white/30 text-center py-2 rounded-lg transition-colors"
                    >
                        ← Back to Store
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                {children}
            </main>
        </div>
    );
}
