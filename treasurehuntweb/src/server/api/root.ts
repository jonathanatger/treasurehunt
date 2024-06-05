import { objectivesRouter } from "./routers/objectives";
import { projectsRouter } from "./routers/projects";
import { racesRouter } from "./routers/races";
import { createCallerFactory, createTRPCRouter } from "./trpc";

// primary router on the server -- new subrouters to be added here as they get created
export const appRouter = createTRPCRouter({
  projects: projectsRouter,
  objectives: objectivesRouter,
  races: racesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

// Create a server-side caller for the tRPC API.
export const createCaller = createCallerFactory(appRouter);
