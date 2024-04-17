import { sql, relations } from "drizzle-orm";
import {
  pgTableCreator,
  serial,
  timestamp,
  text,
  varchar,
  integer,
  doublePrecision,
} from "drizzle-orm/pg-core";

export const createTable = pgTableCreator((name) => `treasurehunt_${name}`);

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

export const users = createTable("users", {
  id: serial("id").primaryKey(),
  fullName: text("full_name"),
  phone: varchar("phone", { length: 256 }),
});

export const userProjectRelations = relations(users, ({ many }) => ({
  userProjects: many(projects),
}));

export const projectUserRelations = relations(projects, ({ one }) => ({
  user: one(users, {
    fields: [projects.userId],
    references: [users.id],
  }),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;

export type ProjectObjective = typeof projectObjectives.$inferSelect;
export type NewProjectObjective = typeof projectObjectives.$inferInsert;
