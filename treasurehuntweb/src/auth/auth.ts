// auth/auth.ts

import { db } from "../server/db";
import { user } from "../server/db/schema";
import NextAuth, { AuthError } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { nanoid } from "nanoid";

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
    session: async ({ session, token }) => {
      session.user.id = token.sub!;
      return session;
    },
    signIn: async ({ user: userProvider, account }) => {
      try {
        if (account?.provider === "google") {
          const { image, name, email } = userProvider;

          if (!email) {
            throw new AuthError("Failed to sign in");
          }

          const isUserExist = (await db.select().from(user)).find(
            (user) => user.email === email,
          );

          if (!isUserExist) {
            // create password and you mail it to user as temporary password
            // so user can login with email and password too.
            const password = nanoid();

            await db
              .insert(user)
              .values({
                name: name as string,
                email,
                image: image as string,
                password,
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
