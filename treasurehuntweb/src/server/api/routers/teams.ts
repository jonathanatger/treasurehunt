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
        userId: z.string(),
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
        .fullJoin(user, eq(user.id, userOnTeamJoinTable.userId));

      return teams;
    }),

  enterTeam: publicProcedure
    .input(
      z.object({
        teamId: z.number(),
        userId: z.string(),
        existingTeamId: z.number().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (input.existingTeamId) {
        const existingTeam = await ctx.db
          .delete(userOnTeamJoinTable)
          .where(
            and(
              eq(userOnTeamJoinTable.teamId, input.existingTeamId),
              eq(userOnTeamJoinTable.userId, input.userId),
            ),
          );
      }

      const enteredTeam = await ctx.db.insert(userOnTeamJoinTable).values({
        teamId: input.teamId,
        userId: input.userId,
      });

      if (!enteredTeam) return false;
      return true;
    }),

  quitTeam: publicProcedure
    .input(z.object({ teamId: z.number(), userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const usersOnTeam = await ctx.db
        .select()
        .from(userOnTeamJoinTable)
        .where(and(eq(userOnTeamJoinTable.teamId, input.teamId)));

      if (!usersOnTeam) return false;

      await ctx.db
        .delete(userOnTeamJoinTable)
        .where(
          and(
            eq(userOnTeamJoinTable.teamId, input.teamId),
            eq(userOnTeamJoinTable.userId, input.userId),
          ),
        );

      if (usersOnTeam.length < 2) {
        await ctx.db.delete(team).where(and(eq(team.id, input.teamId)));
      }

      return true;
    }),

  deleteTeam: publicProcedure
    .input(z.object({ teamId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const deletedTeam = await ctx.db
        .delete(team)
        .where(eq(team.id, input.teamId));

      if (!deletedTeam) return false;

      return true;
    }),
});
