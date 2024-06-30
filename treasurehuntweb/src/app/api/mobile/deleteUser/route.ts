import { user } from "~/server/db/schema";
import { api } from "~/trpc/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const reqData = await request.json();

  if (!reqData) return new Response("No data provided", { status: 400 });

  const res = await api.users.deleteUser({
    userId: reqData.userId,
    userEmail: reqData.userEmail,
  });

  if (!res)
    return Response.json({ deleted: false, result: "Could not delete user." });

  return Response.json({ deleted: true, result: "success" });
}
