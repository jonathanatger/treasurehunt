import { api } from "~/trpc/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const reqData = await request.json();

  if (!reqData) return new Response("No name provided", { status: 400 });

  const reqBody = {
    name: reqData.name,
    userId: reqData.userId,
  };

  const res = await api.users.editName(reqBody);

  if (!res)
    return Response.json({ changed: false, result: "Could not change name" });

  return Response.json({ changed: true, result: reqBody.name });
}
