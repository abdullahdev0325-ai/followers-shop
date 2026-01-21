This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## 🚀 Admin Product Management System

A production-ready Next.js (App Router) admin product add system with Neon PostgreSQL integration.

### Features

- ✅ Clean, scalable architecture
- ✅ Component-based code structure
- ✅ Neon PostgreSQL with connection pooling
- ✅ SEO-ready with Next.js metadata API
- ✅ Form validation and error handling
- ✅ Auto-generated slugs from product names
- ✅ Responsive design with dark mode support

### 📁 Project Structure

```
src/
├── app/
│   ├── admin/product/add-product/
│   │   └── page.js          # Admin page (imports AddProduct only)
│   └── api/products/
│       └── route.js          # POST/GET product API
├── components/
│   └── admin/
│       └── AddProduct.js     # Main product form component
├── services/api/
│   └── productService.js     # API service layer
└── lib/
    └── connectDB.js          # Database connection pool
```

### 🗄️ Database Setup

1. **Create a Neon PostgreSQL database** at [console.neon.tech](https://console.neon.tech)

2. **Run the schema** to create the products table:
   ```bash
   # Copy your DATABASE_URL from Neon console
   # Then run the SQL from database/schema.sql in your Neon SQL editor
   ```

3. **Configure environment variables**:
   ```bash
   # Create .env.local file
   DATABASE_URL=postgresql://username:password@hostname/database?sslmode=require
   ```

### 🚀 Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   - Copy `.env.local.example` to `.env.local`
   - Add your Neon PostgreSQL `DATABASE_URL`

3. **Run the development server**:
```bash
npm run dev
   ```

4. **Access the admin page**:
   - Open [http://localhost:3000/admin/product/add-product](http://localhost:3000/admin/product/add-product)

### 📝 Form Fields

- **Required**: name, price, category, slug
- **Optional**: gender, delivery, occasions, seo_title, seo_description

### 🔧 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: Neon PostgreSQL with `pg` library
- **Styling**: Tailwind CSS
- **Language**: JavaScript (ES6+)

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
