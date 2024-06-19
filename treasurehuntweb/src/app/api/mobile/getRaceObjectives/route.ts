import { api } from "~/trpc/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const reqData = await request.json();

  if (!reqData) return new Response("No race id provided", { status: 400 });

  const res = await api.races.getRaceObjectives({
    raceId: reqData.raceId,
  });

  return Response.json({ result: res });
}
