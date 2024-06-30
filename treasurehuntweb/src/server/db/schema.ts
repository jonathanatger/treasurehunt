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
  primaryKey,
  boolean,
  date,
} from "drizzle-orm/pg-core";
import { db } from ".";
import { create } from "domain";

export const createTable = pgTableCreator((name) => `treasurehunt_${name}`);

export const user = createTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  providerid: varchar("providerid").notNull().default("0"),
  email: text("email").notNull().unique(),
  name: text("name"),
  image: text("image"),
  created_at: timestamp("created_at").default(sql`now()`),
  updated_at: timestamp("updated_at").default(sql`now()`),
  password: text("password").notNull(),
  deleted: boolean("deleted").default(false),
});

export const userRelations = relations(user, ({ one, many }) => ({
  userProjects: many(projects),
  races: many(raceOnUserJoinTable),
  teams: many(userOnTeamJoinTable),
}));

export const projects = createTable("projects", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt"),
  description: text("projectDescription"),
  userId: uuid("userId").notNull(),
  userEmail: text("email").notNull(),
  currentRace: integer("currentRace"),
  deleted: boolean("deleted").default(false),
  isLaunched: boolean("isLaunched").default(false),
});

export const projectRelations = relations(projects, ({ one, many }) => ({
  user: one(user, {
    fields: [projects.userId],
    references: [user.id],
  }),
  projectObjectives: many(projectObjectives),
  races: many(race, { relationName: "projectToRaces" }),
  currentRace: one(race, {
    fields: [projects.currentRace],
    references: [race.id],
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

export const objectivesRelations = relations(projectObjectives, ({ one }) => ({
  project: one(projects, {
    fields: [projectObjectives.projectid],
    references: [projects.id],
  }),
}));

export const race = createTable("races", {
  id: serial("id").primaryKey(),
  projectId: integer("projectId").notNull(),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  code: varchar("code", { length: 8 }).notNull(),
  name: varchar("name").notNull().default(""),
  launched: boolean("launched").default(false),
});

export const raceRelations = relations(race, ({ one, many }) => ({
  relatedProject: one(projects, {
    fields: [race.projectId],
    references: [projects.id],
    relationName: "projectToRaces",
  }),
  teams: many(team, { relationName: "raceToTeams" }),
}));

export const raceOnUserJoinTable = createTable(
  "raceOnUserJoin",
  {
    raceId: integer("raceId")
      .notNull()
      .references(() => race.id),
    userId: uuid("userId")
      .notNull()
      .references(() => user.id),
  },
  (t) => {
    return { pk: primaryKey({ columns: [t.raceId, t.userId] }) };
  },
);

export const raceOnUserJoinRelations = relations(
  raceOnUserJoinTable,
  ({ one }) => ({
    raceId: one(race, {
      fields: [raceOnUserJoinTable.raceId],
      references: [race.id],
    }),
    userEmail: one(user, {
      fields: [raceOnUserJoinTable.userId],
      references: [user.id],
    }),
  }),
);

export const team = createTable("teams", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  raceId: integer("raceId").notNull(),
  objectiveIndex: integer("objectiveIndex").notNull().default(0),
  currentLatitude: doublePrecision("latitude").notNull().default(0),
  currentLongitude: doublePrecision("longitude").notNull().default(0),
});

export const teamRelations = relations(team, ({ one, many }) => ({
  relatedRace: one(race, {
    fields: [team.raceId],
    references: [race.id],
    relationName: "raceToTeams",
  }),
  users: many(userOnTeamJoinTable),
  teamSubmissions: many(teamSubmissions, {
    relationName: "teamSubmissionsToTeams",
  }),
}));

export const userOnTeamJoinTable = createTable(
  "userOnTeamJoin",
  {
    userId: uuid("userId")
      .notNull()
      .references(() => user.id),
    teamId: integer("teamId")
      .notNull()
      .references(() => team.id),
  },
  (t) => {
    return { pk: primaryKey({ columns: [t.userId, t.teamId] }) };
  },
);

export const userOnTeamJoinRelations = relations(
  userOnTeamJoinTable,
  ({ one }) => ({
    user: one(user, {
      fields: [userOnTeamJoinTable.userId],
      references: [user.id],
    }),
    team: one(team, {
      fields: [userOnTeamJoinTable.teamId],
      references: [team.id],
    }),
  }),
);

export const teamSubmissions = createTable("teamSubmissions", {
  id: serial("id").primaryKey(),
  teamId: integer("teamId").notNull(),
  raceId: integer("raceId").notNull(),
  objectiveIndex: integer("objectiveIndex").notNull(),
  objectiveName: varchar("objectiveName").notNull(),
  date: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const teamSubmissionsRelations = relations(
  teamSubmissions,
  ({ one }) => ({
    team: one(team, {
      fields: [teamSubmissions.teamId],
      references: [team.id],
      relationName: "teamSubmissionsToTeams",
    }),
    race: one(race, {
      fields: [teamSubmissions.raceId],
      references: [race.id],
      relationName: "teamSubmissionsToRaces",
    }),
  }),
);

export type User = typeof user.$inferSelect;
export type NewUser = typeof user.$inferInsert;

export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;

export type ProjectObjective = typeof projectObjectives.$inferSelect;
export type NewProjectObjective = typeof projectObjectives.$inferInsert;

export type Race = typeof race.$inferSelect;
export type NewRace = typeof race.$inferInsert;

export type RaceOnUserJoin = typeof raceOnUserJoinTable.$inferSelect;

export type Team = typeof team.$inferSelect;
export type NewTeam = typeof team.$inferInsert;
