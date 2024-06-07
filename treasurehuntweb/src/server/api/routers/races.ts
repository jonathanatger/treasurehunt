import { z } from "zod";
import { and, eq } from "drizzle-orm";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { race, raceOnUserJoinTable, user } from "../../db/schema";
import { TRPCError } from "@trpc/server";

export const racesRouter = createTRPCRouter({
  fetchUserRaces: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const races = await ctx.db
        .select()
        .from(race)
        .innerJoin(raceOnUserJoinTable, eq(race.id, raceOnUserJoinTable.raceId))
        .where(eq(raceOnUserJoinTable.userEmail, input));

      return races;
    }),

  userJoinsRace: publicProcedure
    .input(z.object({ code: z.string(), userEmail: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const selectedRace = await ctx.db
        .select()
        .from(race)
        .where(eq(race.code, input.code));

      if (!selectedRace)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Could not find race",
        });

      // 0000000 WIP
      // await ctx.db.insert(raceOnUserJoinTable).values({
      //   userEmail: input.userEmail,
      //   raceId: selectedRace[0].id,
      // });
      // return true;
    }),

  fetchRace: protectedProcedure
    .input(z.object({ raceId: z.number() }))
    .query(async ({ ctx, input }) => {
      const selectedRace = await ctx.db.query.race.findFirst({
        where: eq(race.id, input.raceId),
      });

      if (!selectedRace)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Could not find race",
        });

      return selectedRace;
    }),
});
