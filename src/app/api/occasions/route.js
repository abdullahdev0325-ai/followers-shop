import { NextResponse } from "next/server";
import { connectDB } from "@/lib/connectDB";
import Occasion from "@/models/Occasion";
import { validateEntityData, generateSlug } from "@/lib/generateSlug";
import { uploadImage } from "@/components/cloudinary/ImageUploader";
import { verifyAdmin } from '@/lib/auth';

/* =========================
   CREATE OCCASION
========================= */
export async function POST(request) {
  try {
    await connectDB();
const { error } = verifyAdmin(request);
        if (error) return error;
    const formData = await request.formData();
    const name = formData.get("name");
    const slug = formData.get("slug");
    const is_active = formData.get("is_active") !== "false";
    const file = formData.get("image");

    const finalSlug = slug || generateSlug(name);

    // Validate
    const validation = validateEntityData({
      name,
      slug: finalSlug,
      is_active,
    });

    if (!validation.valid) {
      return NextResponse.json(
        { success: false, errors: validation.errors },
        { status: 400 }
      );
    }

    // Check slug uniqueness
    const exists = await Occasion.findOne({ slug: finalSlug });
    if (exists) {
      return NextResponse.json(
        { success: false, message: "Slug already exists" },
        { status: 409 }
      );
    }

    // Image upload
    let image = "";
    if (file && typeof file === "object") {
      const buffer = Buffer.from(await file.arrayBuffer());
      const uploadRes = await uploadImage(
        `data:${file.type};base64,${buffer.toString("base64")}`,
        "occasions"
      );
      image = uploadRes.url;
    }

    const occasion = await Occasion.create({
      name: name.trim(),
      slug: finalSlug,
      is_active,
      images: image, // single image string
    });

    return NextResponse.json(
      {
        success: true,
        message: "Occasion created",
        data: { id: occasion._id.toString() },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

/* =========================
   GET OCCASIONS
========================= */
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const isActive = searchParams.get("is_active");
    const page = Math.max(1, Number(searchParams.get("page") || 1));
const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit") || 12)));
    const skip = (page - 1) * limit;

    const query = {};
    if (search) query.name = { $regex: search, $options: "i" };
    if (isActive !== null) query.is_active = isActive === "true";

    const total = await Occasion.countDocuments(query);
    const occasions = await Occasion.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return NextResponse.json({
      success: true,
      data: {
        occasions: occasions.map((o) => ({
          id: o._id.toString(),
          name: o.name,
          slug: o.slug,
          is_active: o.is_active,
          image: o.images || "", // single image
          created_at: o.createdAt,
          updated_at: o.updatedAt,
        })),
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNextPage: page * limit < total,
          hasPreviousPage: page > 1,
        },
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
