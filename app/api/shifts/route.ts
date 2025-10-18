import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { redirectToDashboard, requireUser } from "@/lib/auth";

// 🟢 عرض جميع الشفتات
export async function GET(request: NextRequest) {
  const result = await requireUser(request);
  if ("redirect" in result) return result.redirect;

  const { user } = result;
  if (!user) return redirectToDashboard(request);

  const shifts = await prisma.shift.findMany({
    where: user.role === "ADMIN" ? {} : { ownerId: user.id },
    include: {
      owner: {
        select: { id: true, name: true, email: true, role: true },
      },
    },
    orderBy: { start: "asc" },
  });

  return NextResponse.json(shifts);
}

// 🟢 إضافة شفت جديد
export async function POST(request: NextRequest) {
  const result = await requireUser(request);
  if ("redirect" in result) return result.redirect;

  const { user } = result;
  if (!user) return redirectToDashboard(request);

  const data = await request.json();

  // المستخدم العادي يمكنه فقط إضافة شفت لنفسه
  if (user.role !== "ADMIN" && data.ownerId && data.ownerId !== user.id) {
     return redirectToDashboard(request);
  }

  const created = await prisma.shift.create({
    data: {
      title: data.title,
      location: data.location,
      start: new Date(data.start),
      end: new Date(data.end),
      ownerId: user.role === "ADMIN" ? data.ownerId || user.id : user.id,
    },
  });

  return NextResponse.json(created);
}
