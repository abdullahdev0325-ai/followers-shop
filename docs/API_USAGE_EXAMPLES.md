# Products API Usage Examples

## GET /api/products

Production-ready GET products API with filters and pagination.

### Query Parameters

| Parameter | Type | Description | Example Values |
|-----------|------|-------------|----------------|
| `category` | string | Filter by category | `cakes`, `flowers`, `gifts`, `decor` |
| `gender` | string | Filter by gender | `her`, `him`, `both` |
| `delivery` | string | Filter by delivery type | `same-day`, `midnight` |
| `occasion` | string | Filter by occasion | `birthday`, `anniversary`, etc. |
| `search` | string | Search product name | Any text |
| `minPrice` | number | Minimum price filter | `10.00`, `50`, etc. |
| `maxPrice` | number | Maximum price filter | `100.00`, `500`, etc. |
| `page` | number | Page number (MANDATORY) | `1`, `2`, `3`, etc. |
| `limit` | number | Items per page (MANDATORY, max: 100) | `12`, `24`, `50`, etc. |

### Response Format

```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": 1,
        "name": "Product Name",
        "price": 99.99,
        "category": "cakes",
        "gender": "her",
        "delivery": "same-day",
        "occasions": "birthday",
        "description": "Product description",
        "slug": "product-slug",
        "seo_title": "SEO Title",
        "seo_description": "SEO Description",
        "created_at": "2024-01-01T00:00:00.000Z",
        "updated_at": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "limit": 12,
      "total": 50,
      "totalPages": 5,
      "hasNextPage": true,
      "hasPreviousPage": false
    },
    "filters": {
      "category": "cakes",
      "gender": null,
      "delivery": null,
      "occasion": null,
      "search": null,
      "minPrice": null,
      "maxPrice": null
    }
  }
}
```

## Frontend Usage Examples

### Example 1: Filter by Category

```javascript
// Using fetch
const response = await fetch('/api/products?category=cakes&page=1&limit=12');
const data = await response.json();
console.log(data.data.products);
console.log(data.data.pagination);

// Using productService
import { getProducts } from '@/services/api/productService';

const result = await getProducts({
  category: 'cakes',
  page: 1,
  limit: 12
});

console.log(result.data.products);
console.log(result.data.pagination);
```

### Example 2: Filter by Gender and Occasion

```javascript
// URL: /api/products?gender=her&occasion=birthday&page=1&limit=12

const result = await getProducts({
  gender: 'her',
  occasion: 'birthday',
  page: 1,
  limit: 12
});
```

### Example 3: Filter by Delivery Type

```javascript
// URL: /api/products?delivery=midnight&page=1&limit=12

const result = await getProducts({
  delivery: 'midnight',
  page: 1,
  limit: 12
});
```

### Example 4: Search Products

```javascript
// URL: /api/products?search=chocolate&page=1&limit=12

const result = await getProducts({
  search: 'chocolate',
  page: 1,
  limit: 12
});
```

### Example 5: Price Range Filter

```javascript
// URL: /api/products?minPrice=50&maxPrice=200&page=1&limit=12

const result = await getProducts({
  minPrice: 50,
  maxPrice: 200,
  page: 1,
  limit: 12
});
```

### Example 8: Colour & Premium Filters

```javascript
// URL: /api/products?colour=red&premium=true&page=1&limit=12

const premiumReds = await getProducts({ colour: 'red', premium: true, page: 1, limit: 12 });
```

### Example 9: Sorting (Premium first or Price)

```javascript
// URL: /api/products?sort=premium&page=1&limit=12
const premiumFirst = await getProducts({ sort: 'premium', page: 1, limit: 12 });

// URL: /api/products?sort=price_desc&page=1&limit=12
const expensiveFirst = await getProducts({ sort: 'price_desc', page: 1, limit: 12 });
```

### Example 10: Bulk Add / Bulk Delete

```javascript
// Bulk add: POST /api/products/bulk with { products: [ {name, price, category, slug, ...}, ... ] }
const bulkAddResult = await bulkAddProducts([{ name: 'A', price: 10, category: 'gifts', slug: 'a' }, { name: 'B', price: 20, category: 'gifts', slug: 'b' }]);

// Bulk delete: DELETE /api/products/bulk with { ids: ['id1','id2'] }
const bulkDeleteResult = await bulkDeleteProducts(['id1','id2']);
```

### Example 6: Multiple Filters Combined

```javascript
// URL: /api/products?category=flowers&gender=her&delivery=same-day&occasion=anniversary&minPrice=100&maxPrice=500&page=1&limit=24

const result = await getProducts({
  category: 'flowers',
  gender: 'her',
  delivery: 'same-day',
  occasion: 'anniversary',
  minPrice: 100,
  maxPrice: 500,
  page: 1,
  limit: 24
});
```

### Example 7: Pagination Navigation

```javascript
// Get first page
const page1 = await getProducts({ page: 1, limit: 12 });

// Navigate to next page
if (page1.data.pagination.hasNextPage) {
  const page2 = await getProducts({ 
    page: page1.data.pagination.currentPage + 1, 
    limit: 12 
  });
}

// Get last page
const lastPage = await getProducts({ 
  page: page1.data.pagination.totalPages, 
  limit: 12 
});
```

## React Component Example

```javascript
'use client';

import { useState, useEffect } from 'react';
import { getProducts } from '@/services/api/productService';

export default function ProductsList() {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    gender: '',
    page: 1,
    limit: 12
  });

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const result = await getProducts(filters);
      setProducts(result.data.products);
      setPagination(result.data.pagination);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Products</h1>
      
      {/* Filters */}
      <div>
        <select 
          value={filters.category} 
          onChange={(e) => setFilters({ ...filters, category: e.target.value, page: 1 })}
        >
          <option value="">All Categories</option>
          <option value="cakes">Cakes</option>
          <option value="flowers">Flowers</option>
          <option value="gifts">Gifts</option>
          <option value="decor">Decor</option>
        </select>
      </div>

      {/* Products List */}
      <div>
        {products.map(product => (
          <div key={product.id}>
            <h3>{product.name}</h3>
            <p>${product.price}</p>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {pagination && (
        <div>
          <button 
            disabled={!pagination.hasPreviousPage}
            onClick={() => handlePageChange(pagination.currentPage - 1)}
          >
            Previous
          </button>
          
          <span>
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          
          <button 
            disabled={!pagination.hasNextPage}
            onClick={() => handlePageChange(pagination.currentPage + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
```

## Security Features

- ✅ **Parameterized Queries**: All user inputs are sanitized using parameterized queries to prevent SQL injection
- ✅ **Input Validation**: Query parameters are validated and sanitized before use
- ✅ **Type Safety**: Numbers are parsed and validated
- ✅ **Limit Enforcement**: Maximum limit of 100 items per page enforced

## Performance Features

- ✅ **Connection Pooling**: Uses shared database connection pool (no reconnect per request)
- ✅ **Indexed Queries**: Database indexes on category, slug, and created_at for fast queries
- ✅ **Efficient Pagination**: Uses LIMIT/OFFSET for efficient data retrieval
- ✅ **Dynamic SQL**: Only builds WHERE clauses for provided filters




