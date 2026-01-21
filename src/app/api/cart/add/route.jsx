import { NextResponse } from 'next/server';
import {connectDB} from '@/lib/connectDB';
import CartItem from '@/models/CartItem';
import Product from '@/models/Product';
import { requireAuth } from '@/lib/middleware/auth';

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
    const { productId, quantity = 1 } = body;

    if (!productId) {
      return NextResponse.json({ success: false, message: 'Product ID is required' }, { status: 400 });
    }

    // Check product exists
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
    }

    // If user is logged in, save to DB
    if (user) {
      const existingItem = await CartItem.findOne({ user_id: user.id, product_id: productId });
      if (existingItem) {
        existingItem.quantity += quantity;
        await existingItem.save();
      } else {
        await CartItem.create({ user_id: user.id, product_id: productId, quantity });
      }
    }

    // Response (frontend can handle localStorage if user not logged in)
    return NextResponse.json({
      success: true,
      message: 'Item added to cart',
      data: { productId, quantity },
    });
  } catch (err) {
    console.error('Add to cart error:', err);
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: process.env.NODE_ENV === 'development' ? err.message : undefined },
      { status: 500 }
    );
  }
}
