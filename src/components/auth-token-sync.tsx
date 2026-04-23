"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { setAccessToken } from "@/lib/token-store";

/**
 * Keeps the module-level token store in sync with the NextAuth session.
 * Must be rendered inside <SessionProvider>.
 */
export function AuthTokenSync() {
  const { data: session } = useSession();

  useEffect(() => {
    setAccessToken(session?.accessToken ?? null);
  }, [session?.accessToken]);

  return null;
}
