# CRUD APIs Architecture Summary

## 🏗️ Architecture Overview

Production-ready CRUD APIs for three entities: **Categories**, **Occasions**, and **Delivery Times**.

### Key Principles

1. **Separation of Concerns** - All logic in components, pages only import
2. **Reusable Logic** - Shared helpers in `crudHelpers.js`
3. **Connection Pooling** - Single `connectDB` helper, no reconnection per request
4. **Parameterized Queries** - All SQL uses parameterized queries for security
5. **Clean API Responses** - Consistent `{ success, message, data }` format

## 📊 Database Schema

### Tables Created

```sql
-- Categories
CREATE TABLE categories (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Occasions (same structure)
CREATE TABLE occasions (...);

-- Delivery Times (same structure)
CREATE TABLE delivery_times (...);
```

### Key Features

- **UUID Primary Keys** - Better than auto-increment for distributed systems
- **Unique Slugs** - Enforced at database level
- **Indexes** - On slug and is_active for performance
- **Auto Timestamps** - created_at and updated_at with triggers

## 🔄 CRUD API Flow

### 1. GET (List with Pagination)

```
Request → Parse Query Params → Build WHERE Clause → 
Get Total Count → Fetch Paginated Results → Return Response
```

**Features:**
- Search by name
- Filter by is_active
- Pagination (page, limit)
- Returns: data, pagination info

### 2. POST (Create)

```
Request → Validate Data → Generate Slug → 
Check Duplicates → Insert → Return Created Entity
```

**Validation:**
- Name required (max 255 chars)
- Slug format validation
- Slug uniqueness check

### 3. PUT (Update)

```
Request → Validate ID → Check Exists → 
Validate Data → Check Slug Uniqueness → 
Build Dynamic Update → Update → Return Updated Entity
```

**Features:**
- Partial updates (only update provided fields)
- Slug uniqueness (excluding current entity)

### 4. DELETE (Single & Bulk)

```
Request → Parse ID(s) → Validate → 
Execute DELETE → Return Deleted Count
```

**Bulk Delete:**
- Comma-separated IDs: `?ids=uuid1,uuid2,uuid3`
- Uses parameterized `IN` clause
- Returns deleted count and IDs

## 🗑️ Bulk Delete Handling

### Implementation

**Single Delete:**
```javascript
DELETE /api/categories?id=uuid-here
```

**Bulk Delete:**
```javascript
DELETE /api/categories?ids=uuid1,uuid2,uuid3
```

### Security

1. **Parameterized Queries** - IDs passed as parameters, not string concatenation
2. **Validation** - IDs validated before deletion
3. **Safe Response** - Only returns deleted items

### Code Example

```javascript
// Parse IDs
let idsToDelete = [];
if (ids) {
  idsToDelete = ids.split(',').map(id => id.trim()).filter(Boolean);
} else {
  idsToDelete = [id];
}

// Build parameterized query
const placeholders = idsToDelete.map((_, index) => `$${index + 1}`).join(', ');
const deleteQuery = `DELETE FROM categories WHERE id IN (${placeholders}) RETURNING *`;

// Execute
const result = await query(deleteQuery, idsToDelete);
```

## 🔗 How Products Reference These Entities

### Current Implementation

Products table uses **text fields**:
- `category` VARCHAR(100) - Category name/slug
- `occasions` VARCHAR(255) - Occasion name/slug  
- `delivery` VARCHAR(255) - Delivery time name/slug

### Integration Strategy

**Option 1: Text Matching (Current)**
- Products match by name or slug
- Flexible, no foreign keys
- Used in product filters

**Option 2: Foreign Keys (Optional)**
```sql
ALTER TABLE products 
ADD COLUMN category_id UUID REFERENCES categories(id);
```

**Recommended: Hybrid Approach**
- Keep text fields for flexibility
- Add optional UUID foreign keys
- Support both text and UUID references

### Usage in Product Filters

```javascript
// GET products API filters by text matching
GET /api/products?category=flowers&occasion=birthday&delivery=midnight
```

The API matches against text fields in products table, which can be populated from CRUD entities.

## 📁 File Structure

```
src/
├── app/
│   ├── api/
│   │   ├── categories/route.js      # Categories CRUD API
│   │   ├── occasions/route.js       # Occasions CRUD API
│   │   └── delivery-times/route.js  # Delivery Times CRUD API
│   └── admin/
│       ├── categories/page.js        # Categories admin page
│       ├── occasions/page.js         # Occasions admin page
│       └── delivery-times/page.js   # Delivery Times admin page
├── components/
│   └── admin/
│       ├── CategoryManager.js        # Categories component (all logic)
│       ├── OccasionManager.js        # Occasions component (all logic)
│       └── DeliveryTimeManager.js    # Delivery Times component (all logic)
├── services/
│   └── api/
│       ├── categoryService.js       # Categories API service
│       ├── occasionService.js       # Occasions API service
│       └── deliveryTimeService.js   # Delivery Times API service
└── lib/
    ├── connectDB.js                 # Database connection pool
    └── crudHelpers.js               # Shared CRUD helpers
```

## 🎯 Component Architecture

### Pages (Server Components)

```javascript
// src/app/admin/categories/page.js
import CategoryManager from '@/components/admin/CategoryManager';

export const metadata = { ... };

export default function CategoriesPage() {
  return <CategoryManager />;
}
```

**Responsibilities:**
- SEO metadata
- Import component only
- No business logic

### Components (Client Components)

```javascript
// src/components/admin/CategoryManager.js
'use client';

export default function CategoryManager() {
  // All logic here:
  // - State management
  // - API calls
  // - Form handling
  // - CRUD operations
  // - UI rendering
}
```

**Responsibilities:**
- All business logic
- State management
- API integration
- UI rendering

## 🔒 Security Features

✅ **Parameterized Queries** - All SQL uses `$1, $2, ...` parameters
✅ **Input Validation** - All inputs validated before processing
✅ **Slug Uniqueness** - Database UNIQUE constraint
✅ **Error Handling** - Proper errors without exposing internals
✅ **Connection Pooling** - Shared pool, no reconnection per request

## ⚡ Performance Features

✅ **Indexes** - On slug and is_active columns
✅ **Efficient Pagination** - LIMIT/OFFSET with proper counting
✅ **Dynamic SQL** - Only builds WHERE clauses when needed
✅ **Connection Pooling** - Reuses database connections

## 📝 API Response Format

### Success Response

```json
{
  "success": true,
  "message": "Category created successfully",
  "data": {
    "id": "uuid",
    "name": "Flowers",
    "slug": "flowers",
    "is_active": true,
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": ["Name is required", "Slug must be valid"]
}
```

### List Response

```json
{
  "success": true,
  "data": {
    "categories": [...],
    "pagination": {
      "currentPage": 1,
      "limit": 12,
      "total": 50,
      "totalPages": 5,
      "hasNextPage": true,
      "hasPreviousPage": false
    }
  }
}
```

## 🚀 Usage Examples

### Admin Management

Access admin pages:
- `/admin/categories` - Manage categories
- `/admin/occasions` - Manage occasions
- `/admin/delivery-times` - Manage delivery times

### API Usage

```javascript
import { getCategories, createCategory } from '@/services/api/categoryService';

// Get categories
const result = await getCategories({ 
  search: 'flowers', 
  page: 1, 
  limit: 12 
});

// Create category
const newCategory = await createCategory({
  name: 'Flowers',
  slug: 'flowers',
  is_active: true
});
```

### Dropdowns in Product Form

```javascript
// Fetch active categories for dropdown
const result = await getCategories({ 
  is_active: true, 
  limit: 100 
});
const categories = result.data.categories;
```

## ✅ Production-Ready Features

- ✅ Parameterized SQL queries
- ✅ Input validation
- ✅ Error handling
- ✅ Connection pooling
- ✅ Pagination
- ✅ Search functionality
- ✅ Bulk operations
- ✅ Clean API responses
- ✅ Reusable code
- ✅ SEO metadata
- ✅ Component-based architecture




