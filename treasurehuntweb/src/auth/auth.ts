import { db } from "../server/db";
import { User, user } from "../server/db/schema";
import NextAuth, { AuthError } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { nanoid } from "nanoid";
import { api } from "~/trpc/client";
import { domain } from "~/lib/utils";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: {},
        id: {},
        name: {},
      },
      authorize: async ({ email, id, name }) => {
        const data = {
          email: email as string,
          id: id as string,
          name: name as string,
        };
        return data;
      },
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    jwt: async ({ token, user, account }) => {
      if (!user) return token;

      if (user.email && account?.provider === "google") {
        const res = await fetch(domain + "/api/getUserIdLocal", {
          method: "POST",
          body: user.email,
        });

        const data = (await res.json()) as {
          found: boolean;
          user: User;
        };
        console.log(data);
        token.sub = data.user.id;
      }

      return token;
    },
    session: async ({ session, token }) => {
      if (token.sub) session.user.id = token.sub;
      return session;
    },
    signIn: async ({ user: userProvider, account }) => {
      try {
        if (account?.provider === "google") {
          const { image, name, email, id } = userProvider;

          if (!email) {
            throw new AuthError("Failed to sign in");
          }

          const isUserExist = (await db.select().from(user)).find((user) => {
            return user.email === email;
          });

          if (!isUserExist) {
            // create password and you mail it to user as temporary password
            // so user can login with email and password too.
            const password = nanoid();

            await db
              .insert(user)
              .values({
                name: name!,
                email,
                image: image!,
                password,
                providerid: id,
              })
              .returning();
          }
          return true;
        } else if (account?.provider === "credentials") {
          return true;
        }
        return false;
      } catch (error) {
        throw new AuthError("Failed to sign in");
      }
    },
  },
});
