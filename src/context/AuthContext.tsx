import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { api, getToken, setToken } from '../api/client';
import type { LoginResponse, Member } from '../types';

interface AuthContextValue {
  member: Member | null;
  /** True until the stored token (if any) has been checked against the API. */
  initializing: boolean;
  login: (email: string, password: string) => Promise<Member>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [member, setMember] = useState<Member | null>(null);
  const [initializing, setInitializing] = useState<boolean>(Boolean(getToken()));

  useEffect(() => {
    let cancelled = false;
    const stored = getToken();
    if (!stored) return;
    api<Member>('/auth/me')
      .then((me) => {
        if (!cancelled) setMember(me);
      })
      .catch(() => {
        setToken(null);
      })
      .finally(() => {
        if (!cancelled) setInitializing(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<Member> => {
    const response = await api<LoginResponse>('/auth/login', { method: 'POST', body: { email, password } });
    setToken(response.token);
    setMember(response.member);
    return response.member;
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    try {
      await api<void>('/auth/logout', { method: 'POST' });
    } catch {
      /* token may already be invalid — clear locally regardless */
    }
    setToken(null);
    setMember(null);
  }, []);

  const value = useMemo(() => ({ member, initializing, login, logout }), [member, initializing, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an <AuthProvider>');
  return ctx;
}
