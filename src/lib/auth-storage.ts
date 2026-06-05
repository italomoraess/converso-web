/* CONVERSO Web — JWT token storage (localStorage). */

const ACCESS = 'converso.accessToken';
const REFRESH = 'converso.refreshToken';
const ROLE = 'converso.role';

export type Role = 'autonomo' | 'admin';

export const tokenStorage = {
  get access() {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(ACCESS);
  },
  get refresh() {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(REFRESH);
  },
  set(access: string, refresh?: string) {
    localStorage.setItem(ACCESS, access);
    if (refresh) localStorage.setItem(REFRESH, refresh);
  },
  clear() {
    localStorage.removeItem(ACCESS);
    localStorage.removeItem(REFRESH);
  },
};

export const roleStorage = {
  get(): Role {
    if (typeof window === 'undefined') return 'autonomo';
    return (localStorage.getItem(ROLE) as Role) || 'autonomo';
  },
  set(role: Role) {
    localStorage.setItem(ROLE, role);
  },
};
