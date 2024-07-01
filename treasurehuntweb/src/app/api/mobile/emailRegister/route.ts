import { db } from "~/server/db";
import { user } from "~/server/db/schema";
import { api } from "~/trpc/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const reqData = await request.json();

  if (!reqData) return new Response("No data provided", { status: 400 });
  const password = reqData.password;
  const email = reqData.email;
  const name = reqData.name;

  const isUserExist = (await db.select().from(user)).find(
    (user) => user.email === email,
  );

  if (isUserExist) {
    return {
      message: "User email already taken by another account.",
      check: false,
      user: null,
    };
  }

  const [userInfo] = await db
    .insert(user)
    .values({
      name: name,
      email: email,
      image: "",
      providerid: "",
      password: password,
      provider: "credentials",
    })
    .returning();

  if (!userInfo) {
    return {
      message: "Could not create user.",
      check: false,
      user: null,
    };
  }
  return {
    message: "User logged in successfully",
    status: true,
    user: userInfo,
  };
}
