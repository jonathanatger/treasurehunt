"use server";

import { api } from "~/trpc/server";

export const action = async (input: string) => {
  // const res = await api.teams.getRaceTeams({
  //   raceId: 1,
  // });
  const res = await api.teams.enterTeam({
    teamId: 22,
    userEmail: "jonathan.atger@gmail.com",
  });

  return res;
};
