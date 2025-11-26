'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useToast } from '@/components/Toast';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

export default function CheckoutPage() {
    const router = useRouter();
    const { showToast, ToastComponent } = useToast();
    const [cart, setCart] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }
        loadCart();
    }, []);

    const loadCart = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch('/api/cart', {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (data.success) {
                setCart(data.data);
                if (data.data.items.length === 0) {
                    router.push('/cart');
                }
            }
        } catch (error) {
            showToast('Failed to load cart', 'error');
        } finally {
            setLoading(false);
        }
    };

    const calculateTotal = () => {
        if (!cart || !cart.items) return 0;
        return cart.items.reduce((total: number, item: any) => {
            return total + (item.product?.price || 0) * item.quantity;
        }, 0);
    };

    const handleCheckout = async () => {
        setProcessing(true);
        const token = localStorage.getItem('token');

        try {
            const res = await fetch('/api/stripe/create-checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();

            if (data.success && data.data.url) {
                // Redirect to Stripe checkout
                window.location.href = data.data.url;
            } else {
                showToast(data.error || 'Checkout failed', 'error');
                setProcessing(false);
            }
        } catch (error) {
            showToast('An error occurred during checkout', 'error');
            setProcessing(false);
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            {ToastComponent}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-8">Checkout</h1>

                <div className="bg-white rounded-xl shadow-lg p-8">
                    <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

                    {/* Cart Items */}
                    <div className="space-y-4 mb-8">
                        {cart?.items.map((item: any) => (
                            <div key={item.product._id} className="flex items-center gap-4 pb-4 border-b">
                                <img
                                    src={item.product.image}
                                    alt={item.product.name}
                                    className="w-20 h-20 object-cover rounded-lg"
                                />
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900">{item.product.name}</h3>
                                    <p className="text-gray-600">Quantity: {item.quantity}</p>
                                </div>
                                <p className="font-bold text-indigo-600">
                                    ${(item.product.price * item.quantity).toFixed(2)}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Total */}
                    <div className="border-t pt-6 mb-8">
                        <div className="flex justify-between text-lg mb-2">
                            <span className="text-gray-600">Subtotal</span>
                            <span>${calculateTotal().toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-lg mb-2">
                            <span className="text-gray-600">Shipping</span>
                            <span className="text-green-600">FREE</span>
                        </div>
                        <div className="flex justify-between text-2xl font-bold mt-4">
                            <span>Total</span>
                            <span className="text-indigo-600">${calculateTotal().toFixed(2)}</span>
                        </div>
                    </div>

                    {/* Payment Info */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                        <h3 className="font-semibold text-blue-900 mb-2">💳 Test Payment Information</h3>
                        <p className="text-sm text-blue-800 mb-2">Use the following test card:</p>
                        <ul className="text-sm text-blue-700 space-y-1">
                            <li>• Card Number: 4242 4242 4242 4242</li>
                            <li>• Expiry: Any future date</li>
                            <li>• CVC: Any 3 digits</li>
                            <li>• ZIP: Any 5 digits</li>
                        </ul>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-4">
                        <button
                            onClick={() => router.push('/cart')}
                            className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                        >
                            Back to Cart
                        </button>
                        <button
                            onClick={handleCheckout}
                            disabled={processing}
                            className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium shadow-lg hover:shadow-xl"
                        >
                            {processing ? 'Processing...' : 'Pay with Stripe'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
