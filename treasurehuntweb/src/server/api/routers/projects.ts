import { z } from "zod";
import { and, eq } from "drizzle-orm";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { projectObjectives, projects, race, team } from "../../db/schema";
import { TRPCError } from "@trpc/server";

export const projectsRouter = createTRPCRouter({
  fetchUserProjects: protectedProcedure.query(async ({ ctx }) => {
    const authUserEmail = ctx.authUser?.email;
    if (!authUserEmail) return;
    const projectsData = ctx.db.query.projects.findMany({
      where: and(
        eq(projects.userEmail, authUserEmail),
        eq(projects.deleted, false),
      ),
      orderBy: (projects, { asc }) => [asc(projects.createdAt)],
    });

    return projectsData;
  }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.authUser?.email) return;
      const created = await ctx.db
        .insert(projects)
        .values({
          name: input.name,
          userId: ctx.authUser.id!,
          userEmail: ctx.authUser.email,
          description: input.description,
        })
        .returning({ projectId: projects.id });

      const projectNumber = created[0]?.projectId;

      if (!projectNumber) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Could not create project",
        });
        return;
      }

      const newRace = await ctx.db
        .insert(race)
        .values({
          projectId: projectNumber,
        })
        .returning({ id: race.id });

      const newRaceId = newRace[0]?.id;

      if (!newRaceId) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Could not create race",
        });
        return;
      }

      await ctx.db
        .update(projects)
        .set({ currentRace: newRaceId })
        .where(eq(projects.id, projectNumber));

      return projectNumber;
    }),

  delete: protectedProcedure
    .input(z.object({ projectId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(projects)
        .set({ deleted: true })
        .where(
          and(
            eq(projects.id, input.projectId),
            eq(projects.userEmail, ctx.user.email!),
          ),
        );
    }),

  fetchProjectObjectives: protectedProcedure
    .input(z.number())
    .query(async ({ ctx, input }) => {
      const projectObjectivesInfo = ctx.db.query.projectObjectives.findMany({
        where: eq(projectObjectives.projectid, input),
        orderBy: (projectObjectives, { asc }) => [asc(projectObjectives.order)],
      });
      return projectObjectivesInfo;
    }),

  changeTitle: protectedProcedure
    .input(
      z.object({
        projectId: z.number(),
        title: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const created = await ctx.db
        .update(projects)
        .set({ name: input.title })
        .where(
          and(
            eq(projects.id, input.projectId),
            eq(projects.userId, ctx.user.id!),
          ),
        );
    }),
});
