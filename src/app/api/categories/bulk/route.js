import { NextResponse } from "next/server";
import { connectDB } from "@/lib/connectDB";
import Category from "@/models/Category";
/**
 * POST /api/categories/bulk
 * Body:
 * {
 *   "categories": [
 *     { "name": "Bouquets", "slug": "bouquets", "description": "..." },
 *     { "name": "Cakes", "slug": "cakes" }
 *   ]
 * }
 */
export async function POST(request) {
  try {
    await connectDB();
   const { error } = verifyAdmin(request);
           if (error) return error;
    const body = await request.json();
    const categories = Array.isArray(body.categories) ? body.categories : [];
 console.log("categories",categories);
 
    if (categories.length === 0) {
      return NextResponse.json(
        { success: false, message: "No categories provided" },
        { status: 400 }
      );
    }

    const docs = [];

    for (const c of categories) {
      const { name, slug, description } = c;

      if (!name || !slug) {
        return NextResponse.json(
          { success: false, message: "Each category must have name and slug" },
          { status: 400 }
        );
      }

      docs.push({
        name: name.trim(),
        slug: slug.trim().toLowerCase(),
        description: description || "",
        isActive: c.isActive ?? true,
      });
    }

    const created = await Category.insertMany(docs, { ordered: false });

    return NextResponse.json(
      {
        success: true,
        createdCount: created.length,
        categories: created.map((c) => ({
          id: c._id,
          name: c.name,
          slug: c.slug,
        })),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Bulk category add error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to add categories",
        error:
          process.env.NODE_ENV === "development"
            ? error.message
            : undefined,
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/categories/bulk
 * Body:
 * {
 *   "ids": ["id1", "id2"]
 * }
 */
export async function DELETE(request) {
  try {
    await connectDB();

    const body = await request.json();
    const ids = Array.isArray(body.ids) ? body.ids : [];

    if (ids.length === 0) {
      return NextResponse.json(
        { success: false, message: "No category IDs provided" },
        { status: 400 }
      );
    }

    const result = await Category.deleteMany({ _id: { $in: ids } });

    return NextResponse.json(
      {
        success: true,
        deletedCount: result.deletedCount,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Bulk category delete error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Bulk delete failed",
        error:
          process.env.NODE_ENV === "development"
            ? error.message
            : undefined,
      },
      { status: 500 }
    );
  }
}
