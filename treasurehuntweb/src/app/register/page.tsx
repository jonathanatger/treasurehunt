"use client";

import action from "./action";
import z from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";

const schema = z.object({
  name: z.string().min(3, "Le nom doit contenir au moins 3 caractères."),
  email: z.string().email("L'email n'est pas valide."),
  password: z
    .string()
    .min(6, "Le mot de passe doit contenir au moins 6 caractères."),
});

const RegisterPage = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = new FormData(e.currentTarget);
    const email = data.get("email") as string;
    const password = data.get("password") as string;
    const name = data.get("name") as string;

    try {
      const schemaResult = schema.safeParse({ name, email, password });
      if (!schemaResult.success && schemaResult.error.errors[0]) {
        throw new Error(schemaResult.error.errors[0].message);
      }

      await action({ name, email, password });
      //@ts-expect-error :  ts does not recognize the schema validation
      const res = await action(schemaResult.data);
      if (res && !res?.status) {
        setError(res.message);
        return;
      }
      router.push("/tracks");
    } catch (error: unknown) {
      // @ts-expect-error
      setError(error.message);
    }
  };

  return (
    <section className="flex h-full w-full flex-col items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="flex w-[400px] flex-col items-center space-y-4 rounded-3xl bg-primary p-4 pt-12 text-primary-foreground"
      >
        <label htmlFor="name">Nom</label>
        <input
          id="name"
          name="name"
          type="text"
          placeholder="Johnny Begood"
          className="w-full rounded-full px-2 py-1 text-foreground"
        />
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="johnny@begood.com"
          className="w-full rounded-full px-2 py-1 text-foreground"
        />
        <label htmlFor="password">Mot de passe</label>
        <input
          id="password"
          name="password"
          type="password"
          className="w-full rounded-full px-2 py-1 text-foreground"
        />
        <button
          type="submit"
          className="w-fit rounded-full bg-secondary px-8 py-2 font-title text-xl text-secondary-foreground"
        >
          S'inscrire
        </button>
        <h2 className="h-10 text-balance text-center italic">{error}</h2>
      </form>
    </section>
  );
};

export default RegisterPage;
