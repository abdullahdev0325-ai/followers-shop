# MongoDB Setup Guide

## Environment Variables

Add to `.env.local`:

```env
# MongoDB Connection String
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database_name?retryWrites=true&w=majority

# Or use DATABASE_URL (for compatibility)
DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/database_name?retryWrites=true&w=majority

# JWT Secret (for authentication)
JWT_SECRET=your-secret-key-change-in-production

# Stripe (Optional - for payments)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
```

## MongoDB Atlas Setup (Recommended)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user
4. Whitelist your IP address (or use `0.0.0.0/0` for development)
5. Get your connection string from "Connect" → "Connect your application"
6. Replace `<password>` and `<dbname>` in the connection string
7. Add it to `.env.local` as `MONGODB_URI`

## Local MongoDB Setup (Alternative)

If using local MongoDB:

```env
MONGODB_URI=mongodb://localhost:27017/uae_followers_project
```

## Database Collections

The application will automatically create the following collections:

- `users` - User accounts and authentication
- `categories` - Product categories
- `occasions` - Product occasions
- `deliverytimes` - Delivery time options
- `products` - Product catalog
- `blogs` - Blog posts
- `cartitems` - Shopping cart items
- `wishlistitems` - Wishlist items
- `orders` - Customer orders

## Installation

1. Install dependencies:

```bash
npm install
```

2. Make sure MongoDB is running (Atlas or local)

3. Start the development server:

```bash
npm run dev
```

## Features

- ✅ MongoDB with Mongoose ODM
- ✅ Automatic schema creation
- ✅ Connection pooling
- ✅ All CRUD operations
- ✅ Authentication & Authorization
- ✅ Cart & Wishlist
- ✅ Orders Management
- ✅ Admin Panel

## Troubleshooting

### Connection Error

- Check your `MONGODB_URI` is correct
- Verify your IP is whitelisted (for Atlas)
- Check your database user credentials
- Ensure MongoDB is running (for local setup)

### Collection Not Found

Collections are created automatically when you first insert data. No manual setup required!





