import { api } from "~/trpc/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const reqData = await request.json();

  if (!reqData)
    return new Response("No user or race provided", { status: 400 });
  let reqBody: {
    teamId: number;
    userEmail: string;
    existingTeamId?: number;
  };

  if (reqData.existingTeamId) {
    reqBody = {
      teamId: reqData.teamId,
      userEmail: reqData.userEmail,
      existingTeamId: reqData.existingTeamId,
    };
  } else {
    reqBody = {
      teamId: reqData.teamId,
      userEmail: reqData.userEmail,
    };
  }

  const res = await api.teams.enterTeam(reqBody);

  if (!res) return Response.json({ result: "error" });

  return Response.json({ result: "success" });
}
