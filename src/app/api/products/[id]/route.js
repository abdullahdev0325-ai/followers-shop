

import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/connectDB';
import Product from '@/models/Product';
import { uploadImage, deleteImage, getPublicIdFromUrl } from '@/components/cloudinary/ImageUploader';
import { logRequest, logResponse } from '@/lib/apiLogger';

/**
 * PUT /api/products/:id
 * Update a single product
 */
export async function PUT(request, { params }) {
  try {
    await connectDB();
    const { id } =await params;
console.log("id",id);

    if (!id) {
      return NextResponse.json({ success: false, message: 'Product ID required' }, { status: 400 });
    }

    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
    }

    const formData = await request.formData();
    const {
      name,
      price,
      category,
      gender,
      colour,
      size,
      delivery,
      occasions,
      description,
      slug,
      seo_title,
      seo_description,
      premium,
      badge,
    } = Object.fromEntries(formData.entries());

    // Handle slug uniqueness
    const finalSlug = slug || (name ? slugGenerate(name) : product.slug);
    if (finalSlug !== product.slug) {
      const exists = await Product.findOne({ slug: finalSlug, _id: { $ne: id } });
      if (exists) {
        return NextResponse.json({ success: false, message: 'Slug already exists' }, { status: 409 });
      }
      product.slug = finalSlug;
    }

    // Update fields
    if (name) product.name = name;
    if (price) product.price = parseFloat(price);
    if (category) product.category = category;
    if (gender) product.gender = gender;
    if (colour) product.colour = colour;
    if (size) product.size = size;
    if (delivery) product.delivery = delivery;
    if (occasions) product.occasions = occasions;
    if (description) product.description = description;
    if (seo_title) product.seo_title = seo_title;
    if (seo_description) product.seo_description = seo_description;
    if (premium !== undefined) product.premium = premium === 'true';
    if (badge) product.badge = badge;

    // Handle image upload
    const files = formData.getAll('images'); // multiple images
    if (files.length > 0) {
      // Delete existing images from Cloudinary
      const oldImages = [];
      if (product.image) oldImages.push(product.image);
      if (Array.isArray(product.images)) oldImages.push(...product.images);

      for (const url of oldImages) {
        const publicId = getPublicIdFromUrl(url);
        if (publicId) await deleteImage(publicId);
      }

      // Upload new images
      const uploadedUrls = [];
      for (const file of files) {
        if (file && file.size > 0) {
          const buffer = Buffer.from(await file.arrayBuffer());
          const uploadRes = await uploadImage(`data:${file.type};base64,${buffer.toString('base64')}`, 'products');
          uploadedUrls.push(uploadRes.url);
        }
      }

      product.images = uploadedUrls;
      product.image = uploadedUrls[0] || null; // first image as main
    }

    await product.save();

    logResponse('/api/products/:id', 'PUT', { status: 200, result: { id: product._id.toString(), name: product.name } });
    return NextResponse.json({ success: true, message: 'Product updated', product: { id: product._id.toString(), ...product.toObject() } }, { status: 200 });

  } catch (error) {
    console.error('Product update error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: process.env.NODE_ENV === 'development' ? error.message : undefined },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/products/:id_or_slug
 * Delete a single product and its images
 */
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { id } =await params;

    if (!id) {
      return NextResponse.json({ success: false, message: 'Product ID or slug required' }, { status: 400 });
    }

    const product = await Product.findOne({ $or: [{ _id: id }, { slug: id }] });
    if (!product) {
      return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
    }

    // Collect all image URLs (single + multiple)
    const allImages = [];
    if (product.image) allImages.push(product.image);
    if (Array.isArray(product.images)) allImages.push(...product.images);

    // Delete images from Cloudinary
    for (const url of allImages) {
      const publicId = getPublicIdFromUrl(url);
      if (publicId) await deleteImage(publicId);
    }

    // Delete the product
    await Product.deleteOne({ _id: product._id });

    logResponse('/api/products/:id', 'DELETE', { status: 200, result: { id: product._id.toString() } });

    return NextResponse.json({ success: true, message: 'Product deleted' }, { status: 200 });
  } catch (error) {
    console.error('Product delete error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: process.env.NODE_ENV === 'development' ? error.message : undefined },
      { status: 500 }
    );
  }
}
