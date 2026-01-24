import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export function getToken(req) {
  // console.log("res cookies",req.cookies.get("token")?.value);
  // console.log("toke header",    req.headers.get("authorization")?.split(" ")[1]
// )
  return (
    req.cookies.get("token")?.value ||
    req.headers.get("authorization")?.split(" ")[1]
  );
}

// ✅ normal user verify
export function verifyUser(req) {
  const token = getToken(req);

  if (!token) {
    return {
      error: NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      ),
    };
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("decoded",decoded);
    
    return { user: decoded };
  } catch {
    return {
      error: NextResponse.json(
        { message: "Invalid token" },
        { status: 401 }
      ),
    };
  }
}

// ✅ admin verify
export function verifyAdmin(req) {
  const token = getToken(req);
//  console.log("token",token);
 
  if (!token) {
    return {
      error: NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      ),
    };
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("decoded",decoded);
    
    if (decoded.role !== "admin") {
      return {
        error: NextResponse.json(
          { message: "Admin access only" },
          { status: 403 }
        ),
      };
    }

    return { admin: decoded };
  } catch {
    return {
      error: NextResponse.json(
        { message: "Invalid token" },
        { status: 401 }
      ),
    };
  }
}
