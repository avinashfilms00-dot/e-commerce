import mongoose, { Schema, model, models } from 'mongoose';

export interface IOrderItem {
    product: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
}

export interface IOrder {
    _id: string;
    user: string;
    items: IOrderItem[];
    totalAmount: number;
    paymentStatus: 'pending' | 'paid' | 'failed';
    orderStatus: 'processing' | 'shipped' | 'delivered' | 'cancelled';
    stripePaymentId?: string;
    shippingAddress?: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
    };
    createdAt: Date;
    updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        items: [
            {
                product: {
                    type: Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true,
                },
                name: String,
                price: Number,
                quantity: Number,
                image: String,
            },
        ],
        totalAmount: {
            type: Number,
            required: true,
            min: 0,
        },
        paymentStatus: {
            type: String,
            enum: ['pending', 'paid', 'failed'],
            default: 'pending',
        },
        orderStatus: {
            type: String,
            enum: ['processing', 'shipped', 'delivered', 'cancelled'],
            default: 'processing',
        },
        stripePaymentId: String,
        shippingAddress: {
            street: String,
            city: String,
            state: String,
            zipCode: String,
            country: String,
        },
    },
    {
        timestamps: true,
    }
);

export default models.Order || model<IOrder>('Order', OrderSchema);
