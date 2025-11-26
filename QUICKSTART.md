# 🚀 Quick Start Guide for ShopHub E-commerce

Welcome Manish! Follow these steps to get your e-commerce platform up and running.

## Step 1: Environment Setup

1. **Create `.env.local` file** in the project root (copy from ENV_TEMPLATE.md):

```env
MONGODB_URI=your_mongodb_uri_here
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
STRIPE_SECRET_KEY=sk_test_your_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
NEXT_PUBLIC_URL=http://localhost:3000
```

### Get MongoDB URI:
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up (free tier available)
3. Create a new cluster
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. Replace `<password>` with your database password

### Get Stripe Keys:
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)
2. Sign up if needed
3. Make sure you're in **Test Mode** (toggle in top right)
4. Copy:
   - Publishable key starts with `pk_test_`
   - Secret key starts with `sk_test_`

## Step 2: Install & Seed Database

```bash
# Install all dependencies
npm install

# Seed database with admin user and sample products
node scripts/seed.js
```

**This creates:**
- Admin: `admin@ecommerce.com` / `admin123`
- User: `user@example.com` / `user123`
- 12 sample products

## Step 3: Run the Application

```bash
npm run dev
```

## Step 4: Test It Out!

### Test as User:
1. Open http://localhost:3000
2. Click "Register" to create account OR login with test user
3. Browse products, use search/filter
4. Add items to cart
5. Go to checkout
6. Use test card: **4242 4242 4242 4242**
7. View your orders

### Test as Admin:
1. Login with: `admin@ecommerce.com` / `admin123`
2. Select "Admin" role
3. Access admin panel at http://localhost:3000/admin
4. Add/edit/delete products
5. Manage orders and inventory

## Stripe Test Cards

- **Success**: 4242 4242 4242 4242
- **Decline**: 4000 0000 0000 0002
- Any future expiry, any 3-digit CVC, any ZIP code

## Troubleshooting

### "MongoDB connection failed"
- Check your MongoDB URI is correct
- Ensure your IP is whitelisted in MongoDB Atlas
- Verify database user has read/write permissions

### "Cannot find module"
- Run `npm install` again
- Delete `node_modules` and `.next` folders, then reinstall

### "Stripe error"
- Verify you're using TEST mode keys
- Check keys are saved in `.env.local`
- Restart dev server after adding env variables

## Features to Test

✅ User registration and login
✅ Admin login with role-based access
✅ Product browsing with search/filter
✅ Shopping cart operations
✅ Stripe checkout (test mode)
✅ Order management
✅ Admin product CRUD
✅ Inventory tracking

## What's Next?

- Add more products via admin panel
- Test the complete checkout flow
- Explore admin dashboard statistics
- Customize the design to your liking

---

**Built by Manish Yadav** 🎉

Need help? Check [README.md](README.md) for detailed documentation.
