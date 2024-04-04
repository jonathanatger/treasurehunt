"use server";

import { db } from "~/server/db";

import { projects } from "../server/db/schema";
import { revalidatePath } from "next/cache";

export async function revalidate(path: string) {
  "use server";
  revalidatePath(path);
}
