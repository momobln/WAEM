import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { redirectToDashboard, requireUser } from "@/lib/auth";

// 🟢 عرض جميع المستخدمين (Admins فقط)
export async function GET(request: NextRequest) {
  const result = await requireUser(request);
  if ("redirect" in result) return result.redirect;

  const { user } = result;
  if (!user || user.role !== "ADMIN") return redirectToDashboard(request);

  const guards = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });
  return NextResponse.json(guards);
}

// 🟢 إضافة مستخدم جديد (Admins فقط)
export async function POST(request: NextRequest) {
  const result = await requireUser(request);
  if ("redirect" in result) return result.redirect;

  const { user } = result;
  if (!user || user.role !== "ADMIN") return redirectToDashboard(request);

  const body = await request.json();
  const newGuard = await prisma.user.create({
    data: {
      name: body.name,
      email: body.email,
      phone: body.phone,
      role: "USER",
    },
  });

  return NextResponse.json(newGuard);
}
