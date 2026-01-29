import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/connectDB';
import Product from '@/models/Product';
import Category from '@/models/Category';
import Occasion from '@/models/Occasion';
import { logRequest, logResponse } from '@/lib/apiLogger';
import { uploadImage, uploadMultipleImages } from '@/components/cloudinary/ImageUploader';
import { generateSlug } from '@/lib/generateSlug';
import { verifyAdmin } from '@/lib/auth';

/**
 * POST /api/products
 * Create a single product with multiple images and auto-generated slug
 */
export async function POST(request) {
  try {
    await connectDB();
      const { error } = verifyAdmin(request);
        if (error) return error;
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
 * Paginated + filter by category/occasion/color/size with facets
 */
export async function GET(request) {
  try {
    await connectDB();

    const url = new URL(request.url);

    let category = url.searchParams.get('category');
    const occasion = url.searchParams.get('occasion');
    const color = url.searchParams.get('color');
    const size = url.searchParams.get('size');
    const search = url.searchParams.get('search');
    const minPriceParam = url.searchParams.get('minPrice');
    const maxPriceParam = url.searchParams.get('maxPrice');
    const sort = url.searchParams.get('sort') || 'recommended';

    const page = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10));
    const limit = Math.min(1000, parseInt(url.searchParams.get('limit') || '12', 10));
    const skip = (page - 1) * limit;

    const query = {};

    // Category - resolve by slug or id
    if (category) {
      // اگر category ObjectId ہے تو directly استعمال کریں
      if (mongoose.Types.ObjectId.isValid(category)) {
        query.category = category;
      } else {
        // اگر slug ہے تو category find کر کے id دیں
        const categoryDoc = await Category.findOne({ slug: category }).select('_id');
        if (categoryDoc) {
          query.category = categoryDoc._id;
        }
      }
    }

    // Occasion - resolve by slug or id
    if (occasion) {
      if (mongoose.Types.ObjectId.isValid(occasion)) {
        query.occasions = occasion;
      } else {
        // اگر slug ہے تو occasion find کر کے id دیں
        const occasionDoc = await Occasion.findOne({ slug: occasion }).select('_id');
        if (occasionDoc) {
          query.occasions = occasionDoc._id;
        }
      }
    }

    // Color
    if (color) query.colour = color;

    // Size
    if (size) query.size = size;

    // Search
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Price - only if params provided
    if (minPriceParam !== null || maxPriceParam !== null) {
      const minPrice = Number(minPriceParam || 0);
      const maxPrice = Number(maxPriceParam || 100000);
      query.price = { $gte: minPrice, $lte: maxPrice };
    }

    // Sorting
    let sortQuery = {};
    if (sort === 'lowToHigh') sortQuery.price = 1;
    if (sort === 'highToLow') sortQuery.price = -1;
    if (sort === 'AtoZ') sortQuery.name = 1;
    if (sort === 'ZtoA') sortQuery.name = -1;

    // Get facets from all products (ignoring current filters for facet counts)
    const allProducts = await Product.find(query).lean();

    // Calculate facets
    const facets = {
      categories: {},
      occasions: {},
      colors: {},
      sizes: {},
    };

    allProducts.forEach(product => {
      // Categories
      if (product.category) {
        facets.categories[product.category] = (facets.categories[product.category] || 0) + 1;
      }

      // Occasions
      if (Array.isArray(product.occasions)) {
        product.occasions.forEach(occ => {
          facets.occasions[occ] = (facets.occasions[occ] || 0) + 1;
        });
      }

      // Colors
      if (product.colour) {
        facets.colors[product.colour] = (facets.colors[product.colour] || 0) + 1;
      }

      // Sizes
      if (Array.isArray(product.size)) {
        product.size.forEach(s => {
          facets.sizes[s] = (facets.sizes[s] || 0) + 1;
        });
      } else if (product.size) {
        facets.sizes[product.size] = (facets.sizes[product.size] || 0) + 1;
      }
    });

    const total = allProducts.length;
    const products = await Product.find(query)
      .sort(sortQuery)
      .skip(skip)
      .limit(limit)
      .lean();

    return NextResponse.json({
      success: true,
      data: products,
      facets: facets,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('❌ GET /api/products Error:', error);
    console.error('Error Stack:', error.stack);
    return NextResponse.json({ 
      success: false, 
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}

