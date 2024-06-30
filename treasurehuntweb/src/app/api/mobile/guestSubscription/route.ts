import { api } from "~/trpc/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const reqData = await request.json();

  if (!reqData) return new Response("No name provided", { status: 400 });

  const reqBody = {
    name: reqData.name,
  };

  const res = await api.users.guestSubscription(reqBody);

  if (!res.created)
    return Response.json({
      created: false,
      result: res.user,
      error: res.error,
    });

  return Response.json({ created: true, result: res, error: "" });
}
