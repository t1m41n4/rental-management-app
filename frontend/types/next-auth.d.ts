import type { DefaultSession, User as NextAuthUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user: User & DefaultSession["user"];
  }
  interface User extends NextAuthUser {
    role?: string;
  }
}
