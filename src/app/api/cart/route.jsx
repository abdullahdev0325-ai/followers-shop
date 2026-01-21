import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/connectDB';
import CartItem from '@/models/CartItem';
import Product from '@/models/Product';
import { requireAuth } from '@/lib/middleware/auth';

export async function GET(request) {
  try {
    await connectDB();
    const user = await requireAuth(request);

    const items = await CartItem.find({ user_id: user.id }).populate('product_id');

    const cart = items.map((ci) => {
      const p = ci.product_id;
      return {
        id: ci._id.toString(),
        product: {
          id: p._id.toString(),
          name: p.name,
          price: p.price,
          slug: p.slug,
          image: p.image,
        },
        quantity: ci.quantity,
      };
    });

    return NextResponse.json({ success: true, data: { items: cart } });
  } catch (err) {
    console.error('Cart GET error:', err);
    if (err && err.message === 'Unauthorized') {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
