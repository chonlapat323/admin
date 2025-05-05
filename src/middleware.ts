import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const token = request.cookies.get("admin_token")?.value;

  console.log("🌐 Path:", pathname);
  console.log("🍪 Token:", token);

  // ❌ ถ้าไม่มี token → redirect ไป /signin
  if (!token) {
    console.log("⛔ ไม่มี token → redirect");
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  // ✅ มี token → verify
  try {
    await jwtVerify(token, JWT_SECRET);
    console.log("✅ Token valid → ปล่อยผ่าน");
    return NextResponse.next();
  } catch (err) {
    console.warn("⚠️ Token ไม่ valid → redirect", err);
    return NextResponse.redirect(new URL("/signin", request.url));
  }
}

export const config = {
  matcher: ["/", "/categories/:path*", "/slides/:path*", "/users/:path*", "/admin/:path*"],
};
