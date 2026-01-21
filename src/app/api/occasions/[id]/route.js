import { NextResponse } from "next/server";
import { connectDB } from "@/lib/connectDB";
import Occasion from "@/models/Occasion";
import { generateSlug } from "@/lib/generateSlug";
import { uploadImage, getPublicIdFromUrl, deleteImage } from "@/components/cloudinary/ImageUploader";

export async function PUT(request, { params }) {
  try {
    await connectDB();

    const {id} = await params;
    console.log("id",id);
    
    if (!id) {
      return NextResponse.json({ success: false, message: "Occasion ID required" }, { status: 400 });
    }

    const occasion = await Occasion.findById(id);
    if (!occasion) {
      return NextResponse.json({ success: false, message: "Occasion not found" }, { status: 404 });
    }

    const formData = await request.formData();
    const name = formData.get("name");
    const slug = formData.get("slug");
    const is_active = formData.get("is_active");
    const file = formData.get("image"); // single image

    // Handle slug
    const finalSlug = slug || (name ? generateSlug(name) : occasion.slug);
    if (finalSlug !== occasion.slug) {
      const slugExists = await Occasion.findOne({ slug: finalSlug, _id: { $ne: id } });
      if (slugExists) {
        return NextResponse.json({ success: false, message: "Slug already exists" }, { status: 409 });
      }
    }

    // Update fields
    if (name) occasion.name = name.trim();
    occasion.slug = finalSlug;
    if (is_active !== null) occasion.is_active = is_active === "true";

    // Handle image
    if (file && typeof file === "object") {
      // Delete previous image if exists
      if (occasion.images) {
        const publicId = getPublicIdFromUrl(occasion.images);
        if (publicId) await deleteImage(publicId);
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const uploadRes = await uploadImage(
        `data:${file.type};base64,${buffer.toString("base64")}`,
        "occasions"
      );

      occasion.images = uploadRes.url; // single image as string
    }

    await occasion.save();

    return NextResponse.json({ success: true, message: "Occasion updated successfully" });
  } catch (error) {
    console.error("PUT /occasions error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();

    const { id } = await params;
    console.log("id", id);

    const { searchParams } = new URL(request.url);
    const idsQuery = searchParams.get("ids");

    let idsToDelete = [];
    if (idsQuery) {
      idsToDelete = idsQuery.split(",").map(i => i.trim()).filter(Boolean);
    } else if (id) {
      idsToDelete = [id];
    }

    if (idsToDelete.length === 0) {
      return NextResponse.json({ success: false, message: "No valid IDs provided" }, { status: 400 });
    }

    const occasions = await Occasion.find({ _id: { $in: idsToDelete } });

    // Delete associated images
    for (const occ of occasions) {
      if (occ.images) {
        const publicId = getPublicIdFromUrl(occ.images);
        if (publicId) await deleteImage(publicId);
      }
    }

    const result = await Occasion.deleteMany({ _id: { $in: idsToDelete } });

    return NextResponse.json({
      success: true,
      message: `${result.deletedCount} occasion(s) deleted successfully`,
      deletedIds: idsToDelete,
    });
  } catch (error) {
    console.error("DELETE /occasions error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
