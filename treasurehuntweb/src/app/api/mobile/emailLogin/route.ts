import { db } from "~/server/db";
import { user } from "~/server/db/schema";
import { api } from "~/trpc/server";
import { nanoid } from "nanoid";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const reqData = await request.json();

  if (!reqData) return new Response("No data provided", { status: 400 });
  const password = reqData.password;
  const email = reqData.email;

  const isUserExist = (await db.select().from(user)).find(
    (user) => user.email === email,
  );

  if (!isUserExist) {
    return {
      message: "User not found",
      check: false,
      user: null,
    };
  }

  const { password: existPassword, ...rest } = isUserExist;
  const isPasswordMatch = existPassword === password;

  if (!isPasswordMatch) {
    return {
      message: "Password is incorrect",
      check: false,
      user: null,
    };
  }

  return {
    message: "User logged in successfully",
    status: true,
    user: isUserExist,
  };
}
