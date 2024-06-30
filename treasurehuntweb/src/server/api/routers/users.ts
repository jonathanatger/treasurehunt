import { z } from "zod";
import { and, eq } from "drizzle-orm";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { projectObjectives, projects, race, team, user } from "../../db/schema";
import { TRPCError } from "@trpc/server";

export const usersRouter = createTRPCRouter({
  fetchUserId: publicProcedure
    .input(z.object({ email: z.string() }))
    .query(async ({ ctx, input }) => {
      const fetchedUser = await ctx.db.query.user.findFirst({
        where: eq(user.email, input.email),
      });

      if (!fetchedUser) {
        return { found: false, user: "no user with that email" };
      }

      return { found: true, user: fetchedUser };
    }),

  editName: publicProcedure
    .input(z.object({ name: z.string(), userEmail: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const returnedUser = await ctx.db
        .update(user)
        .set({ name: input.name })
        .where(eq(user.email, input.userEmail));

      if (!returnedUser) return false;
      return true;
    }),
});
