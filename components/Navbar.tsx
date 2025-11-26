'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { FiShoppingCart, FiUser, FiLogOut, FiMenu, FiX } from 'react-icons/fi';

export default function Navbar() {
    const router = useRouter();
    const pathname = usePathname();
    const [user, setUser] = useState<any>(null);
    const [cartCount, setCartCount] = useState(0);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        checkAuth();
        loadCartCount();
    }, [pathname]);

    const checkAuth = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const res = await fetch('/api/auth/me', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (res.ok) {
                    const data = await res.json();
                    setUser(data.data.user);
                } else {
                    localStorage.removeItem('token');
                }
            } catch (error) {
                console.error('Auth check failed:', error);
            }
        }
    };

    const loadCartCount = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const res = await fetch('/api/cart', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (res.ok) {
                    const data = await res.json();
                    setCartCount(data.data.items?.length || 0);
                }
            } catch (error) {
                console.error('Load cart failed:', error);
            }
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setUser(null);
        router.push('/');
    };

    return (
        <nav className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="text-2xl font-bold hover:opacity-90 transition-opacity">
                        🛍️ ShopHub
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-6">
                        <Link href="/" className="hover:opacity-80 transition-opacity">
                            Home
                        </Link>

                        {user ? (
                            <>
                                {user.role === 'admin' && (
                                    <Link
                                        href="/admin"
                                        className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded-lg transition-colors font-medium"
                                    >
                                        Admin Panel
                                    </Link>
                                )}
                                <Link href="/orders" className="hover:opacity-80 transition-opacity">
                                    My Orders
                                </Link>
                                <Link href="/cart" className="relative hover:opacity-80 transition-opacity">
                                    <FiShoppingCart className="w-6 h-6" />
                                    {cartCount > 0 && (
                                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                                            {cartCount}
                                        </span>
                                    )}
                                </Link>
                                <div className="flex items-center space-x-3">
                                    <FiUser className="w-5 h-5" />
                                    <span className="text-sm">{user.name}</span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
                                >
                                    <FiLogOut />
                                    <span>Logout</span>
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="bg-white text-indigo-600 hover:bg-gray-100 px-4 py-2 rounded-lg transition-colors font-medium"
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/register"
                                    className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2"
                    >
                        {mobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {mobileMenuOpen && (
                    <div className="md:hidden pb-4 space-y-3">
                        <Link
                            href="/"
                            className="block hover:opacity-80 transition-opacity"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Home
                        </Link>
                        {user ? (
                            <>
                                {user.role === 'admin' && (
                                    <Link
                                        href="/admin"
                                        className="block bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded-lg transition-colors font-medium"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Admin Panel
                                    </Link>
                                )}
                                <Link
                                    href="/orders"
                                    className="block hover:opacity-80 transition-opacity"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    My Orders
                                </Link>
                                <Link
                                    href="/cart"
                                    className="block hover:opacity-80 transition-opacity"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Cart ({cartCount})
                                </Link>
                                <div className="pt-2 border-t border-white/20">
                                    <p className="text-sm mb-2">Logged in as: {user.name}</p>
                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            setMobileMenuOpen(false);
                                        }}
                                        className="w-full bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="block bg-white text-indigo-600 hover:bg-gray-100 px-4 py-2 rounded-lg transition-colors font-medium text-center"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/register"
                                    className="block bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors text-center"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
}
