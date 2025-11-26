import mongoose, { Schema, model, models } from 'mongoose';

export interface ICartItem {
    product: string;
    quantity: number;
}

export interface ICart {
    _id: string;
    user: string;
    items: ICartItem[];
    createdAt: Date;
    updatedAt: Date;
}

const CartSchema = new Schema<ICart>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true,
        },
        items: [
            {
                product: {
                    type: Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: 1,
                    default: 1,
                },
            },
        ],
    },
    {
        timestamps: true,
    }
);

export default models.Cart || model<ICart>('Cart', CartSchema);
