import { api } from "~/trpc/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const reqData = await request.json();

  if (!reqData) return new Response("No code provided", { status: 400 });

  const res = await api.races.userJoinsRace({
    code: reqData.code,
    userId: reqData.userId,
  });

  return Response.json({ result: res });
}
