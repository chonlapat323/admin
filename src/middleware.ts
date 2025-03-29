import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  console.log("🌐 Path:", request.nextUrl.pathname);
  console.log("🍪 Token:", token);

  if (!token) {
    console.log("⛔ ไม่มี token → redirect");
    //return NextResponse.redirect(new URL('/signin', request.url));
    return NextResponse.next(); // ❗ เปลี่ยนจาก redirect → เป็นปล่อยผ่าน
  }

  try {
    await jwtVerify(token, JWT_SECRET);
    console.log("✅ Token valid → ปล่อยผ่าน");
    return NextResponse.next();
  } catch (err) {
    console.warn("⚠️ Token หมดอายุ → ปล่อยผ่านให้ frontend refresh error: "+err);
    return NextResponse.next();
  }
}

export const config = {
  matcher: ['/', '/users/:path*', '/admin/:path*'],
};
