import { sql, relations } from "drizzle-orm";
import {
  pgTableCreator,
  serial,
  timestamp,
  text,
  varchar,
  integer,
  doublePrecision,
  uuid,
} from "drizzle-orm/pg-core";

export const createTable = pgTableCreator((name) => `treasurehunt_${name}`);

export const user = createTable("user", {
  id: uuid("id").primaryKey().unique().defaultRandom(),
  email: text("email").notNull().unique(),
  name: text("name"),
  image: text("image"),
  created_at: timestamp("created_at").default(sql`now()`),
  updated_at: timestamp("updated_at").default(sql`now()`),
  password: text("password").notNull(),
});

export const projects = createTable("projects", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt"),
  description: text("projectDescription"),
  userId: varchar("userId").notNull(),
});

export const projectObjectives = createTable("projectObjectives", {
  id: serial("id").primaryKey(),
  clientId: integer("clientId").notNull(),
  projectid: integer("projectId").notNull(),
  title: varchar("title").notNull(),
  order: integer("order").notNull(),
  latitude: doublePrecision("latitude").notNull(),
  longitude: doublePrecision("longitude").notNull(),
  message: varchar("clue-message"),
});

export const projectObjectivesRelations = relations(projects, ({ many }) => ({
  projectObjectives: many(projectObjectives),
}));

export const objectivesProjectRelations = relations(
  projectObjectives,
  ({ one }) => ({
    user: one(projects, {
      fields: [projectObjectives.projectid],
      references: [projects.id],
    }),
  }),
);

export const userProjectRelations = relations(user, ({ many }) => ({
  userProjects: many(projects),
}));

export const projectUserRelations = relations(projects, ({ one }) => ({
  user: one(user, {
    fields: [projects.userId],
    references: [user.id],
  }),
}));

export type User = typeof user.$inferSelect;
export type NewUser = typeof user.$inferInsert;

export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;

export type ProjectObjective = typeof projectObjectives.$inferSelect;
export type NewProjectObjective = typeof projectObjectives.$inferInsert;
