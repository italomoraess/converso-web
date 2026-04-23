import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { publicClient } from "@/lib/axios-public";
import type { AuthSession } from "@/types";

type NestBody<T> = { data: T };

class InvalidCredentialsError extends CredentialsSignin {
  code = "invalid_credentials";
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "E-mail", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const res = await publicClient.post<NestBody<AuthSession>>(
            "/auth/login",
            {
              email: credentials.email,
              password: credentials.password,
            }
          );

          const session = res.data.data ?? (res.data as unknown as AuthSession);
          if (!session?.accessToken) return null;

          return {
            id: session.user.id,
            email: session.user.email ?? "",
            name: session.user.name ?? null,
            accessToken: session.accessToken,
            refreshToken: session.refreshToken,
            userProfile: session.user,
          };
        } catch (err) {
          const msg =
            err instanceof Error ? err.message : "Email ou senha incorretos.";
          throw new InvalidCredentialsError(msg);
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      // On initial sign-in, persist tokens and user profile into the JWT
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.userProfile = user.userProfile;
      }
      return token;
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      session.refreshToken = token.refreshToken as string;
      if (token.userProfile) {
        session.user = {
          ...session.user,
          ...(token.userProfile as object),
        };
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
});
