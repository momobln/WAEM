import { NextResponse,  } from "next/server";
import prisma from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

// 🟢 تعديل شفت
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const user = await requireUser();
  const body = await req.json();
  const shift = await prisma.shift.findUnique({ where: { id: params.id } });

  if (!shift) return ("/dashboard");
  if (user.role !== "ADMIN" && shift.ownerId !== user.id) return ("/dashboard");

  const updated = await prisma.shift.update({
    where: { id: params.id },
    data: body,
  });

  return NextResponse.json(updated);
}

// 🟢 حذف شفت
export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const user = await requireUser();
  const shift = await prisma.shift.findUnique({ where: { id: params.id } });

  if (!shift) return ("/dashboard");
  if (user.role !== "ADMIN" && shift.ownerId !== user.id) return ("/dashboard");

  await prisma.shift.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
