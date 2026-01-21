// models/DeliveryTime.js
import mongoose from 'mongoose';

const DeliveryTimeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    is_active: { type: Boolean, default: true },
    images: { type: [String], default: [] },
  },
  { timestamps: true }
);

export default mongoose.models.DeliveryTime ||
  mongoose.model('DeliveryTime', DeliveryTimeSchema);
