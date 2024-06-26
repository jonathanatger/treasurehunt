import { db } from "~/server/db";
import { user } from "~/server/db/schema";
import { api } from "~/trpc/server";
import { nanoid } from "nanoid";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const reqData = await request.json();

  if (!reqData) return new Response("No data provided", { status: 400 });

  const check = await api.users.fetchUserId({ email: reqData.email });
  const name = reqData.name === "" ? "Anonymous" : reqData.name;

  if (!check.found) {
    const password = nanoid();
    const userInfo = await db
      .insert(user)
      .values({
        name: name,
        email: reqData.email,
        image: reqData.picture,
        providerid: reqData.id,
        password: password,
        provider: reqData.provider || "0",
      })
      .returning();

    return Response.json({ found: false, user: userInfo });
  }
  return Response.json({ found: true, user: check.user });
}
