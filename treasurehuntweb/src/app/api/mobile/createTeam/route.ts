import { api } from "~/trpc/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const reqData = await request.json();

  if (!reqData) return new Response("No data provided", { status: 400 });

  const res = await api.teams.createTeam({
    raceId: reqData.raceId,
    userId: reqData.userId,
    teamName: reqData.teamName,
  });

  if (!res) return Response.json({ result: "error" });

  return Response.json({ result: "success" });
}
