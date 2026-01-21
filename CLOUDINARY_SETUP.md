# Cloudinary Setup Guide

## Installation

Cloudinary package is already installed. If you need to reinstall:

```bash
npm install cloudinary
```

## Environment Variables

Add to `.env.local`:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Getting Cloudinary Credentials

1. Go to [Cloudinary Dashboard](https://cloudinary.com/console)
2. Sign up or log in
3. Go to Dashboard → Settings
4. Copy your:
   - Cloud Name
   - API Key
   - API Secret

## Usage

### Backend (Server-side)

Import the Cloudinary utility:

```javascript
import { 
  uploadImage, 
  deleteImage, 
  getImageUrl, 
  extractPublicId,
  isCloudinaryConfigured 
} from '@/lib/cloudinary';
```

#### Upload Image

```javascript
// From buffer
const buffer = Buffer.from(fileData);
const result = await uploadImage(buffer, {
  folder: 'products',
  public_id: 'custom-id',
});

// From file path or URL
const result = await uploadImageFromPath('path/to/image.jpg', {
  folder: 'products',
});
```

#### Delete Image

```javascript
// Delete by public ID
const result = await deleteImage('folder/image-id');

// Delete multiple images
const result = await deleteMultipleImages(['id1', 'id2', 'id3']);

// Extract public ID from URL and delete
const publicId = extractPublicId('https://res.cloudinary.com/...');
await deleteImage(publicId);
```

#### Get Image URL

```javascript
// Get original URL
const url = getImageUrl('folder/image-id');

// Get transformed URL
const url = getImageUrl('folder/image-id', {
  width: 500,
  height: 500,
  crop: 'fill',
  quality: 'auto',
  format: 'webp',
});
```

### Frontend (Client-side)

Import the Cloudinary service:

```javascript
import cloudinaryService from '@/services/cloudinary';
```

#### Upload Image

```javascript
const fileInput = document.querySelector('input[type="file"]');
const file = fileInput.files[0];

const result = await cloudinaryService.uploadImage(file, {
  folder: 'products',
});

console.log('Image URL:', result.url);
console.log('Public ID:', result.public_id);
```

#### Delete Image

```javascript
// Delete by public ID
await cloudinaryService.deleteImage('folder/image-id');

// Delete by URL
await cloudinaryService.deleteImageByUrl('https://res.cloudinary.com/...');

// Delete multiple
await cloudinaryService.deleteMultipleImages(['id1', 'id2']);
```

#### Get Image URL

```javascript
const url = await cloudinaryService.getImageUrl('folder/image-id', {
  width: 500,
  height: 500,
  crop: 'fill',
});
```

## API Routes

### Upload Image

**POST** `/api/upload/image`

Form Data:
- `file` (required): Image file
- `folder` (optional): Folder path (default: 'uae_followers')
- `public_id` (optional): Custom public ID

Response:
```json
{
  "success": true,
  "message": "Image uploaded successfully",
  "data": {
    "url": "https://res.cloudinary.com/...",
    "public_id": "folder/image-id",
    "width": 1920,
    "height": 1080,
    "format": "jpg",
    "bytes": 123456
  }
}
```

### Delete Image

**DELETE** `/api/upload/delete`

Query Params:
- `public_id`: Single public ID
- `public_ids`: Comma-separated public IDs
- `url`: Cloudinary URL (public ID will be extracted)

Response:
```json
{
  "success": true,
  "message": "Image deleted successfully",
  "data": {
    "success": true,
    "public_id": "folder/image-id"
  }
}
```

### Get Image URL

**GET** `/api/upload/get`

Query Params:
- `public_id` (required): Public ID of the image
- `width`: Image width
- `height`: Image height
- `crop`: Crop mode (fill, fit, scale, etc.)
- `quality`: Image quality (auto, auto:best, etc.)
- `format`: Image format (jpg, png, webp, etc.)
- `gravity`: Gravity for cropping (face, center, etc.)

Response:
```json
{
  "success": true,
  "data": {
    "url": "https://res.cloudinary.com/...",
    "public_id": "folder/image-id",
    "transformations": {
      "width": 500,
      "height": 500
    }
  }
}
```

## Example: Upload in Product Form

```javascript
'use client';

import { useState } from 'react';
import cloudinaryService from '@/services/cloudinary';

export default function ProductForm() {
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const result = await cloudinaryService.uploadImage(file, {
        folder: 'products',
      });
      setImageUrl(result.url);
      console.log('Image uploaded:', result);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleImageUpload} disabled={uploading} />
      {imageUrl && <img src={imageUrl} alt="Uploaded" />}
    </div>
  );
}
```

## Example: Delete Image

```javascript
import cloudinaryService from '@/services/cloudinary';

const handleDelete = async (imageUrl) => {
  try {
    await cloudinaryService.deleteImageByUrl(imageUrl);
    console.log('Image deleted successfully');
  } catch (error) {
    console.error('Delete error:', error);
  }
};
```

## Console Logging

All Cloudinary operations include detailed console logging for debugging:

- `[Cloudinary]` - Backend utility logs
- `[Cloudinary Service]` - Frontend service logs
- `[API]` - API route logs

Check your browser console and server logs for detailed information.

## Error Handling

All functions include proper error handling and will throw errors that you can catch:

```javascript
try {
  const result = await cloudinaryService.uploadImage(file);
} catch (error) {
  console.error('Error:', error.message);
  // Handle error
}
```

## Best Practices

1. **Use folders**: Organize images by folder (e.g., 'products', 'blogs', 'users')
2. **Delete unused images**: Always delete images when removing products/blogs
3. **Use transformations**: Use Cloudinary transformations for responsive images
4. **Check configuration**: Use `isCloudinaryConfigured()` before operations
5. **Extract public IDs**: Use `extractPublicId()` to get public ID from URLs

## Troubleshooting

### "Cloudinary is not configured"
- Check your `.env.local` file
- Verify all three environment variables are set
- Restart your dev server after adding env variables

### "Failed to upload image"
- Check file size (Cloudinary free tier has limits)
- Verify file format is supported
- Check Cloudinary dashboard for errors

### "Image not found" on delete
- Verify the public ID is correct
- Check if image was already deleted
- Ensure you're using the correct folder path





