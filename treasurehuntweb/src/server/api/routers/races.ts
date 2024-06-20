import { z } from "zod";
import { and, eq } from "drizzle-orm";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import {
  projectObjectives,
  projects,
  race,
  raceOnUserJoinTable,
  teamSubmissions,
  user,
} from "../../db/schema";
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
      const raceWhereCodeMatches = await ctx.db.query.race.findFirst({
        where: eq(race.code, input.code),
      });

      if (!raceWhereCodeMatches)
        return {
          joined: false,
          result: "Pas de course avec ce code ! Pouvez-vous vérifier ?",
        };

      const req = await ctx.db
        .insert(raceOnUserJoinTable)
        .values({
          userEmail: input.userEmail,
          raceId: raceWhereCodeMatches.id,
        })
        .onConflictDoNothing()
        .returning();

      if (req.length === 0)
        return {
          joined: false,
          result: "Vous avez déjà rejoint cette course !",
        };

      return { joined: true, result: "Vous avez rejoint la course !" };
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

  getRaceObjectives: publicProcedure
    .input(z.object({ raceId: z.number() }))
    .query(async ({ ctx, input }) => {
      const project = await ctx.db
        .select()
        .from(projects)
        .where(eq(projects.currentRace, input.raceId))
        .rightJoin(
          projectObjectives,
          eq(projectObjectives.projectid, projects.id),
        );

      if (!project)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Could not find race",
        });

      const objectives = project.map((p) => p.projectObjectives);

      return objectives;
    }),

  advanceObjective: publicProcedure
    .input(
      z.object({
        teamId: z.number(),
        raceId: z.number(),
        objectiveIndex: z.number(),
        objectiveName: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const existingSubmissions = await ctx.db
        .select()
        .from(teamSubmissions)
        .where(
          and(
            eq(teamSubmissions.teamId, input.teamId),
            eq(teamSubmissions.objectiveIndex, input.objectiveIndex),
            eq(teamSubmissions.raceId, input.raceId),
          ),
        );

      if (existingSubmissions && existingSubmissions.length > 0) {
        return false;
      }

      const submission = await ctx.db.insert(teamSubmissions).values({
        teamId: input.teamId,
        raceId: input.raceId,
        objectiveIndex: input.objectiveIndex,
        objectiveName: input.objectiveName,
      });

      if (!submission) return false;
      return true;
    }),
});
