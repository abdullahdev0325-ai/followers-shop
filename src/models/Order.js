import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  image: String,
  slug: String,
});

const orderSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [orderItemSchema],
    total_amount: {
      type: Number,
      required: true,
      min: 0,
    },
    billing_address: {
      full_name: String,
      email: String,
      phone: String,
      address_line1: String,
      address_line2: String,
      city: String,
      state: String,
      postal_code: String,
      country: String,
    },
    shipping_address: {
      full_name: String,
      email: String,
      phone: String,
      address_line1: String,
      address_line2: String,
      city: String,
      state: String,
      postal_code: String,
      country: String,
    },
    payment_status: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
    order_status: {
      type: String,
      enum: ['pending', 'processing', 'delivered', 'cancelled'],
      default: 'pending',
    },
    payment_intent_id: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Order || mongoose.model('Order', orderSchema);





