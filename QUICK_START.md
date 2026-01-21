# ⚡ Quick Setup Checklist

## 1️⃣ Update `.env` File

**Required fields to update:**

```env
# MongoDB - Get from MongoDB Atlas Dashboard
DATABASE_URL="mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/uae_followers_db"

# Cloudinary - Already configured, keep as is or update with your credentials
CLOUDINARY_CLOUD_NAME="dqymzk6xg"
CLOUDINARY_API_KEY="939688672858936"
CLOUDINARY_API_SECRET="gu77cf2LBQZA3Gjo_5EevtpkBWY"

# Gmail App Password (2FA must be enabled)
EMAIL_USER="your-gmail@gmail.com"
EMAIL_PASS="your-16-char-app-password"

# Admin Login (for first time)
ADMIN_USER="admin@uaefollowers.com"
ADMIN_PASS="Admin@123"
```

---

## 2️⃣ Install Dependencies

```bash
npm install
```

---

## 3️⃣ Create Admin User

The database collections are **automatically created** when you run the app!

To create the first admin user:

```bash
npm run seed:admin
```

This will:
- ✅ Connect to MongoDB
- ✅ Create `users` collection (if not exists)
- ✅ Create admin user with email: `admin@uaefollowers.com`
- ✅ Display login credentials

---

## 4️⃣ Run the Application

```bash
npm run dev
```

App will start at: **http://localhost:3000**

---

## 5️⃣ Login to Admin Dashboard

1. Go to: **http://localhost:3000/auth/login**
2. Email: `admin@uaefollowers.com`
3. Password: `Admin@123`
4. Click **Login**
5. Go to: **http://localhost:3000/admin**

---

## ✨ What's Included

### Database Collections (Auto-Created)
- ✅ `users` - Admin/Customer accounts
- ✅ `products` - Product catalog
- ✅ `categories` - Product categories
- ✅ `occasions` - Occasions for gifts
- ✅ `blogs` - Blog posts
- ✅ `cartitems` - Shopping cart
- ✅ `wishlistitems` - Wishlists
- ✅ `orders` - Customer orders

### Admin Features
- ✅ Add/Edit/Delete Products
- ✅ Manage Categories
- ✅ Manage Blogs
- ✅ View Orders
- ✅ Upload Images to Cloudinary

### Customer Features
- ✅ Browse Products
- ✅ Add to Cart
- ✅ Checkout with Stripe
- ✅ View Orders
- ✅ Wishlist

---

## 🆘 Troubleshooting

### MongoDB Connection Failed
```
ERROR: connect ENOTFOUND mongodb.net
```
**Fix:**
1. Check MongoDB connection string in `.env`
2. Whitelist your IP in MongoDB Atlas (Settings → Network Access → Add IP)
3. Ensure cluster is running

### Admin User Already Exists
```
⚠️  Admin user already exists: admin@uaefollowers.com
```
**This is OK!** Just proceed to login.

### Email Not Sending
**For Gmail:**
1. Enable 2-Factor Authentication in Gmail
2. Generate [App Password](https://myaccount.google.com/apppasswords)
3. Use the 16-character app password (not your regular password)
4. Update `EMAIL_PASS` in `.env`

### PORT 3000 Already in Use
```bash
npm run dev -- -p 3001
```

---

## 📚 For Detailed Documentation

- **MongoDB Setup** → [MONGODB_SETUP.md](MONGODB_SETUP.md)
- **Cloudinary Setup** → [CLOUDINARY_SETUP.md](CLOUDINARY_SETUP.md)
- **Email Setup** → [EMAIL_SETUP.md](EMAIL_SETUP.md)
- **Complete Guide** → [SETUP_GUIDE.md](SETUP_GUIDE.md)
- **API Docs** → [docs/CRUD_API_DOCUMENTATION.md](docs/CRUD_API_DOCUMENTATION.md)

---

## 🚀 First Steps as Admin

1. Login to admin dashboard
2. Go to: **http://localhost:3000/admin/product**
3. Add your first product
4. Upload images using Cloudinary uploader
5. Create categories
6. Create blogs

---

**Your app is now fully functional! No manual database setup needed.** ✨
