import { api } from "~/trpc/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const email = await request.text();

  if (!email) return new Response("No email provided", { status: 400 });

  const id = await api.users.fetchUserId({ email: email });

  return Response.json({ id });
}
