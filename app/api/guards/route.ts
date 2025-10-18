import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

export async function GET() {
  await requireUser();
  const guards = await prisma.guard.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(guards);
}

export async function POST(req: Request) {
  await requireUser();
  const data = await req.json();
  if (!data.name || !data.email) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  const guard = await prisma.guard.create({
    data: { name: data.name, email: data.email, phone: data.phone || null },
  });
  return NextResponse.json(guard);
}
