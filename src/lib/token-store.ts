/**
 * Module-level token store.
 * Updated by <AuthTokenSync /> when the NextAuth session changes.
 * Read synchronously by the axios interceptor without a network call.
 */
let _accessToken: string | null = null;

export function setAccessToken(token: string | null): void {
  _accessToken = token;
}

export function getAccessToken(): string | null {
  return _accessToken;
}
