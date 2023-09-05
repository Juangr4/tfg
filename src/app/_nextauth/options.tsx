import { dbClient } from "@/db";
import { users } from "@/db/schema";
import { compare } from "bcrypt";
import { and, eq } from "drizzle-orm";
import { type NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "example@gmail.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials.password) return null;

        const user = await dbClient.query.users.findFirst({
          where: and(eq(users.email, credentials.email)),
        });

        if (!user || !(await compare(credentials.password, user.password)))
          return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (trigger === "update") {
        // Updating token via useSession().update from client.
        if (session?.id) {
          const serverUser = await dbClient.query.users.findFirst({
            where: eq(users.id, session.id),
          });
          token.name = serverUser?.name;
          token.email = serverUser?.email;
          token.role = serverUser?.role ?? "user";
        }
      } else if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) session.user.role = token.role;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};
