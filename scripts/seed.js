const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

// Simple schema definitions (avoiding TypeScript for the script)
const UserSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
}, { timestamps: true });

const ProductSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    category: String,
    stock: Number,
    image: String,
    images: [String],
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', UserSchema);
const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

const sampleProducts = [
    {
        name: 'Wireless Bluetooth Headphones',
        description: 'Premium noise-cancelling headphones with 30-hour battery life. Crystal clear audio and comfortable design for all-day wear.',
        price: 89.99,
        category: 'Electronics',
        stock: 50,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
    },
    {
        name: 'Smart Fitness Watch',
        description: 'Track your health and fitness goals with this advanced smartwatch. Features heart rate monitoring, GPS, and sleep tracking.',
        price: 199.99,
        category: 'Electronics',
        stock: 30,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
    },
    {
        name: 'Laptop Backpack',
        description: 'Water-resistant backpack with multiple compartments. Perfect for work, travel, or school with dedicated laptop sleeve.',
        price: 49.99,
        category: 'Accessories',
        stock: 100,
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500',
    },
    {
        name: 'Portable Phone Charger',
        description: '20000mAh power bank with fast charging capability. Charges multiple devices simultaneously.',
        price: 34.99,
        category: 'Electronics',
        stock: 75,
        image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500',
    },
    {
        name: 'Stainless Steel Water Bottle',
        description: 'Keep drinks cold for 24 hours or hot for 12 hours. Eco-friendly and durable design.',
        price: 24.99,
        category: 'Accessories',
        stock: 120,
        image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500',
    },
    {
        name: 'Desk Lamp with USB Port',
        description: 'LED desk lamp with adjustable brightness and color temperature. Built-in USB charging port.',
        price: 39.99,
        category: 'Home',
        stock: 60,
        image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500',
    },
    {
        name: 'Wireless Mouse',
        description: 'Ergonomic wireless mouse with precision tracking. Long battery life and comfortable grip.',
        price: 29.99,
        category: 'Electronics',
        stock: 85,
        image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=500',
    },
    {
        name: 'Coffee Maker',
        description: 'Programmable coffee maker with thermal carafe. Brew perfect coffee every morning.',
        price: 79.99,
        category: 'Home',
        stock: 40,
        image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500',
    },
    {
        name: 'Yoga Mat',
        description: 'Non-slip exercise mat with extra cushioning. Perfect for yoga, pilates, and floor exercises.',
        price: 34.99,
        category: 'Sports',
        stock: 90,
        image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500',
    },
    {
        name: 'Bluetooth Speaker',
        description: 'Portable waterproof speaker with 360° sound. Perfect for outdoor adventures.',
        price: 59.99,
        category: 'Electronics',
        stock: 55,
        image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500',
    },
    {
        name: 'Running Shoes',
        description: 'Lightweight and breathable running shoes with superior cushioning and support.',
        price: 119.99,
        category: 'Sports',
        stock: 45,
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
    },
    {
        name: 'Sunglasses',
        description: 'UV protection sunglasses with polarized lenses. Stylish and protective.',
        price: 79.99,
        category: 'Accessories',
        stock: 70,
        image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500',
    },
];

async function seed() {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI || '');
        console.log('✅ Connected to MongoDB');

        // Clear existing data
        console.log('\n🗑️  Clearing existing data...');
        await User.deleteMany({});
        await Product.deleteMany({});
        console.log('✅ Cleared existing data');

        // Create admin user
        console.log('\n👤 Creating admin user...');
        const hashedPassword = await bcrypt.hash('admin123', 10);
        const admin = await User.create({
            name: 'Admin User',
            email: 'admin@ecommerce.com',
            password: hashedPassword,
            role: 'admin',
        });
        console.log(`✅ Admin created: ${admin.email} / admin123`);

        // Create sample user
        console.log('\n👤 Creating sample user...');
        const userPassword = await bcrypt.hash('user123', 10);
        const user = await User.create({
            name: 'Manish Yadav',
            email: 'user@example.com',
            password: userPassword,
            role: 'user',
        });
        console.log(`✅ User created: ${user.email} / user123`);

        // Create products
        console.log('\n📦 Creating sample products...');
        const products = await Product.insertMany(sampleProducts);
        console.log(`✅ Created ${products.length} products`);

        console.log('\n\n🎉 Database seeding completed successfully!');
        console.log('\n📋 Summary:');
        console.log(`   - Admin: admin@ecommerce.com / admin123`);
        console.log(`   - User: user@example.com / user123`);
        console.log(`   - Products: ${products.length}`);
        console.log('\n🚀 You can now run: npm run dev');

    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    } finally {
        await mongoose.connection.close();
        console.log('\n🔌 MongoDB connection closed');
    }
}

seed();
