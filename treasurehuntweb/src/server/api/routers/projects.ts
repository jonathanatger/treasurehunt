import { z } from "zod";
import { and, eq } from "drizzle-orm";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { projectObjectives, projects } from "../../db/schema";

export const projectsRouter = createTRPCRouter({
  fetchUserProjects: protectedProcedure.query(async ({ ctx }) => {
    const projectsData = ctx.db.query.projects.findMany({
      where: eq(projects.userId, ctx.user.userId!),
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
      const created = await ctx.db.insert(projects).values({
        name: input.name,
        userId: ctx.user.userId!,
        description: input.description,
      });
    }),

  delete: protectedProcedure
    .input(z.object({ projectId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(projects)
        .where(
          and(
            eq(projects.id, input.projectId),
            eq(projects.userId, ctx.user.userId!),
          ),
        );
      await ctx.db
        .delete(projectObjectives)
        .where(and(eq(projectObjectives.projectid, input.projectId)));
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
            eq(projects.userId, ctx.user.userId!),
          ),
        );
    }),
});
