import { z } from "zod";
import { eq, and } from "drizzle-orm";

import { createTRPCRouter, publicProcedure } from "../trpc";
import { projectObjectives, projects } from "../../db/schema";

export const objectivesRouter = createTRPCRouter({
  delete: publicProcedure
    .input(z.object({ projectId: z.number(), clientId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(projectObjectives)
        .where(
          and(
            eq(projectObjectives.projectid, input.projectId),
            eq(projectObjectives.clientId, input.clientId),
          ),
        );
    }),

  create: publicProcedure
    .input(
      z.object({
        projectId: z.number(),
        clientId: z.number(),
        order: z.number(),
        latitude: z.number(),
        longitude: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(projectObjectives).values({
        projectid: input.projectId,
        clientId: input.clientId,
        order: input.order,
        latitude: input.latitude,
        longitude: input.longitude,
      });
    }),

  changeOrder: publicProcedure
    .input(
      z.object({
        firstProject: z.object({ clientId: z.number(), order: z.number() }),
        secondProject: z.object({ clientId: z.number(), order: z.number() }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(projectObjectives)
        .set({ order: input.secondProject.order })
        .where(eq(projectObjectives.clientId, input.firstProject.clientId));
      await ctx.db
        .update(projectObjectives)
        .set({ order: input.firstProject.order })
        .where(eq(projectObjectives.clientId, input.secondProject.clientId));
    }),
});
