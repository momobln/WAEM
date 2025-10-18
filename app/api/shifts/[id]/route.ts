import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const user = await requireUser();
  const data = await req.json();

  const shift = await prisma.shift.findUnique({ where: { id: params.id } });
  if (!shift) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Guard can only update own shifts
  if (user.role !== "ADMIN" && shift.ownerId !== user.id)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const updated = await prisma.shift.update({
    where: { id: params.id },
    data: {
      title: data.title,
      location: data.location,
      start: new Date(data.start),
      end: new Date(data.end),
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const user = await requireUser();
  const shift = await prisma.shift.findUnique({ where: { id: params.id } });
  if (!shift) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (user.role !== "ADMIN" && shift.ownerId !== user.id)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await prisma.shift.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
