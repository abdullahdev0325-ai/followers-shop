import mongoose from 'mongoose';

const wishlistItemSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure one wishlist item per user-product combination
wishlistItemSchema.index({ user_id: 1, product_id: 1 }, { unique: true });

export default mongoose.models.WishlistItem || mongoose.model('WishlistItem', wishlistItemSchema);





