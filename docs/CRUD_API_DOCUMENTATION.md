# CRUD APIs Documentation

## Overview

Production-ready CRUD APIs for Categories, Occasions, and Delivery Times entities. Each entity has separate API routes with full CRUD operations.

## Database Schema

### Tables Structure

All three entities follow the same schema pattern:

```sql
CREATE TABLE [entity_name] (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Tables Created

1. **categories** - Product categories (cakes, flowers, gifts, decor)
2. **occasions** - Product occasions (birthday, anniversary, etc.)
3. **delivery_times** - Delivery time options (same-day, midnight, etc.)

### Indexes

- `idx_[entity]_slug` - Fast slug lookups
- `idx_[entity]_is_active` - Filter active/inactive items

## API Routes

### Categories API

**Base URL:** `/api/categories`

#### GET - List Categories
```
GET /api/categories?search=flowers&page=1&limit=12&is_active=true
```

**Query Parameters:**
- `search` (optional) - Search by name
- `page` (optional, default: 1) - Page number
- `limit` (optional, default: 12, max: 100) - Items per page
- `is_active` (optional) - Filter by active status (true/false)

**Response:**
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

#### POST - Create Category
```
POST /api/categories
Content-Type: application/json

{
  "name": "Flowers",
  "slug": "flowers",
  "is_active": true
}
```

#### PUT - Update Category
```
PUT /api/categories
Content-Type: application/json

{
  "id": "uuid-here",
  "name": "Updated Name",
  "slug": "updated-slug",
  "is_active": false
}
```

#### DELETE - Delete Category/Categories
```
DELETE /api/categories?id=uuid-here
DELETE /api/categories?ids=uuid1,uuid2,uuid3
```

### Occasions API

**Base URL:** `/api/occasions`

Same structure as Categories API. Replace `categories` with `occasions` in URLs.

### Delivery Times API

**Base URL:** `/api/delivery-times`

Same structure as Categories API. Replace `categories` with `delivery-times` in URLs.

## CRUD API Flow

### 1. GET (List with Pagination & Search)

**Flow:**
1. Parse query parameters (search, page, limit, is_active)
2. Build WHERE clause dynamically using parameterized queries
3. Get total count for pagination
4. Fetch paginated results
5. Return structured response with data and pagination info

**Security:**
- All user inputs use parameterized queries
- Input validation and sanitization
- SQL injection prevention

### 2. POST (Create)

**Flow:**
1. Validate request body (name, slug, is_active)
2. Generate slug if not provided
3. Check for duplicate slugs
4. Insert new record
5. Return created entity

**Validation:**
- Name required, max 255 characters
- Slug format validation (lowercase, alphanumeric, hyphens, underscores)
- is_active defaults to true

### 3. PUT (Update)

**Flow:**
1. Validate ID is provided
2. Check if entity exists
3. Validate update data
4. Check for duplicate slugs (excluding current entity)
5. Build dynamic UPDATE query (only update provided fields)
6. Return updated entity

**Features:**
- Partial updates supported
- Only updates fields provided in request
- Validates slug uniqueness

### 4. DELETE (Single & Bulk)

**Flow:**
1. Parse ID(s) from query parameters
2. Validate IDs provided
3. Execute DELETE with parameterized query
4. Return deleted count and IDs

**Bulk Delete:**
- Supports comma-separated IDs: `?ids=uuid1,uuid2,uuid3`
- Uses `IN` clause with parameterized queries
- Returns count of deleted items

## Bulk Delete Handling

### Implementation

```javascript
// Single delete
DELETE /api/categories?id=uuid-here

// Bulk delete
DELETE /api/categories?ids=uuid1,uuid2,uuid3
```

### Security

- Parameterized queries prevent SQL injection
- IDs validated before deletion
- Returns only deleted items (prevents information leakage)

### Example Response

```json
{
  "success": true,
  "message": "3 category/categories deleted successfully",
  "data": {
    "deletedCount": 3,
    "deletedIds": ["uuid1", "uuid2", "uuid3"]
  }
}
```

## How Products Reference These Entities

### Current Implementation

Products table currently uses **text fields** for flexibility:
- `category` VARCHAR(100) - Stores category name/slug
- `occasions` VARCHAR(255) - Stores occasion name/slug
- `delivery` VARCHAR(255) - Stores delivery time name/slug

### Integration Options

#### Option 1: Text Matching (Current)
Products can match by:
- **Name**: `category = 'Flowers'`
- **Slug**: `category = 'flowers'` (from categories table slug)

**Pros:**
- Flexible, no foreign key constraints
- Easy to migrate existing data
- Products can have custom values

**Cons:**
- No referential integrity
- Potential data inconsistency

#### Option 2: Foreign Key References (Optional)
Add foreign key columns to products:

```sql
ALTER TABLE products 
ADD COLUMN category_id UUID REFERENCES categories(id);

ALTER TABLE products 
ADD COLUMN occasion_id UUID REFERENCES occasions(id);

ALTER TABLE products 
ADD COLUMN delivery_time_id UUID REFERENCES delivery_times(id);
```

**Pros:**
- Referential integrity
- Data consistency
- Easy joins for queries

**Cons:**
- Requires migration
- Less flexible

### Recommended Approach

**Hybrid Approach:**
1. Keep text fields for backward compatibility
2. Add optional UUID foreign keys
3. Products can use either:
   - Text field (for custom/legacy values)
   - UUID reference (for standardized values)

### Using in Product Filters

The GET products API can filter using these entities:

```javascript
// Filter by category slug
GET /api/products?category=flowers

// Filter by occasion
GET /api/products?occasion=birthday

// Filter by delivery time
GET /api/products?delivery=midnight
```

The API matches against the text fields in products table, which can be populated from the CRUD entities.

## Frontend Usage

### Admin Management Screens

Access via:
- `/admin/categories` - CategoryManager component
- `/admin/occasions` - OccasionManager component
- `/admin/delivery-times` - DeliveryTimeManager component

### Dropdowns in Product Form

Fetch active entities for dropdowns:

```javascript
import { getCategories } from '@/services/api/categoryService';

const result = await getCategories({ is_active: true, limit: 100 });
const categories = result.data.categories;
```

### Service Layer

All CRUD operations available via service functions:

```javascript
// Categories
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  bulkDeleteCategories,
} from '@/services/api/categoryService';

// Occasions
import {
  getOccasions,
  createOccasion,
  updateOccasion,
  deleteOccasion,
  bulkDeleteOccasions,
} from '@/services/api/occasionService';

// Delivery Times
import {
  getDeliveryTimes,
  createDeliveryTime,
  updateDeliveryTime,
  deleteDeliveryTime,
  bulkDeleteDeliveryTimes,
} from '@/services/api/deliveryTimeService';
```

## Code Architecture

### Reusable Logic

**`src/lib/crudHelpers.js`** - Shared CRUD functions:
- `buildWhereClause()` - Dynamic WHERE clause building
- `validateEntityData()` - Data validation
- `generateSlug()` - Slug generation from name
- `isValidSlug()` - Slug format validation

### API Routes

Each entity has separate route file:
- `src/app/api/categories/route.js`
- `src/app/api/occasions/route.js`
- `src/app/api/delivery-times/route.js`

All use shared `connectDB` for connection pooling.

### Components

All logic in components:
- `src/components/admin/CategoryManager.js`
- `src/components/admin/OccasionManager.js`
- `src/components/admin/DeliveryTimeManager.js`

Pages only import components:
- `src/app/admin/categories/page.js`
- `src/app/admin/occasions/page.js`
- `src/app/admin/delivery-times/page.js`

## Security Features

✅ **Parameterized Queries** - All SQL uses parameterized queries
✅ **Input Validation** - All inputs validated before processing
✅ **Slug Uniqueness** - Enforced at database level (UNIQUE constraint)
✅ **Error Handling** - Proper error messages without exposing internals
✅ **Connection Pooling** - Shared connection pool, no reconnection per request

## Performance Features

✅ **Indexed Queries** - Indexes on slug and is_active
✅ **Efficient Pagination** - LIMIT/OFFSET with proper counting
✅ **Dynamic SQL** - Only builds WHERE clauses when needed
✅ **Connection Pooling** - Reuses database connections




