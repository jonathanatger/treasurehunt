import { z } from "zod";
import { and, count, eq, gt } from "drizzle-orm";

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

      return newTeam;
    }),

  getRaceTeams: publicProcedure
    .input(z.object({ raceId: z.number() }))
    .query(async ({ ctx, input }) => {
      const teams = await ctx.db
        .select()
        .from(team)
        .where(eq(team.raceId, input.raceId))
        .fullJoin(userOnTeamJoinTable, eq(team.id, userOnTeamJoinTable.teamId))
        .fullJoin(user, eq(user.email, userOnTeamJoinTable.userEmail));

      return teams;
    }),

  enterTeam: publicProcedure
    .input(z.object({ teamId: z.number(), userEmail: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const enteredTeam = await ctx.db.insert(userOnTeamJoinTable).values({
        teamId: input.teamId,
        userEmail: input.userEmail,
      });
    }),

  quitTeam: publicProcedure
    .input(z.object({ teamId: z.number(), userEmail: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const usersOnTeam = await ctx.db
        .select()
        .from(userOnTeamJoinTable)
        .where(and(eq(userOnTeamJoinTable.teamId, input.teamId)));

      if (!usersOnTeam) return false;

      const [enteredTeam] = await ctx.db
        .delete(userOnTeamJoinTable)
        .where(
          and(
            eq(userOnTeamJoinTable.teamId, input.teamId),
            eq(userOnTeamJoinTable.userEmail, input.userEmail),
          ),
        )
        .returning({ teamId: team.id });

      if (usersOnTeam.length < 2) {
        await ctx.db.delete(team).where(and(eq(team.id, input.teamId)));
      }

      return true;
    }),
});
