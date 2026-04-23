import type { DefaultSession } from "next-auth";
import type { AuthUser } from "./index";

declare module "next-auth" {
  interface Session {
    accessToken: string;
    refreshToken: string;
    user: AuthUser & DefaultSession["user"];
  }

  interface User {
    accessToken: string;
    refreshToken: string;
    userProfile: AuthUser;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken: string;
    refreshToken: string;
    userProfile: AuthUser;
  }
}
