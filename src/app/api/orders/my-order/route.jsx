import { NextResponse } from 'next/server';
import {connectDB} from '@/lib/connectDB';
import Order from '@/models/Order';
import { requireAuth } from '@/lib/middleware/auth';

export async function GET(request) {
  try {
    await connectDB();

    const user = await requireAuth(request); // user info from token
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));
    const skip = (page - 1) * limit;

    const total = await Order.countDocuments({ user_id: user.id });
    const orders = await Order.find({ user_id: user.id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return NextResponse.json({
      success: true,
      data: {
        orders,
        pagination: {
          currentPage: page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNextPage: page * limit < total,
          hasPreviousPage: page > 1,
        },
      },
    });
  } catch (error) {
    console.error('Get my orders error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: process.env.NODE_ENV === 'development' ? error.message : undefined },
      { status: 500 }
    );
  }
}
