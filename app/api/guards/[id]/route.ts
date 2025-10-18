import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  await requireUser();
  const data = await req.json();
  const updated = await prisma.guard.update({
    where: { id: params.id },
    data: { name: data.name, email: data.email, phone: data.phone },
  });
  return NextResponse.json(updated);
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  await requireUser();
  await prisma.guard.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
