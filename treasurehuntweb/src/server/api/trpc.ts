import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";
import { user } from "../db/schema";

import { db } from "../db";
import { auth } from "~/auth/auth";
import { User as AuthUser } from "next-auth";

//define what is available in the requests
export const createTRPCContext = async (opts: { headers: Headers }) => {
  const session = await auth();
  let authUser: AuthUser | undefined;
  let email: string | undefined;
  if (session) authUser = session.user;

  return {
    db,
    authUser,
    ...opts,
  };
};

// initialization of the api. The transformer parses the json, and an error handler has been added to get zod format errors
// on the front end
const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

// helper to call the api on the server
export const createCallerFactory = t.createCallerFactory;

// initialize a trpc router
export const createTRPCRouter = t.router;

// create new trpc procedures
export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.authUser) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next({
    ctx: {
      db: ctx.db,
      user: ctx.authUser,
    },
  });
});
