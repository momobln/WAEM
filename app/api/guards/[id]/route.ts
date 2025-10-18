import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { redirectToDashboard, requireUser } from "@/lib/auth";

// 🔵 Update user (self or Admin)
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const result = await requireUser(request);
  if ("redirect" in result) return result.redirect;

  const { user: current } = result;
  if (!current) return redirectToDashboard(request);

  const data = await request.json();

  // لا يمكن لغير الأدمن تعديل غير نفسه
  if (current.role !== "ADMIN" && current.id !== params.id)
    return redirectToDashboard(request);

  const updated = await prisma.user.update({
    where: { id: params.id },
    data: { name: data.name, phone: data.phone },
  });

  return NextResponse.json(updated);
}

// 🔴 Delete (Admins only)
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const result = await requireUser(request);
  if ("redirect" in result) return result.redirect;

  const { user: current } = result;
  if (!current || current.role !== "ADMIN") return redirectToDashboard(request);

  await prisma.user.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
