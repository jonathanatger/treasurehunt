import { api } from "~/trpc/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const reqData = await request.json();

  if (!reqData)
    return new Response("No user or race provided", { status: 400 });

  const res = await api.teams.enterTeam({
    teamId: reqData.teamId,
    userEmail: reqData.userEmail,
  });

  if (!res) return Response.json({ result: "error" });

  return Response.json({ result: "success" });
}
