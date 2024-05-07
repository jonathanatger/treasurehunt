"use server";
import { revalidatePath } from "next/cache";
import { currentUser } from "@clerk/nextjs/server";

export async function revalidate(path: string) {
  revalidatePath(path);
}

export async function launchGame() {
  console.log("launched");
}

export async function getCurrentUser() {
  return await currentUser();
}
