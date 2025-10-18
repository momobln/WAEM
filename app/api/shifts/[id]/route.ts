import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const session = await requireUser();
const userId = (session.user as { id?: string })?.id;
  const item = await prisma.shift.findFirst({ where: { id: params.id, ownerId: userId } });
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(item);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await requireUser();
const userId = (session.user as { id?: string })?.id;
  const body = await req.json();
  const updated = await prisma.shift.update({
    where: { id: params.id },
    data: {
      title: body.title,
      location: body.location,
      start: new Date(body.start),
      end: new Date(body.end),
    },
  });
  if (updated.ownerId !== userId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  return NextResponse.json(updated);
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const session = await requireUser();
const userId = (session.user as { id?: string })?.id;
  const found = await prisma.shift.findUnique({ where: { id: params.id } });
  if (!found || found.ownerId !== userId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  await prisma.shift.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
