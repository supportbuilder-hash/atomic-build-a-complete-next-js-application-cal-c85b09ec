"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { ArrowLeft, Mail, CheckCircle2, AlertCircle, Loader2, KeyRound, ShieldCheck, Inbox, RotateCcw } from 'lucide-react';
type APP_NAME = any;
const APP_NAME: any = [];
import { Reveal } from "@/components/Reveal";
import { fadeInUp, staggerContainer } from "@/lib/motion";

/* -------------------------------------------------------------------------- */
/* Mock auth layer (kept isolated from UI so a real API can replace it later) */
/* -------------------------------------------------------------------------- */

const MOCK_REGISTERED_EMAILS = [
  "demo@teamboard.app",
  "alex@teamboard.app",
  "priya@teamboard.app",
  "jordan@teamboard.app",
];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Simulates a network call to a password-reset endpoint. */
function requestPasswordReset(email: string): Promise<{ ok: true } | { ok: false; message: string }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const normalized = email.trim().toLowerCase();
      if (!EMAIL_PATTERN.test(normalized)) {
        resolve({ ok: false, message: "Enter a valid email address." });
        return;
      }
      if (!MOCK_REGISTERED_EMAILS.includes(normalized)) {
        resolve({
          ok: false,
          message: "We couldn't find a TeamBoard account with that email address.",
        });
        return;
      }
      resolve({ ok: true });
    }, 1100);
  });
}

type RequestStatus = "idle" | "loading" | "success" | "error";

const panelStagger: Variants = staggerContainer;
const panelItem: Variants = fadeInUp;

const RESET_STEPS = [
  {
    icon: Mail,
    title: "Enter your email",
    description: "Tell us the address you signed up with and we'll look it up.",
  },
  {
    icon: Inbox,
    title: "Check your inbox",
    description: "We'll send a secure, time-limited link to reset your password.",
  },
  {
    icon: KeyRound,
    title: "Choose a new password",
    description: "Follow the link to set a fresh password and get back to work.",
  },
];

/* -------------------------------------------------------------------------- */
/* Form                                                                       */
/* -------------------------------------------------------------------------- */

function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [status, setStatus] = useState<RequestStatus>("idle");
  const [serverMessage, setServerMessage] = useState<string | null>(null);

  const validate = (value: string): string | null => {
    if (!value.trim()) return "Email is required.";
    if (!EMAIL_PATTERN.test(value.trim())) return "Enter a valid email address.";
    return null;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationError = validate(email);
    setFieldError(validationError);
    if (validationError) return;

    setStatus("loading");
    setServerMessage(null);

    try {
      const result = await requestPasswordReset(email);
      if (result.ok) {
        setStatus("success");
      } else {
        setStatus("error");
        setServerMessage(result.message);
      }
    } catch {
      setStatus("error");
      setServerMessage("Something went wrong. Please try again in a moment.");
    }
  };

  const handleReset = () => {
    setStatus("idle");
    setServerMessage(null);
  };

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.12)] sm:p-8"
        role="status"
        aria-live="polite"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--accent)]/10">
          <CheckCircle2 className="h-6 w-6 text-[var(--accent)]" aria-hidden="true" />
        </div>
        <h2 className="mt-4 text-xl font-semibold tracking-tight">Check your email</h2>
        <p className="mt-2 text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">
          If an account exists for <span className="font-medium text-current">{email}</span>, a
          password reset link is on its way. It expires in 30 minutes, so use it soon.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-[hsl(var(--border))] bg-transparent px-4 py-2.5 text-sm font-medium transition-all duration-300 ease-out hover:bg-[hsl(var(--border))]/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Send to a different email
          </button>
          <Link
            href="/login"
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-[var(--accent-foreground,white)] transition-all duration-300 ease-out hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
          >
            Back to login
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.12)] sm:p-8"
    >
      <div>
        <label htmlFor="reset-email" className="text-sm font-medium">
          Email address
        </label>
        <div className="relative mt-2">
          <Mail
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[hsl(var(--muted-foreground))]"
            aria-hidden="true"
          />
          <input
            id="reset-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="you@company.com"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              if (fieldError) setFieldError(null);
              if (status === "error") setStatus("idle");
            }}
            aria-invalid={Boolean(fieldError)}
            aria-describedby={fieldError ? "reset-email-error" : undefined}
            className="w-full rounded-xl border border-[hsl(var(--border))] bg-transparent py-2.5 pl-10 pr-3 text-sm outline-none transition-all duration-300 ease-out placeholder:text-[hsl(var(--muted-foreground))] focus-visible:border-[var(--accent)] focus-visible:ring-2 focus-visible:ring-[var(--accent)]/30"
          />
        </div>
        {fieldError ? (
          <p id="reset-email-error" className="mt-2 flex items-center gap-1.5 text-sm text-red-500">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            {fieldError}
          </p>
        ) : (
          <p className="mt-2 text-xs text-[hsl(var(--muted-foreground))]">
            Use the email you registered with TeamBoard.
          </p>
        )}
      </div>

      {status === "error" && serverMessage ? (
        <div
          role="alert"
          className="mt-4 flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/5 px-3 py-2.5 text-sm text-red-500"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{serverMessage}</span>
        </div>
      ) : null}

      <button
        type="submit"
        disabled={status === "loading"}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-[var(--accent-foreground,white)] transition-all duration-300 ease-out hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {status === "loading" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Sending reset link...
          </>
        ) : (
          <>
            <KeyRound className="h-4 w-4" aria-hidden="true" />
            Send reset link
          </>
        )}
      </button>

      <p className="mt-5 text-center text-sm text-[hsl(var(--muted-foreground))]">
        Try{" "}
        <button
          type="button"
          onClick={() => setEmail("demo@teamboard.app")}
          className="font-medium text-[var(--accent)] underline-offset-2 hover:underline"
        >
          demo@teamboard.app
        </button>{" "}
        to see the success flow.
      </p>
    </form>
  );
}

/* -------------------------------------------------------------------------- */
/* Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function ForgotPasswordPage() {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-7xl flex-col gap-10 px-4 py-12 sm:px-6 lg:flex-row lg:items-stretch lg:gap-16 lg:px-8 lg:py-20">
      <Reveal className="flex flex-1 flex-col justify-center" delay={0}>
        <div className="w-full max-w-md">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[hsl(var(--muted-foreground))] transition-colors duration-300 ease-out hover:text-[var(--accent)]"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to login
          </Link>

          <h1 className="mt-6 text-3xl font-bold tracking-tight text-balance sm:text-4xl">
            Forgot your password?
          </h1>
          <p className="mt-3 text-base leading-relaxed text-[hsl(var(--muted-foreground))] text-pretty">
            No worries, it happens. Enter the email address linked to your {APP_NAME} account and
            we'll send you a link to reset it.
          </p>

          <div className="mt-8">
            <ForgotPasswordForm />
          </div>

          <p className="mt-6 text-center text-sm text-[hsl(var(--muted-foreground))]">
            Don't have an account?{" "}
            <Link href="/signup" className="font-medium text-[var(--accent)] hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </Reveal>

      <Reveal className="hidden flex-1 lg:flex" delay={0.1}>
        <div className="relative flex w-full flex-col justify-between overflow-hidden rounded-3xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-10 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.12)]">
          <div
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[var(--accent)]/15 blur-3xl"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -bottom-28 -left-16 h-64 w-64 rounded-full bg-[var(--accent)]/10 blur-3xl"
            aria-hidden="true"
          />

          <div className="relative">
            <span className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--border))] bg-transparent px-3 py-1 text-xs font-medium text-[hsl(var(--muted-foreground))]">
              <ShieldCheck className="h-3.5 w-3.5 text-[var(--accent)]" aria-hidden="true" />
              Secure account recovery
            </span>
            <h2 className="mt-6 text-2xl font-bold tracking-tight text-balance">
              Get back to your projects in three steps.
            </h2>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">
              {APP_NAME} keeps your projects, tasks, and team activity exactly where you left
              them, we'll help you get back in safely.
            </p>
          </div>

          <motion.ol
            className="relative mt-10 space-y-6"
            variants={panelStagger}
            initial="hidden"
            animate="visible"
          >
            {RESET_STEPS.map((step, index) => {
              const StepIcon = step.icon;
              return (
                <motion.li key={step.title} variants={panelItem} className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[hsl(var(--border))] bg-[var(--accent)]/10 text-sm font-semibold text-[var(--accent)]">
                    {index + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <StepIcon className="h-4 w-4 text-[var(--accent)]" aria-hidden="true" />
                      <p className="text-sm font-semibold">{step.title}</p>
                    </div>
                    <p className="mt-1 text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">
                      {step.description}
                    </p>
                  </div>
                </motion.li>
              );
            })}
          </motion.ol>

          <div className="relative mt-10 rounded-2xl border border-[hsl(var(--border))] bg-transparent p-4 text-xs leading-relaxed text-[hsl(var(--muted-foreground))]">
            Reset links expire after 30 minutes and can only be used once, so your account stays
            protected even if a link is shared by mistake.
          </div>
        </div>
      </Reveal>
    </main>
  );
}