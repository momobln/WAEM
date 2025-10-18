import { NextResponse,  } from "next/server";
import prisma from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

// 🟢 عرض جميع المستخدمين (Admins فقط)
export async function GET() {
  const user = await requireUser();
  if (user.role !== "ADMIN") return ("/dashboard");

  const guards = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });
  return NextResponse.json(guards);
}

// 🟢 إضافة مستخدم جديد (Admins فقط)
export async function POST(req: Request) {
  const user = await requireUser();
  if (user.role !== "ADMIN") return ("/dashboard");

  const body = await req.json();
  const newGuard = await prisma.user.create({
    data: {
      name: body.name,
      email: body.email,
      role: "USER",
    },
  });

  return NextResponse.json(newGuard);
}
