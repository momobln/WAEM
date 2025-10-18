import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

// 🟢 GET: جميع المستخدمين (Admins فقط)
export async function GET() {
  const user = await requireUser();

  if (user.role !== "ADMIN")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const guards = await prisma.user.findMany({
    select: { id: true, name: true, email: true, phone: true, role: true },
  });

  return NextResponse.json(guards);
}

// 🟡 POST: إنشاء مستخدم جديد (Admin فقط)
export async function POST(req: Request) {
  const user = await requireUser();
  if (user.role !== "ADMIN")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const data = await req.json();

  const guard = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone ?? null,
      role: data.role ?? "USER",
    },
  });

  return NextResponse.json(guard);
}
