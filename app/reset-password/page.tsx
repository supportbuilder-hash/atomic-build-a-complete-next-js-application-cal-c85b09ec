"use client";

import { Suspense, useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { KeyRound, Eye, EyeOff, CheckCircle2, AlertCircle, Loader2, ArrowLeft, ShieldCheck, Lock } from 'lucide-react';
type APP_NAME = any;
const APP_NAME: any = [];
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/utils";

type FormStatus = "idle" | "submitting" | "success" | "error";

interface FieldErrors {
  password?: string;
  confirmPassword?: string;
}

const MIN_PASSWORD_LENGTH = 8;

function getPasswordStrength(password: string): { score: number; label: string } {
  let score = 0;
  if (password.length >= MIN_PASSWORD_LENGTH) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  const labels = ["Very weak", "Weak", "Fair", "Good", "Strong", "Very strong"];
  return { score, label: labels[score] ?? "Very weak" };
}

function validatePassword(password: string): string | undefined {
  if (!password.trim()) return "Password is required.";
  if (password.length < MIN_PASSWORD_LENGTH) return `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
  if (!/[A-Z]/.test(password)) return "Include at least one uppercase letter.";
  if (!/[a-z]/.test(password)) return "Include at least one lowercase letter.";
  if (!/[0-9]/.test(password)) return "Include at least one number.";
  return undefined;
}

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<FormStatus>("idle");
  const [serverError, setServerError] = useState<string | null>(null);

  const strength = useMemo(() => getPasswordStrength(password), [password]);

  const hasValidToken = Boolean(token && token.trim().length > 0);

  function validate(): boolean {
    const nextErrors: FieldErrors = {};
    const passwordError = validatePassword(password);
    if (passwordError) nextErrors.password = passwordError;

    if (!confirmPassword.trim()) {
      nextErrors.confirmPassword = "Please confirm your new password.";
    } else if (password !== confirmPassword) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setServerError(null);

    if (!hasValidToken) {
      setServerError("This reset link is invalid or has expired. Please request a new one.");
      return;
    }

    if (!validate()) return;

    setStatus("submitting");

    // Mock API call -- swap for a real endpoint (e.g. POST /api/auth/reset-password) later.
    await new Promise((resolve) => setTimeout(resolve, 1200));

    try {
      // Simulated token expiry check for demo purposes only.
      if (token === "expired") {
        throw new Error("This reset link has expired. Please request a new one.");
      }
      setStatus("success");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong. Please try again.";
      setServerError(message);
      setStatus("error");
    }
  }

  if (!hasValidToken) {
    return (
      <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-8 text-center shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.12)]">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10">
          <AlertCircle className="h-6 w-6 text-red-500" aria-hidden="true" />
        </div>
        <h2 className="mt-4 text-lg font-semibold">Invalid reset link</h2>
        <p className="mt-2 text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">
          This password reset link is missing or malformed. Request a new one from the forgot password page and
          follow the link sent to your inbox.
        </p>
        <Link
          href="/forgot-password"
          className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-[var(--accent)] px-6 text-sm font-semibold text-white transition-all duration-300 ease-out hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2"
        >
          Request a new link
        </Link>
      </div>
    );
  }

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-8 text-center shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.12)]"
      >
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10">
          <CheckCircle2 className="h-6 w-6 text-emerald-500" aria-hidden="true" />
        </div>
        <h2 className="mt-4 text-lg font-semibold">Password updated</h2>
        <p className="mt-2 text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">
          Your password has been reset successfully. You can now sign in to {APP_NAME} with your new password.
        </p>
        <Link
          href="/login"
          className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-6 text-sm font-semibold text-white transition-all duration-300 ease-out hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2"
        >
          Continue to login
          <ArrowLeft className="h-4 w-4 rotate-180" aria-hidden="true" />
        </Link>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.12)] sm:p-8"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--accent)]/10">
          <KeyRound className="h-5 w-5 text-[var(--accent)]" aria-hidden="true" />
        </div>
        <div>
          <h2 className="text-base font-semibold">Choose a new password</h2>
          <p className="text-xs text-[hsl(var(--muted-foreground))]">
            Make it at least {MIN_PASSWORD_LENGTH} characters with a mix of letters and numbers.
          </p>
        </div>
      </div>

      {serverError && (
        <div className="mt-5 flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/5 p-3 text-sm text-red-600">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{serverError}</span>
        </div>
      )}

      <div className="mt-6 space-y-5">
        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm font-medium">
            New password
          </label>
          <div className="relative">
            <Lock
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[hsl(var(--muted-foreground))]"
              aria-hidden="true"
            />
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              aria-invalid={Boolean(errors.password)}
              aria-describedby={errors.password ? "password-error" : password.length > 0 ? "password-strength" : undefined}
              className={cn(
                "h-11 w-full rounded-xl border bg-[hsl(var(--background))] pl-10 pr-11 text-sm outline-none transition-all duration-300 ease-out placeholder:text-[hsl(var(--muted-foreground))] focus-visible:ring-2 focus-visible:ring-[var(--accent)]",
                errors.password ? "border-red-500/50" : "border-[hsl(var(--border))]",
              )}
              placeholder="Enter a new password"
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-md text-[hsl(var(--muted-foreground))] transition-colors hover:text-[hsl(var(--foreground))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Eye className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
          </div>

          {errors.password ? (
            <p id="password-error" className="mt-1.5 text-xs text-red-600">
              {errors.password}
            </p>
          ) : (
            password.length > 0 && (
              <div id="password-strength" className="mt-2">
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <span
                      key={index}
                      className={cn(
                        "h-1.5 flex-1 rounded-full transition-colors duration-300",
                        index < strength.score ? "bg-[var(--accent)]" : "bg-[hsl(var(--border))]",
                      )}
                    />
                  ))}
                </div>
                <p className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">{strength.label}</p>
              </div>
            )
          )}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="mb-1.5 block text-sm font-medium">
            Confirm new password
          </label>
          <div className="relative">
            <ShieldCheck
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[hsl(var(--muted-foreground))]"
              aria-hidden="true"
            />
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              aria-invalid={Boolean(errors.confirmPassword)}
              aria-describedby={errors.confirmPassword ? "confirm-password-error" : undefined}
              className={cn(
                "h-11 w-full rounded-xl border bg-[hsl(var(--background))] pl-10 pr-11 text-sm outline-none transition-all duration-300 ease-out placeholder:text-[hsl(var(--muted-foreground))] focus-visible:ring-2 focus-visible:ring-[var(--accent)]",
                errors.confirmPassword ? "border-red-500/50" : "border-[hsl(var(--border))]",
              )}
              placeholder="Re-enter your new password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((value) => !value)}
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-md text-[hsl(var(--muted-foreground))] transition-colors hover:text-[hsl(var(--foreground))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Eye className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p id="confirm-password-error" className="mt-1.5 text-xs text-red-600">
              {errors.confirmPassword}
            </p>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-7 flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[var(--accent)] text-sm font-semibold text-white transition-all duration-300 ease-out hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "submitting" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Resetting password...
          </>
        ) : (
          "Reset password"
        )}
      </button>

      <p className="mt-6 text-center text-sm text-[hsl(var(--muted-foreground))]">
        Remembered your password?{" "}
        <Link href="/login" className="font-medium text-[var(--accent)] hover:underline">
          Back to login
        </Link>
      </p>
    </form>
  );
}

function ResetPasswordFallback() {
  return (
    <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-8 text-center">
      <Loader2 className="mx-auto h-6 w-6 animate-spin text-[var(--accent)]" aria-hidden="true" />
      <p className="mt-3 text-sm text-[hsl(var(--muted-foreground))]">Verifying your reset link...</p>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <main className="relative isolate flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden px-4 py-16 sm:py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-[var(--accent)]/10 blur-3xl"
      />

      <div className="w-full max-w-md">
        <Reveal>
          <div className="mb-8 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[hsl(var(--muted-foreground))] transition-colors hover:text-[hsl(var(--foreground))]"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--accent)]/10">
                <KeyRound className="h-4 w-4 text-[var(--accent)]" aria-hidden="true" />
              </span>
              {APP_NAME}
            </Link>
            <h1 className="mt-6 text-balance text-3xl font-bold tracking-tight sm:text-4xl">
              Reset your password
            </h1>
            <p className="mt-3 text-pretty text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">
              Set a new password for your account below to get back into your projects and tasks.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <Suspense fallback={<ResetPasswordFallback />}>
            <ResetPasswordForm />
          </Suspense>
        </Reveal>

        <Reveal delay={0.14}>
          <p className="mt-8 text-center text-xs text-[hsl(var(--muted-foreground))]">
            For demo purposes, any link with a{" "}
            <code className="rounded bg-[hsl(var(--muted))] px-1 py-0.5">token</code> query parameter will work. Try
            appending <code className="rounded bg-[hsl(var(--muted))] px-1 py-0.5">?token=expired</code> to see the
            expired-link flow.
          </p>
        </Reveal>
      </div>
    </main>
  );
}