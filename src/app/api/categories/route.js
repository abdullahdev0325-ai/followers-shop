import { NextResponse } from "next/server";
import { connectDB } from "@/lib/connectDB";
import Category from "@/models/Category";
import { generateSlug } from "@/lib/generateSlug";

/* =========================
   GET /api/categories
   Pagination + Search + Status
========================= */
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const is_active = searchParams.get("is_active");
    const page = Math.max(1, Number(searchParams.get("page") || 1));
    const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit") || 12)));
    const skip = (page - 1) * limit;

    const query = {};
    if (search) query.name = { $regex: search, $options: "i" };
    if (is_active !== null) query.is_active = is_active === "true";

    const total = await Category.countDocuments(query);
    const categories = await Category.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return NextResponse.json({
      success: true,
      data: {
        categories: categories.map((c) => ({
          id: c._id.toString(),
          name: c.name,
          slug: c.slug,
          is_active: c.is_active,
          created_at: c.createdAt,
          updated_at: c.updatedAt,
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
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

/* =========================
   POST /api/categories
   Create category
========================= */
export async function POST(request) {
  try {
    await connectDB();
    const { error } = verifyAdmin(request);
            if (error) return error;
    const { name, slug, is_active = true } = await request.json();

    if (!name) {
      return NextResponse.json(
        { success: false, message: "Name is required" },
        { status: 400 }
      );
    }

    const finalSlug = slug || generateSlug(name);

    const exists = await Category.findOne({ slug: finalSlug });
    if (exists) {
      return NextResponse.json(
        { success: false, message: "Slug already exists" },
        { status: 409 }
      );
    }

    const category = await Category.create({
      name: name.trim(),
      slug: finalSlug,
      is_active,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Category created successfully",
        data: { id: category._id.toString() },
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
