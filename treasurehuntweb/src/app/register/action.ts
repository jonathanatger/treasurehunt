"use server";

import { db } from "../../server/db/index";
import { user } from "../../server/db/schema";
import { nanoid } from "nanoid";

type TFormData = {
  email: string;
  password: string;
  name: string;
};

const action = async (formData: TFormData) => {
  const isAlreadyRegistered = (await db.select().from(user)).find(
    (user) => user.email === formData.email,
  );

  if (isAlreadyRegistered) {
    return {
      message: "Email already registered",
      status: false,
    };
  }

  await db.insert(user).values({
    ...formData,
  });

  return {
    message: "User registered successfully",
    status: true,
  };
};

export default action;
