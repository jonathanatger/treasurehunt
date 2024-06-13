import { api } from "~/trpc/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const reqData = await request.json();

  if (!reqData) return new Response("No id provided", { status: 400 });

  const res = await api.teams.getRaceTeams({
    raceId: reqData,
  });

  return Response.json({ result: res });
}
