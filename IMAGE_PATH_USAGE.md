# Quick Reference: Using normalizeImagePath()

## Import
```jsx
import { normalizeImagePath } from '@/lib/utils/normalizeImagePath';
```

## Basic Usage
```jsx
// In any component
const imageSrc = normalizeImagePath(product.image);

<img src={imageSrc} alt="Product" />
```

## With Fallback
```jsx
// Use custom fallback image
const imageSrc = normalizeImagePath(product.image, '/images/custom-fallback.jpg');
```

## With Next.js Image Component
```jsx
import Image from 'next/image';
import { normalizeImagePath } from '@/lib/utils/normalizeImagePath';

<Image 
  src={normalizeImagePath(product.image)} 
  alt="Product" 
  width={400} 
  height={400} 
/>
```

## Input Examples & Results

### ✅ Supported Inputs
```javascript
normalizeImagePath("mothers-day.jpg")           // → "/mothers-day.jpg"
normalizeImagePath("category/mothers-day.jpg")  // → "/category/mothers-day.jpg"
normalizeImagePath("/mothers-day.jpg")          // → "/mothers-day.jpg"
normalizeImagePath("https://unsplash.com/...")  // → "https://unsplash.com/..."
normalizeImagePath("http://cdn.example.com/...")// → "http://cdn.example.com/..."
normalizeImagePath("//cdn.example.com/...")     // → "//cdn.example.com/..."
normalizeImagePath("")                          // → "/images/fallback.jpg"
normalizeImagePath(null)                        // → "/images/fallback.jpg"
```

## Updated Components
These components now use normalizeImagePath():

1. ✅ ProductCard (src/components/products/ProductCard.jsx)
2. ✅ ProductCard Widgets (src/components/widgets/ProductCard.jsx)
3. ✅ BestSelling (src/components/home/BestSelling.jsx)
4. ✅ ProductList (src/components/products/ProductList.jsx)
5. ✅ ProductDetails (src/components/products/ProductDetails.jsx)
6. ✅ AdminProductTable (src/components/products/AdminProductTable.jsx)
7. ✅ CarouselProduct (src/components/products/single/CarouselProduct.jsx)
8. ✅ Occasion (src/components/home/Ocassion.jsx)

## Why This Works

The error "Failed to parse src" occurs because Next.js requires:
- Local paths to have a leading `/` (e.g., `/mothers-day.jpg`)
- External URLs to be absolute (e.g., `https://unsplash.com/...`)

This utility automatically:
1. Detects if the path is already valid
2. Adds a leading `/` to relative local paths
3. Preserves absolute URLs
4. Returns fallback for empty/null values

## No Breaking Changes
- Existing paths with leading `/` work unchanged
- Existing absolute URLs work unchanged
- Only relative paths get converted
- Database doesn't need migration
