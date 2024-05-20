"use server";

import { revalidate } from "~/lib/serverActions";
import { auth, signOut } from "~/auth/auth";
import { redirect } from "next/navigation";

export const signOutAction = async () => {
  const user = await auth();

  await signOut({ redirect: true, redirectTo: "/" });

  await revalidate("/");

  return {
    message: "User logged out successfully",
    status: true,
  };
};
