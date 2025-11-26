import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import Cart from '@/models/Cart';
import Product from '@/models/Product';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2024-11-20.acacia',
});

export async function POST(request: NextRequest) {
    try {
        await dbConnect();

        const body = await request.text();
        const sig = request.headers.get('stripe-signature');

        if (!sig) {
            return NextResponse.json(
                { success: false, error: 'No signature' },
                { status: 400 }
            );
        }

        let event;

        try {
            event = stripe.webhooks.constructEvent(
                body,
                sig,
                process.env.STRIPE_WEBHOOK_SECRET || ''
            );
        } catch (err: any) {
            console.error('Webhook signature verification failed:', err.message);
            return NextResponse.json(
                { success: false, error: `Webhook Error: ${err.message}` },
                { status: 400 }
            );
        }

        // Handle the checkout.session.completed event
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object as Stripe.Checkout.Session;

            const userId = session.metadata?.userId;
            const cartId = session.metadata?.cartId;

            if (userId) {
                // Get cart items
                const cart = await Cart.findById(cartId).populate('items.product');

                if (cart && cart.items.length > 0) {
                    // Calculate total and prepare order items
                    let totalAmount = 0;
                    const orderItems = [];

                    for (const item of cart.items as any[]) {
                        const product = item.product;
                        totalAmount += product.price * item.quantity;
                        orderItems.push({
                            product: product._id,
                            name: product.name,
                            price: product.price,
                            quantity: item.quantity,
                            image: product.image,
                        });

                        // Update stock
                        await Product.findByIdAndUpdate(product._id, {
                            $inc: { stock: -item.quantity },
                        });
                    }

                    // Create order
                    await Order.create({
                        user: userId,
                        items: orderItems,
                        totalAmount,
                        paymentStatus: 'paid',
                        orderStatus: 'processing',
                        stripePaymentId: session.payment_intent as string,
                    });

                    // Clear cart
                    await Cart.findOneAndUpdate({ user: userId }, { items: [] });
                }
            }
        }

        return NextResponse.json({ success: true, received: true });
    } catch (error: any) {
        console.error('Webhook error:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Server error' },
            { status: 500 }
        );
    }
}
