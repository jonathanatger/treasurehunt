import { z } from "zod";
import { and, eq } from "drizzle-orm";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { projectObjectives, projects, race, team, user } from "../../db/schema";
import { TRPCError } from "@trpc/server";

export const usersRouter = createTRPCRouter({
  fetchUserId: publicProcedure
    .input(z.object({ email: z.string() }))
    .query(async ({ ctx, input }) => {
      const fetchedUser = await ctx.db.query.user.findFirst({
        where: eq(user.email, input.email),
      });

      if (!fetchedUser) {
        return { found: false, user: "no user with that email" };
      }

      return { found: true, user: fetchedUser };
    }),

  editName: publicProcedure
    .input(z.object({ name: z.string(), userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const returnedUser = await ctx.db
        .update(user)
        .set({ name: input.name })
        .where(eq(user.email, input.userId));

      if (!returnedUser) return false;
      return true;
    }),

  deleteUser: publicProcedure
    .input(z.object({ userId: z.string(), userEmail: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const returnedUser = await ctx.db
        .update(user)
        .set({
          deleted: true,
          password: "deleted",
          image: "deleted",
          name: "User deleted",
          email: input.userId + "-" + input.userEmail,
        })
        .where(eq(user.id, input.userId));

      if (!returnedUser) return false;
      return true;
    }),

  guestSubscription: publicProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // check if user already exists
      const fetchedUser = await ctx.db.query.user.findFirst({
        where: eq(user.email, input.name + "@guesttreasurehunt.com"),
      });

      if (fetchedUser)
        return {
          user: fetchedUser,
          created: true,
          error: "User already exists",
        };

      const [returnedUser] = await ctx.db
        .insert(user)
        .values({
          name: input.name,
          email: input.name + "@guesttreasurehunt.com",
          password: "guest",
          image: "guest",
          deleted: false,
        })
        .returning();

      if (!returnedUser)
        return {
          user: null,
          created: false,
          error: "Could not create user",
        };
      return { user: returnedUser, created: true, error: "" };
    }),
});
