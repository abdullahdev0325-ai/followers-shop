import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',  // Reference to Category model
    },
    occasions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Occasion', // Reference to Occasion model
      },
    ],
    gender: {
      type: String,
      enum: ['her', 'him', 'both', 'female', 'male', 'unisex'],
    },
    colour: {
      type: String,
      trim: true,
    },
    size: {
      type: String,
      enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    },
    delivery: {
      type: String,
      enum: ['night-time', 'on-delivery', 'same-day', 'express'], // all delivery options
      default: 'on-delivery',
    },
    description: {
      type: String,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      // unique: true,
      trim: true,
    },
    seo_title: {
      type: String,
      trim: true,
    },
    seo_description: {
      type: String,
      trim: true,
    },
    premium: {
      type: Boolean,
      default: false,
    },
    badge: {
      type: String,
      enum: ['top-selling', 'new-arrival', 'featured'],
      default: null,
    },
    image: {
      type: String,
      trim: true,
    },
    images: {
      type: [String], // multiple images
      default: [],
    },
    stock: {
      type: Number,
      default: 0,
    },
    tags: {
      type: [String],
      default: [],
    },
    ratings: {
      type: Number,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Product || mongoose.model('Product', productSchema);
