// /app/login/page.tsx

"use client";

import Link from "next/link";
import { signInAction, googleSignIn } from "./action";
import z from "zod";

const schema = z.object({
  email: z.string().email("email is invalid"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const LoginForm = () => {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.currentTarget);
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;
      const schemaResult = schema.safeParse({ email, password });

      if (!schemaResult.success && schemaResult.error.errors[0]) {
        throw new Error(schemaResult.error.errors[0].message);
      }

      if (schemaResult.data) {
        const res = await signInAction(schemaResult.data);
        if (res && !res?.status) {
          // toast error
          return;
        }
      }
    } catch (error: unknown) {
      console.error("Something went wrong");
    }
  };

  return (
    <div className="flex h-full items-center justify-center">
      <div className=" container max-w-[500px]  gap-3 rounded-3xl bg-primary p-4 text-lg text-primary-foreground">
        <form
          action={async () => {
            await googleSignIn();
          }}
          className="flex w-full items-center justify-center"
        >
          <button className="flex w-full flex-row items-center justify-center gap-4 rounded-full p-2 outline">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="35"
              height="35"
              viewBox="0 0 50 50"
              className="fill-primary-foreground stroke-primary-foreground"
            >
              <path d="M 25.996094 48 C 13.3125 48 2.992188 37.683594 2.992188 25 C 2.992188 12.316406 13.3125 2 25.996094 2 C 31.742188 2 37.242188 4.128906 41.488281 7.996094 L 42.261719 8.703125 L 34.675781 16.289063 L 33.972656 15.6875 C 31.746094 13.78125 28.914063 12.730469 25.996094 12.730469 C 19.230469 12.730469 13.722656 18.234375 13.722656 25 C 13.722656 31.765625 19.230469 37.269531 25.996094 37.269531 C 30.875 37.269531 34.730469 34.777344 36.546875 30.53125 L 24.996094 30.53125 L 24.996094 20.175781 L 47.546875 20.207031 L 47.714844 21 C 48.890625 26.582031 47.949219 34.792969 43.183594 40.667969 C 39.238281 45.53125 33.457031 48 25.996094 48 Z"></path>
            </svg>
            <span>Connection avec Google</span>
          </button>
        </form>

        <br />

        <form
          onSubmit={handleSubmit}
          className="flex h-full flex-col items-center justify-center gap-3 "
        >
          <div className="h-[1px] w-full bg-primary-foreground"></div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            className="w-full rounded-full px-3 text-foreground"
          />
          <label htmlFor="password">Mot de passe</label>
          <input
            id="password"
            name="password"
            type="password"
            className="w-full  rounded-full px-3 text-foreground"
          />
          <br></br>
          <button
            type="submit"
            className="w-full rounded-3xl bg-secondary text-secondary-foreground"
          >
            <span>Connection</span>
          </button>
          <br></br>
          <div className="h-[1px] w-full bg-primary-foreground"></div>
          <Link
            href="/register"
            className="self-auto text-balance text-sm italic underline"
          >
            Vous n'êtes pas encore inscrit ? Par ici !
          </Link>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
