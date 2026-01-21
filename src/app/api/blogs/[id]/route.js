// app/api/blogs/[id]/route.js
import { NextResponse } from "next/server";
import Blog from "@/models/Blog";
import { connectDB } from "@/lib/connectDB";
import { deleteImage, getPublicIdFromUrl, uploadImage } from "@/components/cloudinary/ImageUploader";

// export const runtime = "node"; // important for Node APIs

// GET blog by ID
export async function GET(req, { params }) {
  const { id } = await params;
  console.log("id", params.id);

  await connectDB();

  const blog = await Blog.findById(id);
  if (!blog) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }
  console.log("blog",blog);
  
  return NextResponse.json({ success: true, blog });
}

// PUT blog by ID (with optional image upload)

export async function PUT(req, { params }) {
  const { id } = await params; // ✅ no await
  console.log("PUT id:", id);

  await connectDB();

  try {
    const formData = await req.formData();

    const fields = {
      title: formData.get("title"),
      slug: formData.get("slug"),
      content: formData.get("content"),
      tags: formData.get("tags"),
      status: formData.get("status"),
    };

    const blog = await Blog.findById(id);
    if (!blog) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }
    console.log("blog",blog);
    
    // ✅ Image handling
    const imageFile = formData.get("image");

    if (imageFile && typeof imageFile === "object" && imageFile.size > 0) {
      // delete old image
      if (blog.image) {
        const publicId = getPublicIdFromUrl(blog.image);
        await deleteImage(publicId);
      }
   console.log("dleted");
   
      // upload new image
      const buffer = Buffer.from(await imageFile.arrayBuffer());

      const uploadRes = await uploadImage(
        `data:${imageFile.type};base64,${buffer.toString("base64")}`,
        "blogs"
      );

      fields.image = uploadRes.url; // ✅ set image
    }
   console.log("updated ");
   
    const updatedBlog = await Blog.findByIdAndUpdate(id, fields, {
      new: true,
    });

    return NextResponse.json({ success: true, blog: updatedBlog });
  } catch (err) {
    console.error("PUT error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
// DELETE blog by ID
export async function DELETE(req, { params }) {
  const { id } = await params;
  console.log("params", params);
  
  await connectDB();

  const blog = await Blog.findById(id);
  if (!blog) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  // Delete image from Cloudinary
  if (blog.image) {
    const publicId = getPublicIdFromUrl(blog.image);
    await deleteImage(publicId);
  }

  await blog.deleteOne();
  return NextResponse.json({ success: true });
}
