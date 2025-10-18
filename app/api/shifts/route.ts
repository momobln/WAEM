import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

// Get all shifts
export async function GET() {
  const shifts = await prisma.shift.findMany({ orderBy: { start: "asc" } });
  return NextResponse.json(shifts);
}

// Create a shift
export async function POST(req: Request) {
  const session = await requireUser();
  const body = await req.json();

  if (!body.title || !body.location || !body.start || !body.end) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const created = await prisma.shift.create({
    data: {
      title: body.title,
      location: body.location,
      start: new Date(body.start),
      end: new Date(body.end),
    },
  });

  return NextResponse.json(created);
}
