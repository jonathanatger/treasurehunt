import { headers } from "next/headers";
import { api } from "~/trpc/server";

export const dynamic = "force-dynamic"; // defaults to auto

export async function POST(request: Request) {
  const id = await request.text();

  if (!id) return new Response("No id provided", { status: 400 });

  const data = await api.races.fetchUserRaces(id);

  return Response.json({ data });
}
