import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Cart from '@/models/Cart';
import Product from '@/models/Product';
import { verifyToken, getTokenFromHeaders } from '@/lib/auth';

// GET user's cart
export async function GET(request: NextRequest) {
    try {
        await dbConnect();

        // Verify token
        const token = getTokenFromHeaders(request.headers);
        if (!token) {
            return NextResponse.json(
                { success: false, error: 'Not authenticated' },
                { status: 401 }
            );
        }

        const payload = verifyToken(token);
        if (!payload) {
            return NextResponse.json(
                { success: false, error: 'Invalid token' },
                { status: 401 }
            );
        }

        let cart = await Cart.findOne({ user: payload.userId }).populate('items.product');

        if (!cart) {
            cart = await Cart.create({ user: payload.userId, items: [] });
        }

        return NextResponse.json({
            success: true,
            data: cart,
        });
    } catch (error: any) {
        console.error('Get cart error:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Server error' },
            { status: 500 }
        );
    }
}

// POST add item to cart or update cart
export async function POST(request: NextRequest) {
    try {
        await dbConnect();

        // Verify token
        const token = getTokenFromHeaders(request.headers);
        if (!token) {
            return NextResponse.json(
                { success: false, error: 'Not authenticated' },
                { status: 401 }
            );
        }

        const payload = verifyToken(token);
        if (!payload) {
            return NextResponse.json(
                { success: false, error: 'Invalid token' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { productId, quantity, action } = body;

        // Validate product exists
        const product = await Product.findById(productId);
        if (!product) {
            return NextResponse.json(
                { success: false, error: 'Product not found' },
                { status: 404 }
            );
        }

        // Get or create cart
        let cart = await Cart.findOne({ user: payload.userId });
        if (!cart) {
            cart = await Cart.create({ user: payload.userId, items: [] });
        }

        // Handle different actions
        if (action === 'remove') {
            // Remove item from cart
            cart.items = cart.items.filter(item => item.product.toString() !== productId);
        } else {
            // Check if product already in cart
            const existingItemIndex = cart.items.findIndex(
                item => item.product.toString() === productId
            );

            if (existingItemIndex > -1) {
                if (action === 'set') {
                    cart.items[existingItemIndex].quantity = quantity;
                } else {
                    cart.items[existingItemIndex].quantity += quantity || 1;
                }

                // Remove if quantity is 0 or less
                if (cart.items[existingItemIndex].quantity <= 0) {
                    cart.items.splice(existingItemIndex, 1);
                }
            } else {
                // Add new item
                cart.items.push({
                    product: productId,
                    quantity: quantity || 1,
                });
            }
        }

        await cart.save();
        cart = await Cart.findById(cart._id).populate('items.product');

        return NextResponse.json({
            success: true,
            data: cart,
        });
    } catch (error: any) {
        console.error('Update cart error:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Server error' },
            { status: 500 }
        );
    }
}

// DELETE clear cart
export async function DELETE(request: NextRequest) {
    try {
        await dbConnect();

        // Verify token
        const token = getTokenFromHeaders(request.headers);
        if (!token) {
            return NextResponse.json(
                { success: false, error: 'Not authenticated' },
                { status: 401 }
            );
        }

        const payload = verifyToken(token);
        if (!payload) {
            return NextResponse.json(
                { success: false, error: 'Invalid token' },
                { status: 401 }
            );
        }

        await Cart.findOneAndUpdate(
            { user: payload.userId },
            { items: [] },
            { new: true }
        );

        return NextResponse.json({
            success: true,
            message: 'Cart cleared successfully',
        });
    } catch (error: any) {
        console.error('Clear cart error:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Server error' },
            { status: 500 }
        );
    }
}
