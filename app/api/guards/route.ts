import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

// 🔵 Update user (self or Admin)
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const current = await requireUser();
  const data = await req.json();
  const { id } = await context.params;

  // لا يمكن لغير الأدمن تعديل غير نفسه
  if (current.role !== "ADMIN" && current.id !== id)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const updated = await prisma.user.update({
    where: { id },
    data: { name: data.name, phone: data.phone },
  });

  return NextResponse.json(updated);
}

// 🔴 Delete (Admins only)
export async function DELETE(
  _: Request,
  context: { params: Promise<{ id: string }> }
) {
  const current = await requireUser();
  if (current.role !== "ADMIN")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await context.params;
  await prisma.user.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}