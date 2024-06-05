import { z } from "zod";
import { and, eq } from "drizzle-orm";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { race, raceOnUserJoinTable } from "../../db/schema";
import { TRPCError } from "@trpc/server";

export const racesRouter = createTRPCRouter({
  fetchUserRaces: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return await ctx.db
        .select()
        .from(race)
        .innerJoin(raceOnUserJoinTable, eq(race.id, raceOnUserJoinTable.raceId))
        .where(eq(raceOnUserJoinTable.userId, input));
    }),
});
