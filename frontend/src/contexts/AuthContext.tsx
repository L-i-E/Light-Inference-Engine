import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { api } from '@/lib/api';

export type UserRole = 'researcher' | 'lab_pi' | 'admin';

interface AuthContextType {
  token: string | null;
  role: UserRole | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

function decodeRole(token: string): UserRole | null {
  try {
    const payload = JSON.parse(atob(token.split('.')[1])) as { role?: string };
    const r = payload.role;
    if (r === 'researcher' || r === 'lab_pi' || r === 'admin') return r;
    return null;
  } catch {
    return null;
  }
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const storedToken = localStorage.getItem('token');
  const [token, setToken] = useState<string | null>(storedToken);
  const [role, setRole] = useState<UserRole | null>(storedToken ? decodeRole(storedToken) : null);

  const login = useCallback(async (username: string, password: string) => {
    const data = await api.login(username, password);
    localStorage.setItem('token', data.access_token);
    setToken(data.access_token);
    setRole(decodeRole(data.access_token));
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
    setRole(null);
  }, []);

  return (
    <AuthContext.Provider value={{ token, role, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
