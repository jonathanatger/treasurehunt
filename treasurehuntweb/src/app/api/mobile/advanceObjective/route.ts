import { team } from "~/server/db/schema";
import { api } from "~/trpc/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const reqData = await request.json();

  if (!reqData)
    return new Response("No enought data provided", { status: 400 });

  const res = await api.races.advanceObjective({
    teamId: reqData.teamId,
    raceId: reqData.raceId,
    objectiveIndex: reqData.objectiveIndex,
    objectiveName: reqData.objectiveName,
  });

  return Response.json({ result: res });
}
