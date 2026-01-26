import { NextResponse } from "next/server";
import { connectDB } from "@/lib/connectDB";
import Category from "@/models/Category";
import { generateSlug } from "@/lib/generateSlug";
/* =========================
   PUT /api/categories/:id
   Update category by ID
========================= */
export async function PUT(request, { params }) {
  try {
    await connectDB();
const { error } = verifyAdmin(request);
        if (error) return error;
    const { id } =await params;
    console.log("id",id);
    
    const { name, slug, is_active } = await request.json();

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Category ID required" },
        { status: 400 }
      );
    }

    const category = await Category.findById(id);
    if (!category) {
      return NextResponse.json(
        { success: false, message: "Category not found" },
        { status: 404 }
      );
    }

    // Handle slug auto-generation and uniqueness
    if (name || slug) {
      const newSlug = slug || generateSlug(name);

      const slugExists = await Category.findOne({
        slug: newSlug,
        _id: { $ne: id },
      });

      if (slugExists) {
        return NextResponse.json(
          { success: false, message: "Slug already exists" },
          { status: 409 }
        );
      }

      category.slug = newSlug;
    }

    if (name) category.name = name.trim();
    if (is_active !== undefined) category.is_active = is_active;

    await category.save();

    return NextResponse.json({
      success: true,
      message: "Category updated successfully",
      data: {
        id: category._id.toString(),
        name: category.name,
        slug: category.slug,
        is_active: category.is_active,
        created_at: category.createdAt,
        updated_at: category.updatedAt,
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
   DELETE /api/categories/:id
   Delete category by ID
========================= */
export async function DELETE(request, { params }) {
  try {
    await connectDB();
  const { error } = verifyAdmin(request);
          if (error) return error;
    const { id } = await params;
   console.log("id",id);
   
    if (!id) {
      return NextResponse.json(
        { success: false, message: "Category ID required" },
        { status: 400 }
      );
    }

    const category = await Category.findById(id);
    if (!category) {
      return NextResponse.json(
        { success: false, message: "Category not found" },
        { status: 404 }
      );
    }

    await Category.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Category deleted successfully",
      deletedId: id,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
