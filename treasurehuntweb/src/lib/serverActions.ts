"use server";

import { db } from "~/server/db";

import { projects } from "../server/db/schema";
import { revalidatePath } from "next/cache";
import { api } from "~/trpc/server";

export async function revalidate(path: string) {
  revalidatePath(path);
}

export async function launchGame() {
  console.log("launched");
}
