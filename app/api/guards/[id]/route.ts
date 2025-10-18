import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

// 🔵 Update user (self or Admin)
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const current = await requireUser();
  const data = await req.json();

  // لا يمكن لغير الأدمن تعديل غير نفسه
  if (current.role !== "ADMIN" && current.id !== params.id)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const updated = await prisma.user.update({
    where: { id: params.id },
    data: { name: data.name, phone: data.phone },
  });

  return NextResponse.json(updated);
}

// 🔴 Delete (Admins only)
export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const current = await requireUser();
  if (current.role !== "ADMIN")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await prisma.user.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
