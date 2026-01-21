import { NextResponse } from 'next/server';
import {connectDB} from '@/lib/connectDB';
import WishlistItem from '@/models/WishlistItem';
import Product from '@/models/Product';
import { requireAuth } from '@/lib/middleware/auth';

export async function GET(request) {
  try {
    await connectDB();
    const user = await requireAuth(request);

    // Fetch wishlist items for the user and populate product details
    const items = await WishlistItem.find({ user_id: user.id }).populate('product_id');

    const products = items.map((it) => {
      const p = it.product_id;
      return {
        id: p._id.toString(),
        name: p.name,
        price: p.price,
        slug: p.slug,
        image: p.image,
        // include other useful fields if needed
      };
    });

    return NextResponse.json({ success: true, data: { items: products } });
  } catch (err) {
    console.error('Wishlist GET error:', err);
    if (err && err.message === 'Unauthorized') {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    await connectDB();
    const user = await requireAuth(request);

    const url = new URL(request.url);
    const wishlistItemId = url.searchParams.get('wishlistItemId');
    const productId = url.searchParams.get('productId');

    if (!wishlistItemId && !productId) {
      return NextResponse.json({ success: false, message: 'wishlistItemId or productId is required' }, { status: 400 });
    }

    let deleted = null;
    if (wishlistItemId) {
      deleted = await WishlistItem.findOneAndDelete({ _id: wishlistItemId, user_id: user.id });
    } else {
      deleted = await WishlistItem.findOneAndDelete({ product_id: productId, user_id: user.id });
    }

    if (!deleted) {
      return NextResponse.json({ success: false, message: 'Item not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Item removed from wishlist', data: { wishlistItemId: deleted._id, productId: deleted.product_id } });
  } catch (err) {
    console.error('Wishlist DELETE error:', err);
    if (err && err.message === 'Unauthorized') {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();

    let user;
    try {
      user = await requireAuth(request);
    } catch (err) {
      user = null; // User not logged in, handle in frontend with localStorage
    }

    const body = await request.json();
    const { productId } = body;

    if (!productId) {
      return NextResponse.json({ success: false, message: 'Product ID is required' }, { status: 400 });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
    }

    if (user) {
      // Check if already in wishlist
      const existingItem = await WishlistItem.findOne({ user_id: user.id, product_id: productId });
      if (existingItem) {
        // Remove from wishlist
        await WishlistItem.findByIdAndDelete(existingItem._id);
        return NextResponse.json({
          success: true,
          message: 'Item removed from wishlist',
          data: { productId },
        });
      } else {
        // Add to wishlist
        await WishlistItem.create({ user_id: user.id, product_id: productId });
        return NextResponse.json({
          success: true,
          message: 'Item added to wishlist',
          data: { productId },
        });
      }
    }

    // If user not logged in, frontend handles wishlist in localStorage
    return NextResponse.json({
      success: true,
      message: 'User not logged in: handle wishlist in localStorage',
      data: { productId },
    });
  } catch (err) {
    console.error('Wishlist error:', err);
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: process.env.NODE_ENV === 'development' ? err.message : undefined },
      { status: 500 }
    );
  }
}
