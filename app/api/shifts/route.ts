export async function POST(req: Request) {
  const session = await requireUser();
  const userId = (session.user as { id?: string })?.id;
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = await req.json();

  // تأكد من القيم المطلوبة قبل الإنشاء
  if (!body.title || !body.location || !body.start || !body.end) {
    return new Response("Missing fields", { status: 400 });
  }

  const created = await prisma.shift.create({
    data: {
      title: String(body.title),
      location: String(body.location),
      start: new Date(body.start),
      end: new Date(body.end),
      ownerId: userId, // لن تكون undefined بعد الآن
    },
  });

  return new Response(JSON.stringify(created), { status: 201 });
}
