import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

// CREATE shift
export async function POST(req: Request) {
  const user = await requireUser();
  const data = await req.json();

  const shift = await prisma.shift.create({
    data: {
      title: data.title,
      location: data.location,
      start: new Date(data.start),
      end: new Date(data.end),
      ownerId: user.id,
    },
  });

  return NextResponse.json(shift);
}

// READ shifts
export async function GET() {
  const user = await requireUser();

  const shifts =
    user.role === "ADMIN"
      ? await prisma.shift.findMany({ include: { owner: true } })
      : await prisma.shift.findMany({
          where: { ownerId: user.id },
          include: { owner: true },
        });

  return NextResponse.json(shifts);
}
