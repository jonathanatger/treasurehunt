import { z } from "zod";
import { eq } from "drizzle-orm";

import { createTRPCRouter, publicProcedure } from "../trpc";
import { projectObjectives, projects } from "../../db/schema";
import { revalidatePath } from "next/cache";
import { revalidate } from "~/lib/serverActions";

export const projectsRouter = createTRPCRouter({
  fetchUserProjects: publicProcedure.query(async ({ ctx }) => {
    const projectsData = ctx.db.query.projects.findMany({
      orderBy: (projects, { asc }) => [asc(projects.createdAt)],
    });

    return projectsData;
  }),

  create: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        userId: z.number(),
        description: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const deleted = await ctx.db.insert(projects).values({
        name: input.name,
        userId: input.userId,
        description: input.description,
      });
    }),

  delete: publicProcedure
    .input(z.object({ projectId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(projects).where(eq(projects.id, input.projectId));
    }),

  fetchProjectObjectives: publicProcedure
    .input(z.number())
    .query(async ({ ctx, input }) => {
      const projectObjectivesInfo = ctx.db.query.projectObjectives.findMany({
        where: eq(projectObjectives.projectid, input),
        orderBy: (projectObjectives, { asc }) => [asc(projectObjectives.order)],
      });
      return projectObjectivesInfo;
    }),
});
