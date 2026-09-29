"use client";

import { useState, useEffect, type FormEvent } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Layout, Mail, Lock, User, Eye, EyeOff, AlertCircle, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';
import { Reveal } from "@/components/Reveal";
import { fadeInUp } from "@/lib/motion";

/* -------------------------------------------------------------------------- */
/* Local constants (kept in this file — not part of the shared data module)  */
/* -------------------------------------------------------------------------- */

const APP_NAME = "TeamBoard";
const APP_TAGLINE = "Plan projects, assign tasks, and track progress together.";

const MIN_PASSWORD_LENGTH = 8;

interface SignUpFormValues {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface SignUpFormErrors {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  form?: string;
}

/* -------------------------------------------------------------------------- */
/* Mock auth helpers (architecture ready to swap for a real API later)       */
/* -------------------------------------------------------------------------- */

const MOCK_SESSION_KEY = "teamboard.auth.session";
const MOCK_EXISTING_EMAILS = ["taken@teamboard.com", "admin@teamboard.com"];

interface MockAuthSession {
  id: string;
  fullName: string;
  email: string;
  role: "owner" | "admin" | "member";
  createdAt: string;
}

function readMockSession(): MockAuthSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(MOCK_SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as MockAuthSession;
  } catch {
    return null;
  }
}

function writeMockSession(session: MockAuthSession) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(MOCK_SESSION_KEY, JSON.stringify(session));
  } catch {
    // Ignore storage write failures (e.g. private mode) — the app still
    // works in-memory for the current tab.
  }
}

/**
 * Simulates a network call to a sign-up endpoint. Swap this for a real
 * `fetch("/api/auth/signup")` call once a backend is available — the
 * calling component doesn't need to change.
 */
async function mockSignUp(payload: {
  fullName: string;
  email: string;
  password: string;
}): Promise<{ ok: true; session: MockAuthSession } | { ok: false; message: string }> {
  await new Promise((resolve) => setTimeout(resolve, 700));

  if (MOCK_EXISTING_EMAILS.includes(payload.email.toLowerCase())) {
    return { ok: false, message: "An account with this email already exists." };
  }

  const session: MockAuthSession = {
    id: `user_${Date.now()}`,
    fullName: payload.fullName,
    email: payload.email,
    role: "owner",
    createdAt: new Date().toISOString(),
  };

  return { ok: true, session };
}

/* -------------------------------------------------------------------------- */
/* Validation                                                                 */
/* -------------------------------------------------------------------------- */

function validateSignUp(values: SignUpFormValues): SignUpFormErrors {
  const errors: SignUpFormErrors = {};

  if (!values.fullName.trim()) {
    errors.fullName = "Full name is required.";
  } else if (values.fullName.trim().length < 2) {
    errors.fullName = "Full name must be at least 2 characters.";
  }

  if (!values.email.trim()) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  if (!values.password) {
    errors.password = "Password is required.";
  } else if (values.password.length < MIN_PASSWORD_LENGTH) {
    errors.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
  } else if (!/[A-Z]/.test(values.password) || !/[0-9]/.test(values.password)) {
    errors.password = "Include at least one uppercase letter and one number.";
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = "Please confirm your password.";
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = "Passwords do not match.";
  }

  return errors;
}

/* -------------------------------------------------------------------------- */
/* Auth layout shell (kept local to this file per import rules)              */
/* -------------------------------------------------------------------------- */

function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden bg-[hsl(var(--background))] px-4 py-16 sm:py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% -10%, var(--accent)/0.12, transparent 70%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(var(--accent)/0.08_1px,transparent_1px)] [background-size:28px_28px] opacity-40"
      />
      <div className="w-full max-w-md">{children}</div>
    </main>
  );
}

/* -------------------------------------------------------------------------- */
/* Password strength meter                                                   */
/* -------------------------------------------------------------------------- */

function getPasswordStrength(password: string): { score: number; label: string } {
  let score = 0;
  if (password.length >= MIN_PASSWORD_LENGTH) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  const labels = ["Too weak", "Weak", "Fair", "Good", "Strong"];
  return { score, label: labels[score] ?? "Too weak" };
}

/* -------------------------------------------------------------------------- */
/* Sign up form                                                              */
/* -------------------------------------------------------------------------- */

function SignUpForm({ onSuccess }: { onSuccess: (session: MockAuthSession) => void }) {
  const [values, setValues] = useState<SignUpFormValues>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<SignUpFormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const strength = getPasswordStrength(values.password);

  function handleChange(field: keyof SignUpFormValues, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  function handleBlur(field: keyof SignUpFormValues) {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors(validateSignUp({ ...values }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validationErrors = validateSignUp(values);
    setErrors(validationErrors);
    setTouched({ fullName: true, email: true, password: true, confirmPassword: true });

    if (Object.keys(validationErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      const result = await mockSignUp({
        fullName: values.fullName.trim(),
        email: values.email.trim(),
        password: values.password,
      });

      if (!result.ok) {
        setErrors({ form: result.message });
        setIsSubmitting(false);
        return;
      }

      writeMockSession(result.session);
      onSuccess(result.session);
    } catch {
      setErrors({ form: "Something went wrong. Please try again." });
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {errors.form && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-600"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{errors.form}</span>
        </div>
      )}

      {/* Full name */}
      <div>
        <label htmlFor="fullName" className="mb-1.5 block text-sm font-medium text-[hsl(var(--foreground))]">
          Full name
        </label>
        <div className="relative">
          <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[hsl(var(--muted-foreground))]" />
          <input
            id="fullName"
            name="fullName"
            type="text"
            autoComplete="name"
            value={values.fullName}
            onChange={(e) => handleChange("fullName", e.target.value)}
            onBlur={() => handleBlur("fullName")}
            placeholder="Jordan Avery"
            aria-invalid={Boolean(touched.fullName && errors.fullName)}
            aria-describedby={errors.fullName ? "fullName-error" : undefined}
            className="w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] py-2.5 pl-10 pr-3 text-sm text-[hsl(var(--foreground))] outline-none transition-all duration-300 ease-out placeholder:text-[hsl(var(--muted-foreground))]/60 focus-visible:border-[var(--accent)] focus-visible:ring-2 focus-visible:ring-[var(--accent)]/20"
          />
        </div>
        {touched.fullName && errors.fullName && (
          <p id="fullName-error" className="mt-1.5 flex items-center gap-1 text-xs text-red-500">
            <AlertCircle className="h-3 w-3" /> {errors.fullName}
          </p>
        )}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-[hsl(var(--foreground))]">
          Work email
        </label>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[hsl(var(--muted-foreground))]" />
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={(e) => handleChange("email", e.target.value)}
            onBlur={() => handleBlur("email")}
            placeholder="you@company.com"
            aria-invalid={Boolean(touched.email && errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
            className="w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] py-2.5 pl-10 pr-3 text-sm text-[hsl(var(--foreground))] outline-none transition-all duration-300 ease-out placeholder:text-[hsl(var(--muted-foreground))]/60 focus-visible:border-[var(--accent)] focus-visible:ring-2 focus-visible:ring-[var(--accent)]/20"
          />
        </div>
        {touched.email && errors.email && (
          <p id="email-error" className="mt-1.5 flex items-center gap-1 text-xs text-red-500">
            <AlertCircle className="h-3 w-3" /> {errors.email}
          </p>
        )}
      </div>

      {/* Password */}
      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-[hsl(var(--foreground))]">
          Password
        </label>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[hsl(var(--muted-foreground))]" />
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            value={values.password}
            onChange={(e) => handleChange("password", e.target.value)}
            onBlur={() => handleBlur("password")}
            placeholder="Create a strong password"
            aria-invalid={Boolean(touched.password && errors.password)}
            aria-describedby={errors.password ? "password-error" : undefined}
            className="w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] py-2.5 pl-10 pr-10 text-sm text-[hsl(var(--foreground))] outline-none transition-all duration-300 ease-out placeholder:text-[hsl(var(--muted-foreground))]/60 focus-visible:border-[var(--accent)] focus-visible:ring-2 focus-visible:ring-[var(--accent)]/20"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))] transition-colors duration-200 hover:text-[hsl(var(--foreground))]"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>

        {values.password.length > 0 && (
          <div className="mt-2">
            <div className="flex h-1.5 gap-1">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`h-full flex-1 rounded-full transition-colors duration-300 ${
                    i < strength.score ? "bg-[var(--accent)]" : "bg-[hsl(var(--border))]"
                  }`}
                />
              ))}
            </div>
            <p className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">{strength.label}</p>
          </div>
        )}

        {touched.password && errors.password && (
          <p id="password-error" className="mt-1.5 flex items-center gap-1 text-xs text-red-500">
            <AlertCircle className="h-3 w-3" /> {errors.password}
          </p>
        )}
      </div>

      {/* Confirm password */}
      <div>
        <label htmlFor="confirmPassword" className="mb-1.5 block text-sm font-medium text-[hsl(var(--foreground))]">
          Confirm password
        </label>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[hsl(var(--muted-foreground))]" />
          <input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            autoComplete="new-password"
            value={values.confirmPassword}
            onChange={(e) => handleChange("confirmPassword", e.target.value)}
            onBlur={() => handleBlur("confirmPassword")}
            placeholder="Re-enter your password"
            aria-invalid={Boolean(touched.confirmPassword && errors.confirmPassword)}
            aria-describedby={errors.confirmPassword ? "confirmPassword-error" : undefined}
            className="w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] py-2.5 pl-10 pr-10 text-sm text-[hsl(var(--foreground))] outline-none transition-all duration-300 ease-out placeholder:text-[hsl(var(--muted-foreground))]/60 focus-visible:border-[var(--accent)] focus-visible:ring-2 focus-visible:ring-[var(--accent)]/20"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword((v) => !v)}
            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))] transition-colors duration-200 hover:text-[hsl(var(--foreground))]"
          >
            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {touched.confirmPassword && errors.confirmPassword && (
          <p id="confirmPassword-error" className="mt-1.5 flex items-center gap-1 text-xs text-red-500">
            <AlertCircle className="h-3 w-3" /> {errors.confirmPassword}
          </p>
        )}
        {touched.confirmPassword &&
          !errors.confirmPassword &&
          values.confirmPassword.length > 0 && (
            <p className="mt-1.5 flex items-center gap-1 text-xs text-emerald-600">
              <CheckCircle2 className="h-3 w-3" /> Passwords match
            </p>
          )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-[var(--accent-foreground)] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.24)] transition-all duration-300 ease-out hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/40 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Creating your account...
          </>
        ) : (
          <>
            Create account
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </>
        )}
      </button>

      <p className="text-center text-xs leading-relaxed text-[hsl(var(--muted-foreground))]">
        By creating an account you agree to TeamBoard&apos;s workspace guidelines and data handling
        practices for team collaboration.
      </p>
    </form>
  );
}

/* -------------------------------------------------------------------------- */
/* Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function SignUpPage() {
  const [checkingSession, setCheckingSession] = useState(true);
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    const existing = readMockSession();
    if (existing) {
      setRedirecting(true);
      window.location.href = "/dashboard";
      return;
    }
    setCheckingSession(false);
  }, []);

  function handleSuccess() {
    setRedirecting(true);
    window.location.href = "/dashboard";
  }

  if (checkingSession || redirecting) {
    return (
      <AuthLayout>
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
          <Loader2 className="h-6 w-6 animate-spin text-[var(--accent)]" />
          <p className="text-sm text-[hsl(var(--muted-foreground))]">
            {redirecting ? "Setting up your workspace..." : "Checking your session..."}
          </p>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <Reveal>
        <div className="mb-8 flex flex-col items-center text-center">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--accent)]/10 ring-1 ring-[var(--accent)]/20"
          >
            <Layout className="h-6 w-6 text-[var(--accent)]" />
          </motion.div>
          <h1 className="text-balance text-2xl font-bold tracking-tight text-[hsl(var(--foreground))] sm:text-3xl">
            Create your {APP_NAME} account
          </h1>
          <p className="mt-2 max-w-sm text-pretty text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">
            {APP_TAGLINE} Start organizing your team&apos;s work in minutes.
          </p>
        </div>
      </Reveal>

      <Reveal delay={0.08}>
        <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.12)] sm:p-8">
          <SignUpForm onSuccess={handleSuccess} />
        </div>
      </Reveal>

      <Reveal delay={0.14}>
        <p className="mt-6 text-center text-sm text-[hsl(var(--muted-foreground))]">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-[var(--accent)] transition-colors duration-200 hover:brightness-110 focus-visible:outline-none focus-visible:underline"
          >
            Log in
          </Link>
        </p>
      </Reveal>
    </AuthLayout>
  );
}