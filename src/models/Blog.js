import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true },

    image: { type: String, default: null },

    seo_title: { type: String },
    seo_description: { type: String },

    tags: [{ type: String }],
    status: { type: String, default: "published" },
    author:{type:String,default:"Aoroma Flowers"
    }
  },
  { timestamps: true }
);

export default mongoose.models.Blog || mongoose.model("Blog", BlogSchema);
