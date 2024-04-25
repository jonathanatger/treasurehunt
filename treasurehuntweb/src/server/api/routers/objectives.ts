import { z } from "zod";
import { eq, and } from "drizzle-orm";

import { createTRPCRouter, protectedProcedure } from "../trpc";
import { projectObjectives } from "../../db/schema";

export const objectivesRouter = createTRPCRouter({
  delete: protectedProcedure
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

  create: protectedProcedure
    .input(
      z.object({
        projectId: z.number(),
        clientId: z.number(),
        title: z.string(),
        order: z.number(),
        latitude: z.number(),
        longitude: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(projectObjectives).values({
        projectid: input.projectId,
        clientId: input.clientId,
        title: input.title,
        order: input.order,
        latitude: input.latitude,
        longitude: input.longitude,
      });
    }),

  changeOrder: protectedProcedure
    .input(
      z.object({
        projectId: z.number(),
        firstProject: z.object({ clientId: z.number(), order: z.number() }),
        secondProject: z.object({ clientId: z.number(), order: z.number() }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(projectObjectives)
        .set({ order: input.secondProject.order })
        .where(
          and(eq(projectObjectives.clientId, input.firstProject.clientId)),
        );
      await ctx.db
        .update(projectObjectives)
        .set({ order: input.firstProject.order })
        .where(
          and(eq(projectObjectives.clientId, input.secondProject.clientId)),
        );
    }),

  changePosition: protectedProcedure
    .input(
      z.object({
        projectId: z.number(),
        clientId: z.number(),
        latitude: z.number(),
        longitude: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(projectObjectives)
        .set({ latitude: input.latitude, longitude: input.longitude })
        .where(
          and(
            eq(projectObjectives.projectid, input.projectId),
            eq(projectObjectives.clientId, input.clientId),
          ),
        );
    }),

  changeClueMessage: protectedProcedure
    .input(
      z.object({
        projectId: z.number(),
        clientId: z.number(),
        text: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(projectObjectives)
        .set({ message: input.text })
        .where(
          and(
            eq(projectObjectives.projectid, input.projectId),
            eq(projectObjectives.clientId, input.clientId),
          ),
        );
    }),

  changeTitle: protectedProcedure
    .input(
      z.object({
        projectId: z.number(),
        title: z.string(),
        clientId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(projectObjectives)
        .set({ title: input.title })
        .where(
          and(
            eq(projectObjectives.projectid, input.projectId),
            eq(projectObjectives.clientId, input.clientId),
          ),
        );
    }),
});
