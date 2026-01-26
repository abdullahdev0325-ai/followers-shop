import { NextResponse } from "next/server";
import { connectDB } from "@/lib/connectDB";
import CartItem from "@/models/CartItem";
import Product from "@/models/Product";
import { requireAuth } from "@/lib/middleware/auth";

export async function POST(request) {
  try {
    await connectDB();

    // ✅ Auth user
    const user = await requireAuth(request);

    // ✅ Stripe key check
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey) {
      return NextResponse.json(
        { success: false, message: "Stripe not configured" },
        { status: 500 }
      );
    }

    // ✅ Stripe init
    const stripe = (await import("stripe")).default(stripeSecretKey);

    // ✅ Base URL
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    // ✅ Get frontend payload
    const body = await request.json();

    const {
      billing,
      shipping,
      contactNumber,
    } = body;

    // ❌ Validation
    if (!billing || !shipping || !contactNumber) {
      return NextResponse.json(
        { success: false, message: "Missing checkout data" },
        { status: 400 }
      );
    }

    // ✅ Fetch cart from DB
    const cartItems = await CartItem.find({
      user_id: user.id,
    })
      .populate("product_id")
      .lean();

    if (!cartItems.length) {
      return NextResponse.json(
        { success: false, message: "Cart is empty" },
        { status: 400 }
      );
    }

    // ===============================
    // 🧮 PRICE CALCULATIONS
    // ===============================

    let subtotal = 0;

    const line_items = cartItems.map((item) => {
      const product = item.product_id;

      const price = Number(product.price);
      const quantity = Number(item.quantity);

      subtotal += price * quantity;

      return {
        price_data: {
          currency: "aed",
          product_data: {
            name: product.name,
            images: [
              product.image?.startsWith("http")
                ? product.image
                : `${baseUrl}${product.image || "/images/fallback.jpg"}`,
            ],
          },
          unit_amount: Math.round(price * 100), // AED → fils
        },
        quantity,
      };
    });

    // ✅ Shipping + VAT
    const shippingCost = subtotal > 100 ? 0 : 20;
    const taxCost = subtotal * 0.05;

    if (shippingCost > 0) {
      line_items.push({
        price_data: {
          currency: "aed",
          product_data: { name: "Shipping Cost" },
          unit_amount: Math.round(shippingCost * 100),
        },
        quantity: 1,
      });
    }

    if (taxCost > 0) {
      line_items.push({
        price_data: {
          currency: "aed",
          product_data: { name: "VAT (5%)" },
          unit_amount: Math.round(taxCost * 100),
        },
        quantity: 1,
      });
    }

    // ===============================
    // 💳 STRIPE SESSION
    // ===============================

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],

      line_items,

      billing_address_collection: "required",

      shipping_address_collection: {
        allowed_countries: ["AE"],
      },

      metadata: {
        userId: user.id,
        email: user.email,
        contactNumber,

        billing: JSON.stringify(billing),
        shipping: JSON.stringify(shipping),

        subtotal: subtotal.toFixed(2),
        tax: taxCost.toFixed(2),
        shippingCost: shippingCost.toFixed(2),
      },

      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/checkout/cancel`,
    });

    return NextResponse.json({
      success: true,
      url: session.url,
    });
  } catch (error) {
    console.error("Stripe Checkout Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Checkout failed",
        error:
          process.env.NODE_ENV === "development"
            ? error.message
            : undefined,
      },
      { status: 500 }
    );
  }
}
