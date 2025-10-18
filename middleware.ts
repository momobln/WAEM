import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const ADMIN_EMAIL = "kashshaazam@gmail.com"; // ضع هنا إيميل الأدمن الحقيقي

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // 🔴 المستخدم غير مسجّل دخول
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // 🟡 مستخدم عادي يدخل إلى صفحة الحراس => يُعاد إلى Dashboard
  if (pathname.startsWith("/guards") && token.email !== ADMIN_EMAIL) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // 🟡 المستخدم يحاول الوصول إلى لوحة الإدارة أو API محظور
  if (pathname.startsWith("/api/guards") && token.email !== ADMIN_EMAIL) {
    return new NextResponse(
      JSON.stringify({ error: "Access denied: Admin only." }),
      { status: 403, headers: { "Content-Type": "application/json" } }
    );
  }

  // 🟢 كل شيء آخر مسموح
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard",
    "/guards/:path*",
    "/api/guards/:path*",
    "/api/shifts/:path*",
  ],
};
