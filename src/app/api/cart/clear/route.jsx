import { NextResponse } from 'next/server';
import {connectDB} from '@/lib/connectDB';
import CartItem from '@/models/CartItem';
import { requireAuth } from '@/lib/middleware/auth';

export async function POST(request) {
  try {
    await connectDB();
    const user = await requireAuth(request);

    const result = await CartItem.deleteMany({ user_id: user.id });
    return NextResponse.json({
      success: true,
      message: `${result.deletedCount} item(s) cleared from cart`,
    });
  } catch (err) {
    console.error('Clear Cart Error:', err);
    return NextResponse.json(
      { success: false, message: 'Failed to clear cart', error: process.env.NODE_ENV === 'development' ? err.message : undefined },
      { status: 500 }
    );
  }
}
