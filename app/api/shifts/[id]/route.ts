import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { redirectToDashboard, requireUser } from "@/lib/auth";

// 🟢 تعديل شفت
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const result = await requireUser(request);
  if ("redirect" in result) return result.redirect;

  const { user } = result;
  if (!user) return redirectToDashboard(request);

  const body = await request.json();
  const shift = await prisma.shift.findUnique({ where: { id: params.id } });

   if (!shift) return redirectToDashboard(request);
  if (user.role !== "ADMIN" && shift.ownerId !== user.id) return redirectToDashboard(request);

  const dataToUpdate: {
    title?: string;
    location?: string;
    start?: Date;
    end?: Date;
    ownerId?: string;
  } = {};

  if (body.title) dataToUpdate.title = body.title;
  if (body.location) dataToUpdate.location = body.location;
  if (body.start) dataToUpdate.start = new Date(body.start);
  if (body.end) dataToUpdate.end = new Date(body.end);

  if (user.role === "ADMIN" && body.ownerId) {
    dataToUpdate.ownerId = body.ownerId;
  }

  const updated = await prisma.shift.update({
    where: { id: params.id },
    data: dataToUpdate,
  });

  return NextResponse.json(updated);
}

// 🟢 حذف شفت
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const result = await requireUser(request);
  if ("redirect" in result) return result.redirect;

  const { user } = result;
  if (!user) return redirectToDashboard(request);
  const shift = await prisma.shift.findUnique({ where: { id: params.id } });

  if (!shift) return redirectToDashboard(request);
  if (user.role !== "ADMIN" && shift.ownerId !== user.id) return redirectToDashboard(request);

  await prisma.shift.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
