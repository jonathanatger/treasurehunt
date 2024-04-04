import { z } from "zod";
import { eq, and } from "drizzle-orm";

import { createTRPCRouter, publicProcedure } from "../trpc";
import { projectObjectives, projects } from "../../db/schema";

export const objectivesRouter = createTRPCRouter({
  delete: publicProcedure
    .input(z.object({ projectId: z.number(), order: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(projectObjectives)
        .where(
          and(
            eq(projectObjectives.projectid, input.projectId),
            eq(projectObjectives.order, input.order),
          ),
        );
    }),

  create: publicProcedure
    .input(
      z.object({
        projectId: z.number(),
        order: z.number(),
        latitude: z.number(),
        longitude: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(projectObjectives).values({
        projectid: input.projectId,
        order: input.order,
        latitude: input.latitude,
        longitude: input.longitude,
      });
    }),

  changeOrder: publicProcedure
    .input(
      z.object({
        firstProject: z.object({ id: z.number(), order: z.number() }),
        secondProject: z.object({ id: z.number(), order: z.number() }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(projectObjectives)
        .set({ order: input.firstProject.order })
        .where(eq(projectObjectives.id, input.firstProject.id));
      await ctx.db
        .update(projectObjectives)
        .set({ order: input.secondProject.order })
        .where(eq(projectObjectives.id, input.secondProject.id));
    }),
});
