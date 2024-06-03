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
import { db } from ".";
import { create } from "domain";

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
  userEmail: text("email").notNull().unique(),
});

export const userProjectRelations = relations(user, ({ many }) => ({
  userProjects: many(projects),
}));

export const projectUserRelations = relations(projects, ({ one }) => ({
  user: one(user, {
    fields: [projects.userId],
    references: [user.id],
  }),
}));

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

export const track = createTable("tracks", {
  id: serial("id").primaryKey(),
  projectId: integer("projectId").notNull(),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const tracksUserRelations = relations(track, ({ many }) => ({
  usersParticipating: many(user),
}));

export const userTracksRelation = relations(user, ({ many }) => ({
  tracksInWhichUserIsParticipating: many(track),
}));

export const tracksProjectsRelations = relations(track, ({ one }) => ({
  relatedProject: one(projects, {
    fields: [track.projectId],
    references: [projects.id],
  }),
}));

export const team = createTable("teams", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  trackId: integer("trackId").notNull(),
});

export const teamTrackRelations = relations(team, ({ one }) => ({
  relatedProject: one(track, {
    fields: [team.trackId],
    references: [track.id],
  }),
}));

export const teamUserRelations = relations(team, ({ many }) => ({
  users: many(user),
}));

export const trackPosition = createTable("trackPosition", {
  id: serial("id").primaryKey(),
  trackId: integer("trackId").notNull(),
  teamId: integer("teamId").notNull(),
  objectiveIndex: integer("userId").notNull(),
  latitude: doublePrecision("latitude").notNull(),
  longitude: doublePrecision("longitude").notNull(),
});

export const teamTrackPositionRelations = relations(team, ({ one }) => ({
  users: one(trackPosition, {
    fields: [team.id],
    references: [trackPosition.teamId],
  }),
}));

export const trackTrackPositionRelations = relations(track, ({ many }) => ({
  users: many(trackPosition),
}));

export const trackPositionTrackRelations = relations(
  trackPosition,
  ({ one }) => ({
    users: one(track, {
      fields: [trackPosition.trackId],
      references: [track.id],
    }),
  }),
);

export type User = typeof user.$inferSelect;
export type NewUser = typeof user.$inferInsert;

export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;

export type ProjectObjective = typeof projectObjectives.$inferSelect;
export type NewProjectObjective = typeof projectObjectives.$inferInsert;

export type Track = typeof track.$inferSelect;
export type NewTrack = typeof track.$inferInsert;

export type Team = typeof team.$inferSelect;
export type NewTeam = typeof team.$inferInsert;
