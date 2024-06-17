import { z } from "zod";
import { and, eq } from "drizzle-orm";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { race, team, user, userOnTeamJoinTable } from "../../db/schema";
import { TRPCError } from "@trpc/server";
import { create } from "domain";

export const teamsRouter = createTRPCRouter({
  createTeam: publicProcedure
    .input(
      z.object({
        raceId: z.number(),
        userEmail: z.string(),
        teamName: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [newTeam] = await ctx.db
        .insert(team)
        .values({
          raceId: input.raceId,
          name: input.teamName,
        })
        .returning({ id: team.id });

      if (!newTeam) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const userOnTeamJoin = await ctx.db.insert(userOnTeamJoinTable).values({
        userEmail: input.userEmail,
        teamId: newTeam.id,
      });
      return newTeam;
    }),

  getRaceTeams: publicProcedure
    .input(z.object({ raceId: z.number() }))
    .query(async ({ ctx, input }) => {
      const teams = await ctx.db
        .select()
        .from(team)
        .where(eq(team.raceId, input.raceId))
        .rightJoin(userOnTeamJoinTable, eq(team.id, userOnTeamJoinTable.teamId))
        .rightJoin(user, eq(user.email, userOnTeamJoinTable.userEmail));

      return teams;
    }),

  enterTeam: publicProcedure
    .input(
      z.object({ raceId: z.number(), userEmail: z.string(), name: z.string() }),
    )
    .mutation(async ({ ctx, input }) => {
      const enteredTeam = await ctx.db.insert(team).values({
        raceId: input.raceId,
        name: input.name,
      });
    }),
});
