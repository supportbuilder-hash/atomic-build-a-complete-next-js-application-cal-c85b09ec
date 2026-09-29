"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, Loader2, AlertCircle, ArrowRight, LayoutDashboard, CheckSquare, Users, Sparkles } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/Reveal";
import { fadeInUp } from "@/lib/motion";
type APP_NAME = any;
const APP_NAME: any = [];
type APP_TAGLINE = any;
const APP_TAGLINE: any = [];
type AuthUser = any;
const AuthUser: any = [];

/* -------------------------------------------------------------------------- */
/* Auth logic (kept separate from the form/UI below).                        */
/* In a real build this would live in lib/auth.ts and be shared across pages; */
/* it is inlined here only because this page is generated standalone.        */
/* -------------------------------------------------------------------------- */

const AUTH_STORAGE_KEY = "teamboard_auth_session";

interface MockAccount extends AuthUser {
  password: string;
}

const MOCK_ACCOUNTS: MockAccount[] = [
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

function getStoredSession(): AuthUser | null {
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

function persistSession(user: AuthUser): void {
  try {
    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  } catch {
    // Storage unavailable (private mode, etc.) - session simply won't persist.
  }
}

async function authenticate(email: string, password: string): Promise<AuthUser> {
  // Simulated network latency so the loading state is visible.
  await new Promise((resolve) => setTimeout(resolve, 700));

  const account = MOCK_ACCOUNTS.find(
    (a) => a.email.toLowerCase() === email.trim().toLowerCase(),
  );

  if (!account || account.password !== password) {
    throw new Error("Invalid email or password. Please try again.");
  }

  const { password: _password, ...user } = account;
  void _password;
  return user;
}

/* -------------------------------------------------------------------------- */
/* Validation                                                                 */
/* -------------------------------------------------------------------------- */

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 6;

interface FormErrors {
  email?: string;
  password?: string;
}

function validate(email: string, password: string): FormErrors {
  const errors: FormErrors = {};
  if (!email.trim()) {
    errors.email = "Email is required.";
  } else if (!EMAIL_PATTERN.test(email.trim())) {
    errors.email = "Enter a valid email address.";
  }
  if (!password) {
    errors.password = "Password is required.";
  } else if (password.length < MIN_PASSWORD_LENGTH) {
    errors.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
  }
  return errors;
}

/* -------------------------------------------------------------------------- */
/* Page                                                                       */
/* -------------------------------------------------------------------------- */

type SessionCheckState = "checking" | "redirecting" | "ready";

export default function LoginPage() {
  const [sessionState, setSessionState] = useState<SessionCheckState>("checking");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<{ email: boolean; password: boolean }>({
    email: false,
    password: false,
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect-if-already-authenticated: check once on mount.
  useEffect(() => {
    const existing = getStoredSession();
    if (existing) {
      setSessionState("redirecting");
      window.location.href = "/dashboard";
    } else {
      setSessionState("ready");
    }
  }, []);

  const runLogin = async (loginEmail: string, loginPassword: string) => {
    setFormError(null);
    setIsSubmitting(true);
    try {
      const user = await authenticate(loginEmail, loginPassword);
      if (rememberMe) {
        persistSession(user);
      } else {
        try {
          window.sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
        } catch {
          persistSession(user);
        }
      }
      window.location.href = "/dashboard";
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setFormError(message);
      setIsSubmitting(false);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validation = validate(email, password);
    setErrors(validation);
    setTouched({ email: true, password: true });
    if (Object.keys(validation).length > 0) return;
    void runLogin(email, password);
  };

  const handleDemoLogin = () => {
    setEmail("demo@teamboard.app");
    setPassword("demopass123");
    setErrors({});
    setFormError(null);
    void runLogin("demo@teamboard.app", "demopass123");
  };

  const handleBlur = (field: "email" | "password") => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors(validate(email, password));
  };

  if (sessionState !== "ready") {
    return (
      <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-[hsl(var(--background))] px-4">
        <div className="flex flex-col items-center gap-3 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-[var(--accent)]" aria-hidden="true" />
          <p className="text-sm text-[hsl(var(--muted-foreground))]">
            {sessionState === "redirecting" ? "You're already signed in. Redirecting to your dashboard…" : "Checking your session…"}
          </p>
        </div>
      </main>
    );
  }

  const highlights = [
    { icon: LayoutDashboard, text: "Organize every initiative with kanban boards built for real workflows." },
    { icon: CheckSquare, text: "Track tasks by status and priority, from Todo to Done." },
    { icon: Users, text: "Keep your whole team aligned with shared projects and activity feeds." },
  ];

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-[hsl(var(--background))]">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl grid-cols-1 lg:grid-cols-2">
        {/* Left: brand panel */}
        <Reveal className="relative hidden overflow-hidden bg-[hsl(var(--foreground))] px-12 py-16 lg:flex lg:flex-col lg:justify-between">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.15]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 20%, var(--accent) 0%, transparent 45%), radial-gradient(circle at 80% 70%, var(--accent) 0%, transparent 40%)",
            }}
          />
          <div className="relative z-10">
            <Link href="/" className="inline-flex items-center gap-2 text-lg font-semibold tracking-tight text-[hsl(var(--background))]">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--accent)] text-[hsl(var(--foreground))]">
                <LayoutDashboard className="h-5 w-5" aria-hidden="true" />
              </span>
              {APP_NAME}
            </Link>

            <motion.h1
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              className="mt-14 max-w-md text-balance text-4xl font-bold tracking-tight text-[hsl(var(--background))]"
            >
              Welcome back to the board.
            </motion.h1>
            <p className="mt-4 max-w-sm text-pretty text-base leading-relaxed text-[hsl(var(--background))]/70">
              {APP_TAGLINE}
            </p>
          </div>

          <div className="relative z-10 space-y-5">
            {highlights.map((item, i) => (
              <Reveal key={item.text} delay={i * 0.08}>
                <div className="flex items-start gap-3 rounded-2xl border border-[hsl(var(--background))]/10 bg-[hsl(var(--background))]/5 p-4 backdrop-blur-sm">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--accent)]/20 text-[var(--accent)]">
                    <item.icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <p className="text-sm leading-relaxed text-[hsl(var(--background))]/80">{item.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Reveal>

        {/* Right: form panel */}
        <div className="flex flex-col items-center justify-center px-6 py-16 sm:px-10">
          <Reveal className="w-full max-w-sm">
            <div className="mb-8 flex items-center gap-2 lg:hidden">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--accent)] text-[hsl(var(--foreground))]">
                <LayoutDashboard className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="text-lg font-semibold tracking-tight">{APP_NAME}</span>
            </div>

            <h2 className="text-3xl font-bold tracking-tight text-[hsl(var(--foreground))]">Log in</h2>
            <p className="mt-2 text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">
              Enter your credentials to access your projects and tasks.
            </p>

            {formError && (
              <div
                role="alert"
                className="mt-6 flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-500"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{formError}</span>
              </div>
            )}

            <form className="mt-6 space-y-5" onSubmit={handleSubmit} noValidate>
              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-[hsl(var(--foreground))]">
                  Email address
                </label>
                <div className="relative">
                  <Mail
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[hsl(var(--muted-foreground))]"
                    aria-hidden="true"
                  />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => handleBlur("email")}
                    placeholder="you@company.com"
                    aria-invalid={Boolean(touched.email && errors.email)}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    className={cn(
                      "w-full rounded-xl border bg-[hsl(var(--card))] py-2.5 pl-10 pr-3 text-sm text-[hsl(var(--foreground))] outline-none transition-all duration-300 ease-out placeholder:text-[hsl(var(--muted-foreground))]/60 focus-visible:ring-2 focus-visible:ring-[var(--accent)]/40",
                      touched.email && errors.email
                        ? "border-red-500/50 focus-visible:border-red-500"
                        : "border-[hsl(var(--border))] focus-visible:border-[var(--accent)]",
                    )}
                  />
                </div>
                {touched.email && errors.email && (
                  <p id="email-error" className="mt-1.5 text-xs text-red-500">
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm font-medium text-[hsl(var(--foreground))]">
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-xs font-medium text-[var(--accent)] transition-colors hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[hsl(var(--muted-foreground))]"
                    aria-hidden="true"
                  />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={() => handleBlur("password")}
                    placeholder="Enter your password"
                    aria-invalid={Boolean(touched.password && errors.password)}
                    aria-describedby={errors.password ? "password-error" : undefined}
                    className={cn(
                      "w-full rounded-xl border bg-[hsl(var(--card))] py-2.5 pl-10 pr-10 text-sm text-[hsl(var(--foreground))] outline-none transition-all duration-300 ease-out placeholder:text-[hsl(var(--muted-foreground))]/60 focus-visible:ring-2 focus-visible:ring-[var(--accent)]/40",
                      touched.password && errors.password
                        ? "border-red-500/50 focus-visible:border-red-500"
                        : "border-[hsl(var(--border))] focus-visible:border-[var(--accent)]",
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))] transition-colors hover:text-[hsl(var(--foreground))]"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
                  </button>
                </div>
                {touched.password && errors.password && (
                  <p id="password-error" className="mt-1.5 text-xs text-red-500">
                    {errors.password}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-[hsl(var(--border))] text-[var(--accent)] focus-visible:ring-2 focus-visible:ring-[var(--accent)]/40"
                />
                <label htmlFor="remember-me" className="text-sm text-[hsl(var(--muted-foreground))]">
                  Keep me signed in on this device
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-[hsl(var(--foreground))] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.25)] transition-all duration-300 ease-out hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(var(--background))] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    Signing in…
                  </>
                ) : (
                  <>
                    Log in
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true" />
                  </>
                )}
              </button>
            </form>

            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-[hsl(var(--border))]" />
              <span className="text-xs uppercase tracking-wide text-[hsl(var(--muted-foreground))]">or</span>
              <div className="h-px flex-1 bg-[hsl(var(--border))]" />
            </div>

            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-4 py-2.5 text-sm font-medium text-[hsl(var(--foreground))] transition-all duration-300 ease-out hover:border-[var(--accent)]/40 hover:bg-[var(--accent)]/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/40 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Sparkles className="h-4 w-4 text-[var(--accent)]" aria-hidden="true" />
              Continue as demo user
            </button>

            <p className="mt-8 text-center text-sm text-[hsl(var(--muted-foreground))]">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="font-medium text-[var(--accent)] hover:underline">
                Sign up
              </Link>
            </p>
          </Reveal>
        </div>
      </div>
    </main>
  );
}