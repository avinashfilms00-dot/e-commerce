'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

interface ProductCardProps {
    product: {
        _id: string;
        name: string;
        price: number;
        image: string;
        stock: number;
        category: string;
    };
    onAddToCart?: (productId: string) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
    const [isAdding, setIsAdding] = useState(false);

    const handleAddToCart = async () => {
        if (onAddToCart && !isAdding) {
            setIsAdding(true);
            await onAddToCart(product._id);
            setTimeout(() => setIsAdding(false), 1000);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group">
            <Link href={`/products/${product._id}`}>
                <div className="relative h-64 overflow-hidden bg-gray-100">
                    {product.image ? (
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                            No Image
                        </div>
                    )}
                    {product.stock === 0 && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <span className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold">
                                OUT OF STOCK
                            </span>
                        </div>
                    )}
                    <div className="absolute top-3 right-3 bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                        {product.category}
                    </div>
                </div>
            </Link>

            <div className="p-5">
                <Link href={`/products/${product._id}`}>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 hover:text-indigo-600 transition-colors line-clamp-2">
                        {product.name}
                    </h3>
                </Link>

                <div className="flex items-center justify-between mt-4">
                    <div>
                        <p className="text-2xl font-bold text-indigo-600">${product.price.toFixed(2)}</p>
                        <p className="text-sm text-gray-500">Stock: {product.stock}</p>
                    </div>

                    {onAddToCart && (
                        <button
                            onClick={handleAddToCart}
                            disabled={product.stock === 0 || isAdding}
                            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${product.stock === 0
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : isAdding
                                        ? 'bg-green-500 text-white'
                                        : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-md'
                                }`}
                        >
                            {isAdding ? '✓ Added' : '🛒 Add'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
