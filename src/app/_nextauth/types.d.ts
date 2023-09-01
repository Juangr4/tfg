import { type userRolesSchemaType } from "@/lib/types";
import { type DefaultSession, type DefaultUser } from "next-auth";
import { type DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      role: userRolesSchemaType;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role: userRolesSchemaType;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    role: userRolesSchemaType;
  }
}
