import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import Cart from '@/models/Cart';
import Product from '@/models/Product';
import { verifyToken, getTokenFromHeaders } from '@/lib/auth';

// GET orders (user gets their orders, admin gets all)
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

        let orders;
        if (payload.role === 'admin') {
            // Admin sees all orders
            orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
        } else {
            // User sees only their orders
            orders = await Order.find({ user: payload.userId }).sort({ createdAt: -1 });
        }

        return NextResponse.json({
            success: true,
            data: orders,
        });
    } catch (error: any) {
        console.error('Get orders error:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Server error' },
            { status: 500 }
        );
    }
}

// POST create order
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
        const { items, shippingAddress } = body;

        // Validate items
        if (!items || items.length === 0) {
            return NextResponse.json(
                { success: false, error: 'No items in order' },
                { status: 400 }
            );
        }

        // Calculate total and validate stock
        let totalAmount = 0;
        const orderItems = [];

        for (const item of items) {
            const product = await Product.findById(item.product);
            if (!product) {
                return NextResponse.json(
                    { success: false, error: `Product not found: ${item.product}` },
                    { status: 404 }
                );
            }

            if (product.stock < item.quantity) {
                return NextResponse.json(
                    { success: false, error: `Insufficient stock for ${product.name}` },
                    { status: 400 }
                );
            }

            totalAmount += product.price * item.quantity;
            orderItems.push({
                product: product._id,
                name: product.name,
                price: product.price,
                quantity: item.quantity,
                image: product.image,
            });

            // Update stock
            product.stock -= item.quantity;
            await product.save();
        }

        // Create order
        const order = await Order.create({
            user: payload.userId,
            items: orderItems,
            totalAmount,
            shippingAddress,
            paymentStatus: 'pending',
            orderStatus: 'processing',
        });

        // Clear user's cart
        await Cart.findOneAndUpdate(
            { user: payload.userId },
            { items: [] }
        );

        return NextResponse.json(
            {
                success: true,
                data: order,
            },
            { status: 201 }
        );
    } catch (error: any) {
        console.error('Create order error:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Server error' },
            { status: 500 }
        );
    }
}
