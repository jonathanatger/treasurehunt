"use server";

import { api } from "~/trpc/server";

export const action = async (input: string) => {
  const res = await api.races.userJoinsRace({
    code: input,
    userEmail: "dropboxtpbim@gmail.com",
  });

  return res;
};
