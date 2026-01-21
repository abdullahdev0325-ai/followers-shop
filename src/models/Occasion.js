import mongoose from 'mongoose';

const occasionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
      images: {
      type: String,
      default: ""
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Occasion || mongoose.model('Occasion', occasionSchema);





