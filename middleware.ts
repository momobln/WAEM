import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

type SessionResponse = {
  user?: {
    email?: string | null;
    role?: string | null;
  } | null;
};

async function getSession(req: NextRequest): Promise<SessionResponse | null> {
  const cookieHeader = req.headers.get("cookie");

  if (!cookieHeader) {
    return null;
  }

  const response = await fetch(new URL("/api/auth/session", req.nextUrl.origin), {
    headers: {
      cookie: cookieHeader,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    return null;
  }

  const session = (await response.json()) as SessionResponse | null;

  if (!session || !session.user) {
    return null;
  }

  return session;
}

const ADMIN_EMAIL = "kashshaazam@gmail.com"; // ضع هنا إيميل الأدمن الحقيقي

export async function middleware(req: NextRequest) {

  const session = await getSession(req);
  const { pathname } = req.nextUrl;

  // 🔴 المستخدم غير مسجّل دخول

  if (!session?.user) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // 🟡 مستخدم عادي يدخل إلى صفحة الحراس => يُعاد إلى Dashboard

  if (pathname.startsWith("/guards") && session.user?.email !== ADMIN_EMAIL) {

    return NextResponse.redirect(new URL("/", req.url));
  }

  // 🟡 المستخدم يحاول الوصول إلى لوحة الإدارة أو API محظور    
  if (pathname.startsWith("/api/guards") && session.user?.email !== ADMIN_EMAIL) {


    return NextResponse.json({ redirect: "/" });
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