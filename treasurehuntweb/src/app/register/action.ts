"use server";

import { signIn } from "~/auth/auth";
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
      message: "Il y a déjà un compte avec cette adresse email",
      status: false,
    };
  }

  const res = await db
    .insert(user)
    .values({
      ...formData,
    })
    .returning({
      name: user.name,
      email: user.email,
      image: user.image,
      id: user.id,
    });

  await signIn("credentials", {
    email: formData.email,
    name: res[0]?.name,
    id: res[0]?.id,
    redirect: true,
    redirectTo: "/tracks",
  });

  return {
    message: "User registered successfully",
    status: true,
  };
};

export default action;
