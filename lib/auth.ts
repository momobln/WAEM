import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { User } from "@prisma/client";
import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/prisma";


type RequireUserResult = { user: User } | { redirect: NextResponse };

export function redirectToDashboard(request: NextRequest) {
  return NextResponse.redirect(new URL("/", request.url));
}

// إرجاع بيانات المستخدم الحالي من الجلسة أو إعادة التوجيه إلى الـ Dashboard
export async function requireUser(request: NextRequest): Promise<RequireUserResult> {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return { redirect: redirectToDashboard(request) };
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  
  
  if (!user) {
    return { redirect: redirectToDashboard(request) };
  }

  return { user };
}
