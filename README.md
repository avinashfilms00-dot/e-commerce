# ShopHub E-commerce Platform

A full-stack e-commerce application built by **Manish Yadav** with Next.js, MongoDB, Stripe, and Tailwind CSS.

## Features

### User Features
- 🛍️ Browse products with search and filter
- 🛒 Shopping cart with real-time updates
- 💳 Secure checkout with Stripe (test mode)
- 📦 Order tracking and history
- 👤 User authentication with JWT

### Admin Features
- 📊 Dashboard with statistics
- ➕ Product management (CRUD operations)
- 📋 Order management and status updates
- 📈 Inventory tracking
- 🔐 Role-based access control

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, MongoDB, Mongoose
- **Authentication**: JWT, bcryptjs
- **Payments**: Stripe (Test Mode)
- **Icons**: React Icons
- **Utilities**: date-fns

## Prerequisites

- Node.js 18+ installed
- MongoDB database (local or MongoDB Atlas)
- Stripe account (for test API keys)

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# MongoDB Configuration
MONGODB_URI=your_mongodb_connection_string_here

# JWT Secret (use a long random string)
JWT_SECRET=your_secure_random_string_here

# Stripe Keys (Test Mode)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Next.js Configuration
NEXT_PUBLIC_URL=http://localhost:3000
```

#### Getting MongoDB URI:
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get your connection string
4. Replace `<password>` with your database password

#### Getting Stripe Keys:
1. Sign up at [Stripe](https://stripe.com)
2. Go to Dashboard → Developers → API keys
3. Copy your **Test** publishable and secret keys

### 3. Seed Database with Sample Data

Run the setup script to create an admin user and sample products:

```bash
node scripts/seed.js
```

This will create:
- Admin account: `admin@ecommerce.com` / `admin123`
- Sample products in various categories

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage Guide

### For Users

1. **Register**: Create a new account at `/register`
2. **Browse**: View products on the homepage with search/filter
3. **Shop**: Add items to cart and manage quantities
4. **Checkout**: Use Stripe test card: `4242 4242 4242 4242`
5. **Track Orders**: View order history at `/orders`

### For Admin

1. **Login**: Use admin credentials at `/login` (select "Admin" role)
2. **Dashboard**: View statistics at `/admin`
3. **Manage Products**: Add/edit/delete products at `/admin/products`
4. **Manage Orders**: Update order status at `/admin/orders`
5. **Track Inventory**: Monitor stock levels at `/admin/inventory`

## Stripe Test Cards

For testing payments, use these test card numbers:

- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **Requires Authentication**: `4000 0025 0000 3155`

Use any future expiry date, any 3-digit CVC, and any postal code.

## Project Structure

```
e-commerce/
├── app/
│   ├── api/              # API routes
│   ├── admin/            # Admin dashboard pages
│   ├── cart/             # Shopping cart
│   ├── checkout/         # Checkout flow
│   ├── login/            # Authentication pages
│   ├── orders/           # Order history
│   └── page.tsx          # Homepage
├── components/           # Reusable components
├── lib/                  # Utilities (auth, db)
├── models/               # MongoDB models
├── public/               # Static assets
└── scripts/              # Setup scripts
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - List products (with search/filter)
- `POST /api/products` - Create product (admin)
- `GET /api/products/[id]` - Get single product
- `PUT /api/products/[id]` - Update product (admin)
- `DELETE /api/products/[id]` - Delete product (admin)

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart` - Add/update cart item
- `DELETE /api/cart` - Clear cart

### Orders
- `GET /api/orders` - List orders
- `POST /api/orders` - Create order
- `GET /api/orders/[id]` - Get single order
- `PUT /api/orders/[id]` - Update order status (admin)

### Stripe
- `POST /api/stripe/create-checkout` - Create checkout session
- `POST /api/stripe/webhook` - Handle payment webhooks

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Environment Variables for Production

Remember to update `NEXT_PUBLIC_URL` to your production domain.

## Troubleshooting

**MongoDB Connection Issues**:
- Ensure your IP is whitelisted in MongoDB Atlas
- Check connection string format
- Verify database user permissions

**Stripe Payments Not Working**:
- Confirm you're using test mode keys
- Check webhook secret is configured
- Verify `NEXT_PUBLIC_URL` is correct

**Images Not Loading**:
- Ensure image URLs are publicly accessible
- Check Next.js image domains configuration

## License

Created by **Manish Yadav** for educational purposes.

## Support

For issues or questions, please check the code comments or create an issue.

---

Made with ❤️ by Manish Yadav
