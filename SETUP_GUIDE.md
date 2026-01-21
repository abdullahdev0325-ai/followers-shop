# Complete Project Setup Guide

## 🚀 Quick Start - Setup Your Project

This project uses **MongoDB** with **Mongoose** for automatic schema management. No manual SQL migrations needed!

---

## Step 1: Configure Environment Variables

Edit your `.env` file and add your credentials:

### MongoDB Setup
```env
DATABASE_URL="mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/uae_followers_db?retryWrites=true&w=majority"
```

**How to get MongoDB credentials:**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (free tier available)
3. Create a database user
4. Whitelist your IP: Click "Add My Current IP Address"
5. Click "Connect" → "Connect your application"
6. Copy the connection string and replace username/password/cluster

### Cloudinary Setup
```env
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your_cloud_name"
```

**How to get Cloudinary credentials:**
1. Go to [Cloudinary Dashboard](https://cloudinary.com/console)
2. Settings → API Keys
3. Copy Cloud Name, API Key, and API Secret

### Email Setup (Gmail)
```env
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=587
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"
```

**For Gmail:**
1. Enable 2-Factor Authentication
2. Generate an [App Password](https://myaccount.google.com/apppasswords)
3. Use the generated password (16 characters)

### Admin Credentials
```env
ADMIN_USER="admin@uaefollowers.com"
ADMIN_PASS="Admin@123"
```

---

## Step 2: Database Setup (Automatic)

Your project uses **Mongoose** which automatically creates collections. Here's how:

### Database Collections Created Automatically:
- `users` - User accounts and authentication
- `products` - Product catalog with colors, sizes, delivery
- `categories` - Product categories
- `occasions` - Product occasions (birthdays, etc.)
- `blogs` - Blog posts
- `cartitems` - Shopping cart items
- `wishlistitems` - Wishlist items
- `orders` - Customer orders
- `deliverytimes` - Delivery time options

### To Initialize the Database:

**Option 1: Run the app (Auto-creates collections)**
```bash
npm run dev
```
When the app connects to MongoDB, Mongoose automatically creates all collections based on the models in `src/models/`.

**Option 2: Seed Admin User (Recommended)**
Create a file `src/scripts/seedAdmin.js`:

```javascript
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '@/models/User';

async function seedAdmin() {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    
    const adminExists = await User.findOne({ email: process.env.ADMIN_USER });
    
    if (adminExists) {
      console.log('✅ Admin user already exists');
      return;
    }
    
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASS, 10);
    
    const admin = await User.create({
      email: process.env.ADMIN_USER,
      password_hash: hashedPassword,
      first_name: 'Admin',
      last_name: 'User',
      role: 'admin',
      is_active: true,
      is_verified: true,
    });
    
    console.log('✅ Admin user created:', admin.email);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

seedAdmin();
```

Then run:
```bash
node -r @babel/register src/scripts/seedAdmin.js
```

---

## Step 3: Install Dependencies

```bash
npm install
```

All packages are listed in `package.json`:
- Next.js 16.1.1
- React 19.2.3
- Mongoose 8.21.0
- Cloudinary
- Nodemailer
- Stripe
- Redux Toolkit

---

## Step 4: Run the Application

```bash
npm run dev
```

The app will start at `http://localhost:3000`

### Application Features:

**User/Customer:**
- Browse products
- Add to cart
- Checkout with Stripe
- View orders
- Wishlist

**Admin Dashboard:**
- Product management (Create, Read, Update, Delete)
- Category management
- Blog management
- Order management
- Analytics

---

## Step 5: Admin Login

**Login URL:** `http://localhost:3000/auth/login`

**Credentials:**
```
Email: admin@uaefollowers.com
Password: Admin@123
```

After login, go to: `http://localhost:3000/admin`

---

## Database Models (Auto-Created)

### User Model
```javascript
{
  email: String (unique),
  password_hash: String,
  first_name: String,
  last_name: String,
  role: String ('admin', 'manager', 'user'),
  is_active: Boolean,
  is_verified: Boolean,
  created_at: Date,
  updated_at: Date
}
```

### Product Model
```javascript
{
  name: String,
  description: String,
  price: Number,
  category: ObjectId (ref: Category),
  colors: [String],
  sizes: [String],
  images: [String] (Cloudinary URLs),
  occasions: [String],
  delivery_options: [String],
  slug: String (unique),
  seo_title: String,
  seo_description: String,
  created_at: Date,
  updated_at: Date
}
```

### Order Model
```javascript
{
  user_id: ObjectId (ref: User),
  items: [
    {
      product_id: ObjectId,
      quantity: Number,
      price: Number
    }
  ],
  total_price: Number,
  payment_status: String,
  order_status: String,
  delivery_address: String,
  created_at: Date,
  updated_at: Date
}
```

---

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create product (admin)
- `PATCH /api/products/[id]` - Update product (admin)
- `DELETE /api/products/[id]` - Delete product (admin)

### Cart
- `GET /api/cart` - Get cart items
- `POST /api/cart` - Add to cart
- `DELETE /api/cart/[id]` - Remove from cart

### Orders
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create order
- `PATCH /api/orders/[id]` - Update order status (admin)

### Blogs
- `GET /api/blogs` - Get all blogs
- `POST /api/blogs` - Create blog (admin)

---

## Troubleshooting

### MongoDB Connection Error
```
Error: connect ENOTFOUND mongodb.net
```
**Solution:**
1. Check your connection string in `.env`
2. Whitelist your IP in MongoDB Atlas
3. Ensure cluster is running

### Cloudinary Upload Error
```
Error: Cloudinary is not configured
```
**Solution:**
1. Verify `CLOUDINARY_API_KEY` and `CLOUDINARY_API_SECRET` in `.env`
2. Restart the app: `npm run dev`

### Email Not Sending
```
Error: Invalid login: 534
```
**Solution:**
1. For Gmail, use [App Password](https://myaccount.google.com/apppasswords) not regular password
2. Enable 2-Factor Authentication first

---

## Project Structure

```
src/
├── app/
│   ├── admin/              # Admin dashboard
│   ├── auth/               # Login/Signup pages
│   ├── api/                # API routes
│   ├── checkout/           # Checkout page
│   ├── orders/             # Orders page
│   └── product/            # Product pages
├── components/             # React components
├── hooks/                  # Custom hooks (Context API)
├── lib/                    # Utilities & helpers
├── models/                 # Mongoose schemas
└── services/               # API services
```

---

## Technologies Used

- **Frontend:** Next.js 16, React 19, Tailwind CSS
- **Backend:** Next.js API Routes
- **Database:** MongoDB + Mongoose
- **Authentication:** JWT (Custom)
- **File Upload:** Cloudinary
- **Email:** Nodemailer
- **Payment:** Stripe
- **State Management:** Redux Toolkit
- **Styling:** Tailwind CSS

---

## Environment Variables Checklist

- [ ] DATABASE_URL (MongoDB)
- [ ] ADMIN_USER (email)
- [ ] ADMIN_PASS (password)
- [ ] JWT_SECRET
- [ ] CLOUDINARY_CLOUD_NAME
- [ ] CLOUDINARY_API_KEY
- [ ] CLOUDINARY_API_SECRET
- [ ] EMAIL_USER (Gmail)
- [ ] EMAIL_PASS (App Password)
- [ ] STRIPE_SECRET_KEY (optional)

---

## Getting Help

Check these files for more details:
- [MongoDB Setup](MONGODB_SETUP.md)
- [Cloudinary Setup](CLOUDINARY_SETUP.md)
- [Email Setup](EMAIL_SETUP.md)
- [API Documentation](docs/CRUD_API_DOCUMENTATION.md)

---

**Happy coding! 🚀**
