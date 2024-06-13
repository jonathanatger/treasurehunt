"use server";

import { api } from "~/trpc/server";

export const action = async (input: string) => {
  const res = await api.teams.getRaceTeams({
    raceId: 1,
  });

  return res;
};
