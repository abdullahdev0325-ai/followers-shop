import { NextResponse } from 'next/server';
import stripePackage from 'stripe';
import {connectDB} from '@/lib/connectDB';
import CartItem from '@/models/CartItem';
import Product from '@/models/Product';
import { requireAuth } from '@/lib/middleware/auth';

const stripe = new stripePackage(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    await connectDB();

    const user = await requireAuth(request);
    const body = await request.json();
    const { billingAddress, shippingAddress } = body;

    // Get cart items for user
    const cartItems = await CartItem.find({ user_id: user.id }).populate('product_id').lean();
    if (!cartItems.length) {
      return NextResponse.json({ success: false, message: 'Cart is empty' }, { status: 400 });
    }

    // Calculate total for Dubai (AED)
    const line_items = cartItems.map((item) => {
      const product = item.product_id;
      return {
        price_data: {
          currency: 'aed',
          product_data: {
            name: product.name,
            images: [product.image || '/images/fallback.jpg'],
          },
          unit_amount: Math.round(product.price * 100), // AED to fils
        },
        quantity: item.quantity,
      };
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items,
      billing_address_collection: 'required',
      shipping_address_collection: {
        allowed_countries: ['AE'],
      },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/cancel`,
    });

    return NextResponse.json({ success: true, url: session.url });
  } catch (err) {
    console.error('Stripe Checkout Error:', err);
    return NextResponse.json(
      { success: false, message: 'Checkout failed', error: process.env.NODE_ENV === 'development' ? err.message : undefined },
      { status: 500 }
    );
  }
}
