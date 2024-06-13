import { db } from "~/server/db";
import { user } from "~/server/db/schema";
import { api } from "~/trpc/server";
import { nanoid } from "nanoid";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const reqData = await request.json();

  if (!reqData) return new Response("No data provided", { status: 400 });

  const check = await api.users.fetchUserId({ email: reqData.email });

  if (!check.found) {
    const password = nanoid();
    const userInfo = await db
      .insert(user)
      .values({
        name: reqData.name,
        email: reqData.email,
        image: reqData.picture,
        providerid: reqData.id,
        password: password,
      })
      .returning();
    return Response.json({ userInfo });
  }
  return Response.json({ user: "No user with that email" });
}
