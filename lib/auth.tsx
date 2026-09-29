"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from 'lucide-react';

/* -------------------------------------------------------------------------- */
/* Shared mock-authentication module.                                        */
/* Auth logic lives here, isolated from UI components, so every page (login, */
/* signup, dashboard, profile, ...) can consume the same session state and   */
/* the eventual swap to a real API only touches this file.                   */
/* -------------------------------------------------------------------------- */

export const AUTH_STORAGE_KEY = "teamboard_auth_session";

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  role: string;
  createdAt: string;
  avatarUrl?: string;
}

interface MockAccount extends AuthUser {
  password: string;
}

// Same demo accounts used by app/login/page.tsx so sessions created there
// (and here) resolve against the same credential list.
export const MOCK_ACCOUNTS: MockAccount[] = [
  {
    id: "usr_demo",
    fullName: "Jordan Blake",
    email: "demo@teamboard.app",
    password: "demopass123",
    role: "owner",
    createdAt: "2023-11-02T09:00:00.000Z",
  },
  {
    id: "usr_maya",
    fullName: "Maya Chen",
    email: "maya@teamboard.app",
    password: "workflow2024",
    role: "admin",
    createdAt: "2024-01-14T09:00:00.000Z",
  },
];

const SESSION_CHECK_DELAY_MS = 400;
const LOGIN_LATENCY_MS = 700;

export function getStoredSession(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AuthUser;
    if (!parsed?.id || !parsed?.email) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function persistSession(user: AuthUser): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  } catch {
    // Storage unavailable (private mode, etc.) - session simply won't persist.
  }
}

export function clearSession(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
  } catch {
    // Ignore storage failures - in-memory state is still cleared by the caller.
  }
}

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  logout: () => void;
  updateUser: (partial: Partial<AuthUser>) => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setUser(getStoredSession());
      setIsLoading(false);
    }, SESSION_CHECK_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    function handleStorageChange(event: StorageEvent) {
      if (event.key !== AUTH_STORAGE_KEY) return;
      setUser(getStoredSession());
    }
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<AuthUser> => {
    await new Promise((resolve) => setTimeout(resolve, LOGIN_LATENCY_MS));

    const account = MOCK_ACCOUNTS.find(
      (a) => a.email.toLowerCase() === email.trim().toLowerCase(),
    );

    if (!account || account.password !== password) {
      throw new Error("Invalid email or password. Please try again.");
    }

    const { password: _password, ...authenticatedUser } = account;
    void _password;
    persistSession(authenticatedUser);
    setUser(authenticatedUser);
    return authenticatedUser;
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
  }, []);

  const updateUser = useCallback((partial: Partial<AuthUser>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...partial };
      persistSession(next);
      return next;
    });
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      isAuthenticated: Boolean(user),
      login,
      logout,
      updateUser,
    }),
    [user, isLoading, login, logout, updateUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}

/* -------------------------------------------------------------------------- */
/* Shared UI helpers                                                          */
/* -------------------------------------------------------------------------- */

export function LoadingSpinner({ label = "Checking your session…" }: { label?: string }) {
  return (
    <div className="flex min-h-[60vh] w-full flex-col items-center justify-center gap-4 bg-[var(--background)] px-6 py-24 text-center">
      <Loader2 className="h-8 w-8 animate-spin text-[var(--primary)]" aria-hidden="true" />
      <p className="text-sm font-medium text-[var(--muted-foreground)]">{label}</p>
    </div>
  );
}

export function ProtectedRoute({
  children,
  fallback,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const { isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return <>{fallback ?? <LoadingSpinner label="Checking your session…" />}</>;
  }

  if (!isAuthenticated) {
    return <>{fallback ?? <LoadingSpinner label="Redirecting to login…" />}</>;
  }

  return <>{children}</>;
}
