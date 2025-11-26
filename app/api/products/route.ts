import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import { verifyToken, getTokenFromHeaders } from '@/lib/auth';

// GET all products (with search and filter)
export async function GET(request: NextRequest) {
    try {
        await dbConnect();

        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search') || '';
        const category = searchParams.get('category') || '';
        const minPrice = searchParams.get('minPrice');
        const maxPrice = searchParams.get('maxPrice');

        let query: any = {};

        // Search by name or description
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
            ];
        }

        // Filter by category
        if (category) {
            query.category = category;
        }

        // Filter by price range
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = parseFloat(minPrice);
            if (maxPrice) query.price.$lte = parseFloat(maxPrice);
        }

        const products = await Product.find(query).sort({ createdAt: -1 });

        return NextResponse.json({
            success: true,
            data: products,
        });
    } catch (error: any) {
        console.error('Get products error:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Server error' },
            { status: 500 }
        );
    }
}

// POST create new product (Admin only)
export async function POST(request: NextRequest) {
    try {
        await dbConnect();

        // Verify admin token
        const token = getTokenFromHeaders(request.headers);
        if (!token) {
            return NextResponse.json(
                { success: false, error: 'Not authenticated' },
                { status: 401 }
            );
        }

        const payload = verifyToken(token);
        if (!payload || payload.role !== 'admin') {
            return NextResponse.json(
                { success: false, error: 'Access denied. Admin only.' },
                { status: 403 }
            );
        }

        const body = await request.json();
        const { name, description, price, category, stock, image, images } = body;

        // Validation
        if (!name || !description || !price || !category || stock === undefined || !image) {
            return NextResponse.json(
                { success: false, error: 'Please provide all required fields' },
                { status: 400 }
            );
        }

        // Create product
        const product = await Product.create({
            name,
            description,
            price,
            category,
            stock,
            image,
            images: images || [],
        });

        return NextResponse.json(
            {
                success: true,
                data: product,
            },
            { status: 201 }
        );
    } catch (error: any) {
        console.error('Create product error:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Server error' },
            { status: 500 }
        );
    }
}
