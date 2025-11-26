import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import dbConnect from '@/lib/mongodb';
import Cart from '@/models/Cart';
import { verifyToken, getTokenFromHeaders } from '@/lib/auth';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2024-11-20.acacia',
});

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

        // Get user's cart
        const cart = await Cart.findOne({ user: payload.userId }).populate('items.product');
        if (!cart || cart.items.length === 0) {
            return NextResponse.json(
                { success: false, error: 'Cart is empty' },
                { status: 400 }
            );
        }

        // Create line items for Stripe
        const lineItems = cart.items.map((item: any) => ({
            price_data: {
                currency: 'usd',
                product_data: {
                    name: item.product.name,
                    description: item.product.description,
                    images: item.product.image ? [item.product.image] : [],
                },
                unit_amount: Math.round(item.product.price * 100), // Convert to cents
            },
            quantity: item.quantity,
        }));

        // Create Stripe checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `${process.env.NEXT_PUBLIC_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_URL}/cart`,
            metadata: {
                userId: payload.userId,
                cartId: cart._id.toString(),
            },
        });

        return NextResponse.json({
            success: true,
            data: {
                sessionId: session.id,
                url: session.url,
            },
        });
    } catch (error: any) {
        console.error('Create checkout error:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Server error' },
            { status: 500 }
        );
    }
}
