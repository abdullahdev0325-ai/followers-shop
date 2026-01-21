import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/connectDB';
import Product from '@/models/Product';
import Category from '@/models/Category';
import { logRequest, logResponse } from '@/lib/apiLogger';
import { uploadImage, uploadMultipleImages } from '@/components/cloudinary/ImageUploader';
import { generateSlug } from '@/lib/generateSlug';

/**
 * POST /api/products
 * Create a single product with multiple images and auto-generated slug
 */
export async function POST(request) {
  try {
    await connectDB();
    const body = await request.formData(); // use FormData for image files
    logRequest('/api/products', 'POST', { body });

    const name = body.get('name');
    const price = parseFloat(body.get('price'));
    let category = body.get('category');
    let slug = body.get('slug');
    const description = body.get('description');
    // colour/size are single values in the Product schema
    const colour = body.get('colour') || null;
    const size = body.get('size') || null;
    // accept either 'occasions' or 'occasion' (comma separated ids)
    const occasionParam = body.get('occasions') || body.get('occasion') || '';
    const occasions = occasionParam ? occasionParam.split(',').filter(Boolean) : [];
    let delivery = body.get('delivery') || null;
    const premium = body.get('premium') === 'true';
    const seo_title = body.get('seo_title') || null;
    const seo_description = body.get('seo_description') || null;

    // Normalize delivery option values to match schema enums
    const deliveryMap = {
      'same day': 'same-day',
      'same-day': 'same-day',
      'on-demand': 'on-delivery',
      'on-delivery': 'on-delivery',
      'night-time': 'night-time',
      'express': 'express',
    };
    if (delivery) delivery = deliveryMap[delivery] || delivery;

    // Resolve category if a name was provided instead of an ObjectId
    if (category && !mongoose.Types.ObjectId.isValid(category)) {
      const found = await Category.findOne({ name: category.trim() });
      if (found) category = found._id.toString();
    }

    // Validation
    if (!name || !price || !category || !description) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    if (isNaN(price) || price < 0) {
      return NextResponse.json({ message: 'Price must be valid' }, { status: 400 });
    }

    // Auto-generate slug if not provided
    if (!slug) slug = generateSlug(name);

    const exists = await Product.findOne({ slug });
    if (exists) return NextResponse.json({ message: 'Slug already exists' }, { status: 409 });
    // Handle multiple image uploads (safe/filtered)
    const files = body.getAll('images') || [];
    const uploadedImages = [];
    for (const file of files) {
      if (file && typeof file === 'object') {
        try {
          const buffer = file instanceof Buffer ? file : Buffer.from(await file.arrayBuffer());
          const res = await uploadImage(`data:${file.type};base64,${buffer.toString('base64')}`, 'products');
          uploadedImages.push(res.url);
        } catch (err) {
          console.error('Image upload failed for one of the images:', err);
        }
      }
    }
    // Remove any falsy entries
    const cleanImages = uploadedImages.filter(Boolean);

    // Handle single main image (optional)
    let mainImageUrl = null;
    const mainImageFile = body.get('image');
    if (mainImageFile && typeof mainImageFile === 'object') {
      try {
        const buffer = mainImageFile instanceof Buffer ? mainImageFile : Buffer.from(await mainImageFile.arrayBuffer());
        const res = await uploadImage(`data:${mainImageFile.type};base64,${buffer.toString('base64')}`, 'products');
        mainImageUrl = res.url;
      } catch (err) {
        console.error('Main image upload failed:', err);
      }
    }

    // Create product
    const product = await Product.create({
      name,
      price,
      category,
      slug,
      description,
      images: cleanImages,
      image: mainImageUrl || (cleanImages.length > 0 ? cleanImages[0] : null),
      colour,
      size,
      occasions,
      delivery,
      premium,
      seo_title,
      seo_description,
    });

    logResponse('/api/products', 'POST', { status: 201, result: product._id });
    return NextResponse.json({ success: true, product: { id: product._id.toString(), ...product.toObject() } }, { status: 201 });

  } catch (error) {
    console.error('Product create error:', error);
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
}

/**
 * GET /api/products
 * Paginated + filter by category/occasion
 */
export async function GET(request) {
  try {
    await connectDB();
    const url = new URL(request.url);

    const category = url.searchParams.get('category');
    const occasion = url.searchParams.get('occasion');
    const search = url.searchParams.get('search');
    const page = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get('limit') || '12', 10)));
    const skip = (page - 1) * limit;
    console.log("category", category);
    console.log("occasion", occasion);

    const query = {};
    if (category) {
      if (mongoose.Types.ObjectId.isValid(category)) {
        query.category = category;
      } else {
        // If not a valid ObjectId, try to find category by slug (or name)
        const catDoc = await Category.findOne({ slug: category });
        if (catDoc) {
          query.category = catDoc._id;
        } else {
          // If category not found by slug, return empty, or ignore filter?
          // Returning empty result seems correct if the filter is invalid
          return NextResponse.json({ success: true, data: [], pagination: { page, limit, total: 0, totalPages: 0 } }, { status: 200 });
        }
      }
    }
    if (occasion) query.occasions = { $in: [occasion] };
    if (search) query.name = { $regex: search, $options: 'i' };

    const total = await Product.countDocuments(query);
    const totalPages = Math.ceil(total / limit);
    const products = await Product.find(query).skip(skip).limit(limit).lean();

    return NextResponse.json({
      success: true,
      data: products.map(p => ({ id: p._id.toString(), ...p })),
      pagination: { page, limit, total, totalPages, hasNextPage: page < totalPages, hasPrevPage: page > 1 }
    }, { status: 200 });

  } catch (error) {
    console.error('Product GET error:', error);
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
}
