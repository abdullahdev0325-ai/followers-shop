import { NextResponse } from "next/server";
import { connectDB } from "@/lib/connectDB";
import Occasion from "@/models/Occasion";

export async function POST(req) {
  try {
    await connectDB();
const { error } = verifyAdmin(request);
        if (error) return error;
    const body = await req.json();
    const occasions = Array.isArray(body.occasions) ? body.occasions : [];

    if (occasions.length === 0) {
      return NextResponse.json(
        { message: "No occasions provided" },
        { status: 400 }
      );
    }

    const docs = occasions.map((o) => {
      if (!o.name || !o.slug) {
        throw new Error("Each occasion must have name and slug");
      }

      return {
        name: o.name.trim(),
        slug: o.slug.trim(),
        images: o.images || "",
        is_active: o.is_active ?? true,
      };
    });

    const created = await Occasion.insertMany(docs, { ordered: false });

    return NextResponse.json(
      {
        success: true,
        count: created.length,
        occasions: created,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Bulk occasion add error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to add occasions",
      },
      { status: 500 }
    );
  }
}
