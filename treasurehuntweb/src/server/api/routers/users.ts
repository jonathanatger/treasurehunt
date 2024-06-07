import { z } from "zod";
import { and, eq } from "drizzle-orm";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { projectObjectives, projects, race, team, user } from "../../db/schema";
import { TRPCError } from "@trpc/server";

export const usersRouter = createTRPCRouter({
  fetchUserId: protectedProcedure
    .input(z.object({ email: z.string() }))
    .query(async ({ ctx, input }) => {
      const fetchedUser = await ctx.db.query.user.findFirst({
        where: eq(user.email, input.email),
      });

      if (!fetchedUser) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Could not find user",
        });
      }

      return fetchedUser.id;
    }),
});
