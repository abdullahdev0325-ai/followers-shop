import { NextResponse } from "next/server";
import { connectDB } from "@/lib/connectDB";
import Blog from "@/models/Blog";
import { deleteImage, extractPublicId } from "@/lib/cloudinary";

export async function POST(req) {
  await connectDB();
  const { ids } = await req.json();

  if (!Array.isArray(ids) || ids.length === 0) {
    return NextResponse.json(
      { message: "IDs required" },
      { status: 400 }
    );
  }

  const blogs = await Blog.find({ _id: { $in: ids } });

  for (const blog of blogs) {
    if (blog.image) {
      const publicId = extractPublicId(blog.image);
      await deleteImage(publicId);
    }
  }

  await Blog.deleteMany({ _id: { $in: ids } });

  return NextResponse.json({ success: true });
}
