import { api } from "~/trpc/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const reqData = await request.json();

  if (!reqData) return new Response("No code provided", { status: 400 });

  const id = await api.races.userJoinsRace({
    code: reqData.data,
    userEmail: reqData.email,
  });

  return Response.json({ id });
}
