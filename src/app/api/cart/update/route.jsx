import { NextResponse } from 'next/server';
import {connectDB} from '@/lib/connectDB';
import CartItem from '@/models/CartItem';
import { requireAuth } from '@/lib/middleware/auth';

export async function POST(request) {
  try {
    await connectDB();
    const user = await requireAuth(request);
    const body = await request.json();
    const { cartItemId, action } = body;

    if (!cartItemId || !['increase', 'decrease', 'delete'].includes(action)) {
      return NextResponse.json(
        { success: false, message: 'cartItemId and valid action are required' },
        { status: 400 }
      );
    }

    const cartItem = await CartItem.findOne({ _id: cartItemId, user_id: user.id });

    if (!cartItem) {
      return NextResponse.json({ success: false, message: 'Cart item not found' }, { status: 404 });
    }

    if (action === 'increase') {
      cartItem.quantity += 1;
      await cartItem.save();
    } else if (action === 'decrease') {
      if (cartItem.quantity > 1) {
        cartItem.quantity -= 1;
        await cartItem.save();
      } else {
        return NextResponse.json({ success: false, message: 'Quantity cannot be less than 1' }, { status: 400 });
      }
    } else if (action === 'delete') {
      await cartItem.deleteOne();
    }

    return NextResponse.json({
      success: true,
      message: `Cart item ${action}d successfully`,
      data: { cartItemId, quantity: cartItem?.quantity || 0 },
    });
  } catch (err) {
    console.error('Cart update error:', err);
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: process.env.NODE_ENV === 'development' ? err.message : undefined },
      { status: 500 }
    );
  }
}
