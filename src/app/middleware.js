import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/auth";

export function middleware(req) {
  const pathname = req.nextUrl.pathname;
  const method = req.method;

  // 🔓 public GET allowed
  console.log("method",method);
  
  if (method === "GET") {
    return NextResponse.next();
  }

  // 🔒 admin protection
  const adminRoutes =
    pathname.startsWith("/api/product") ||
    pathname.startsWith("/api/product/") ||
    pathname.startsWith("/api/product/bulk");

  if (adminRoutes) {
    const { error } = verifyAdmin(req);
    if (error) return error;
  }

  return NextResponse.next();
}
