import { NextResponse } from "next/server";
import { connectDB } from "@/lib/connectDB";
import Blog from "@/models/Blog";
import { uploadImage } from "@/components/cloudinary/ImageUploader";

export async function GET() {
  await connectDB();
  const blogs = await Blog.find().sort({ createdAt: -1 }).lean();
  // console.log("blog",blogs);
  
 
  return NextResponse.json({ success: true, blogs });
}



export async function POST(req) {
  await connectDB();
const { error } = verifyAdmin(request);
        if (error) return error;
  const formData = await req.formData();

  const title = formData.get("title");
  const slug = formData.get("slug");
  const content = formData.get("content");
  const author = formData.get("author");
  const seo_title = formData.get("seo_title");
  const seo_description = formData.get("seo_description");
  const file = formData.get("image"); // 👈 image yahan aayegi
//  console.log("author",author);
 
  if (!title || !slug || !content) {
    return NextResponse.json(
      { message: "title, slug, content are required" },
      { status: 400 }
    );
  }

  const exists = await Blog.findOne({ slug });
  if (exists) {
    return NextResponse.json(
      { message: "Slug already exists" },
      { status: 409 }
    );
  }

  let image = "";

  // ✅ Upload image to Cloudinary
  if (file && typeof file === "object") {
    const buffer = Buffer.from(await file.arrayBuffer());

    const uploadRes = await uploadImage(
      `data:${file.type};base64,${buffer.toString("base64")}`,
      "blogs"
    );

    image = uploadRes.url;
  }

  const blog = await Blog.create({
    title,
    slug,
    content,
    image,
    seo_title,
    seo_description,
    author
  });

  return NextResponse.json(
    { success: true, blog },
    { status: 201 }
  );
}

