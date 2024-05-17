"use server";
import { revalidatePath } from "next/cache";

export async function revalidate(path: string) {
  revalidatePath(path);
}

export async function launchGame() {
  console.log("launched");
}
