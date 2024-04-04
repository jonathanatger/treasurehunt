import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";

import { db } from "../db";

//define what is available in the requests
export const createTRPCContext = async (opts: { headers: Headers }) => {
  return {
    db,
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
