# Image Upload Usage Guide

## Overview

- **Categories**: Multiple images support
- **Products**: Multiple images support  
- **Blogs**: Single image support

All images are automatically deleted from Cloudinary when:
- Category/Product/Blog is deleted
- Image is replaced with a new one
- Image is manually deleted via the uploader component

## Components

### 1. MultipleImageUploader (Categories & Products)

```javascript
import MultipleImageUploader from '@/components/cloudinary/MultipleImageUploader';

<MultipleImageUploader 
  folder="categories" // or "products"
  existingImages={category.images || []}
  onImagesChange={(images) => {
    // Update your state
    setCategoryData({ ...categoryData, images });
  }}
  maxImages={10}
  label="Category Images"
/>
```

**Features:**
- Upload multiple images at once
- Delete individual images
- Replace images
- Reorder images (drag or use arrow buttons)
- Maximum images limit
- Automatic Cloudinary upload

### 2. SingleImageUploader (Blogs)

```javascript
import SingleImageUploader from '@/components/cloudinary/SingleImageUploader';

<SingleImageUploader 
  folder="blogs"
  existingImageUrl={blog.image_url || ''}
  onImageChange={(url) => {
    // Update your state
    setBlogData({ ...blogData, image_url: url });
  }}
  onImageDelete={() => {
    // Handle image deletion
    setBlogData({ ...blogData, image_url: '' });
  }}
  label="Blog Image"
/>
```

**Features:**
- Upload single image
- Delete image
- Replace image (automatically deletes old one)
- Automatic Cloudinary upload

## API Usage

### Categories API

**POST /api/categories**
```json
{
  "name": "Flowers",
  "slug": "flowers",
  "is_active": true,
  "images": [
    "https://res.cloudinary.com/.../image1.jpg",
    "https://res.cloudinary.com/.../image2.jpg"
  ]
}
```

**PUT /api/categories**
```json
{
  "id": "category_id",
  "images": ["url1", "url2", "url3"]
}
```

### Products API

**POST /api/products**
```json
{
  "name": "Rose Bouquet",
  "price": 99.99,
  "category": "flowers",
  "slug": "rose-bouquet",
  "images": [
    "https://res.cloudinary.com/.../product1.jpg",
    "https://res.cloudinary.com/.../product2.jpg"
  ]
}
```

**PUT /api/products** (if you add PUT route)
```json
{
  "id": "product_id",
  "images": ["url1", "url2"]
}
```

### Blogs API

**POST /api/blogs**
```json
{
  "title": "Blog Title",
  "slug": "blog-title",
  "content": "Blog content...",
  "image_url": "https://res.cloudinary.com/.../blog.jpg"
}
```

**PUT /api/blogs**
```json
{
  "id": "blog_id",
  "image_url": "https://res.cloudinary.com/.../new-blog.jpg"
}
```

## Example: Category Form

```javascript
'use client';

import { useState } from 'react';
import MultipleImageUploader from '@/components/cloudinary/MultipleImageUploader';

export default function CategoryForm({ category = null }) {
  const [formData, setFormData] = useState({
    name: category?.name || '',
    slug: category?.slug || '',
    is_active: category?.is_active ?? true,
    images: category?.images || [],
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const url = category 
      ? `/api/categories` // PUT
      : `/api/categories`; // POST
    
    const method = category ? 'PUT' : 'POST';
    
    const body = category 
      ? { ...formData, id: category.id }
      : formData;

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    console.log('Category saved:', data);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        placeholder="Category Name"
      />
      
      <MultipleImageUploader
        folder="categories"
        existingImages={formData.images}
        onImagesChange={(images) => {
          setFormData({ ...formData, images });
        }}
        maxImages={10}
        label="Category Images"
      />
      
      <button type="submit">Save Category</button>
    </form>
  );
}
```

## Example: Blog Form

```javascript
'use client';

import { useState } from 'react';
import SingleImageUploader from '@/components/cloudinary/SingleImageUploader';

export default function BlogForm({ blog = null }) {
  const [formData, setFormData] = useState({
    title: blog?.title || '',
    slug: blog?.slug || '',
    content: blog?.content || '',
    image_url: blog?.image_url || '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const url = `/api/blogs`;
    const method = blog ? 'PUT' : 'POST';
    
    const body = blog 
      ? { ...formData, id: blog.id }
      : formData;

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    console.log('Blog saved:', data);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        placeholder="Blog Title"
      />
      
      <SingleImageUploader
        folder="blogs"
        existingImageUrl={formData.image_url}
        onImageChange={(url) => {
          setFormData({ ...formData, image_url: url });
        }}
        onImageDelete={() => {
          setFormData({ ...formData, image_url: '' });
        }}
        label="Blog Image"
      />
      
      <button type="submit">Save Blog</button>
    </form>
  );
}
```

## Automatic Image Deletion

Images are automatically deleted from Cloudinary when:

1. **Category/Product deleted**: All images in the `images` array are deleted
2. **Blog deleted**: The `image_url` image is deleted
3. **Image replaced**: Old image is deleted when a new one is uploaded
4. **Image manually deleted**: Using the delete button in the uploader component

## Console Logging

All operations include detailed console logging:

- `[MultipleImageUploader]` - Multiple image uploader logs
- `[SingleImageUploader]` - Single image uploader logs
- `[Category API]` - Category API logs
- `[Blog API]` - Blog API logs
- `[Cloudinary]` - Cloudinary utility logs

Check browser console and server logs for debugging.

## Notes

- Images are stored as URLs in the database
- Maximum file size: 10MB per image
- Supported formats: All image formats (jpg, png, gif, webp, etc.)
- Images are organized in Cloudinary folders: `categories`, `products`, `blogs`





