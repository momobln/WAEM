import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

// 🟢 عرض جميع الشفتات
export async function GET() {
  const shifts = await prisma.shift.findMany({
    include: { owner: true },
    orderBy: { start: "asc" },
  });
  return NextResponse.json(shifts);
}

// 🟢 إضافة شفت جديد
export async function POST(req: Request) {
  const user = await requireUser();
  const data = await req.json();

  // المستخدم العادي يمكنه فقط إضافة شفت لنفسه
  if (user.role !== "ADMIN" && data.ownerId && data.ownerId !== user.id) {
    return ("/dashboard");
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
