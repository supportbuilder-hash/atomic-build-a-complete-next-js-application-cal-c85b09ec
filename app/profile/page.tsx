"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Camera, Lock, LogOut, Save, CheckCircle2, AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react';
import { ProtectedRoute, useAuth } from "@/lib/auth";
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/utils";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;
const SAVE_SIMULATION_MS = 500;

const PRESET_AVATAR_COLORS = [
  { id: "indigo", bg: "#3730E0" },
  { id: "amber", bg: "#F5A524" },
  { id: "emerald", bg: "#059669" },
  { id: "rose", bg: "#E11D48" },
  { id: "slate", bg: "#334155" },
];

function getInitials(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return "?";
  const parts = trimmed.split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? "" : "";
  return (first + last).toUpperCase() || "?";
}

interface ProfileFormErrors {
  fullName?: string;
  email?: string;
}

interface PasswordFormErrors {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

function ProfileDetailsCard() {
  const { user, updateUser } = useAuth();

  const [fullName, setFullName] = useState(user?.fullName ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl ?? "");
  const [avatarColor, setAvatarColor] = useState<string | undefined>(undefined);
  const [errors, setErrors] = useState<ProfileFormErrors>({});
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setFullName(user.fullName ?? "");
      setEmail(user.email ?? "");
      setAvatarUrl(user.avatarUrl ?? "");
    }
  }, [user]);

  const validate = (): ProfileFormErrors => {
    const nextErrors: ProfileFormErrors = {};
    if (!fullName.trim()) {
      nextErrors.fullName = "Full name is required.";
    }
    if (!email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!EMAIL_PATTERN.test(email.trim())) {
      nextErrors.email = "Enter a valid email address.";
    }
    return nextErrors;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSuccessMessage(null);
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, SAVE_SIMULATION_MS));
    updateUser({ fullName: fullName.trim(), email: email.trim(), avatarUrl: avatarUrl.trim() || undefined });
    setSaving(false);
    setSuccessMessage("Profile updated");
  };

  const handlePresetPick = (colorId: string) => {
    setAvatarColor(colorId);
    setAvatarUrl("");
  };

  const handleAvatarUrlChange = (event: ChangeEvent<HTMLInputElement>) => {
    setAvatarUrl(event.target.value);
    setAvatarColor(undefined);
  };

  const selectedPreset = PRESET_AVATAR_COLORS.find((preset) => preset.id === avatarColor);
  const avatarBg = selectedPreset?.bg ?? "var(--primary)";

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.12)] sm:p-8"
    >
      <h2 className="text-lg font-bold tracking-tight text-[var(--foreground)]">Profile details</h2>
      <p className="mt-1 text-sm leading-relaxed text-[var(--muted-foreground)]">
        Update your name, email, and avatar. These details are visible to your teammates.
      </p>

      <div className="mt-6 flex flex-col items-start gap-6 sm:flex-row">
        <div className="flex flex-col items-center gap-3">
          {avatarUrl.trim() ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatarUrl}
              alt="Avatar preview"
              className="h-20 w-20 rounded-full object-cover ring-2 ring-[var(--border)]"
            />
          ) : (
            <div
              className="flex h-20 w-20 items-center justify-center rounded-full text-xl font-bold text-white ring-2 ring-[var(--border)]"
              style={{ backgroundColor: avatarBg }}
              aria-hidden="true"
            >
              {getInitials(fullName || "?")}
            </div>
          )}
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--muted-foreground)]">
            <Camera className="h-3.5 w-3.5" aria-hidden="true" />
            Change avatar
          </span>
        </div>

        <div className="flex-1 space-y-3">
          <div>
            <label htmlFor="avatarUrl" className="text-xs font-medium text-[var(--muted-foreground)]">
              Paste an image URL
            </label>
            <input
              id="avatarUrl"
              type="text"
              value={avatarUrl}
              onChange={handleAvatarUrlChange}
              placeholder="https://example.com/avatar.jpg"
              className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] transition-colors duration-300 ease-out placeholder:text-[var(--muted-foreground)]/70 focus:border-[var(--primary)] focus:outline-none"
            />
          </div>
          <div>
            <span className="text-xs font-medium text-[var(--muted-foreground)]">Or pick a color</span>
            <div className="mt-1.5 flex gap-2">
              {PRESET_AVATAR_COLORS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handlePresetPick(preset.id)}
                  className={cn(
                    "h-8 w-8 rounded-full ring-2 transition-all duration-300 ease-out",
                    avatarColor === preset.id ? "ring-[var(--primary)]" : "ring-transparent hover:ring-[var(--border)]",
                  )}
                  style={{ backgroundColor: preset.bg }}
                  aria-label={`Use ${preset.id} avatar color`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="fullName" className="text-sm font-medium text-[var(--foreground)]">
            Full name
          </label>
          <div className="relative mt-1.5">
            <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]" aria-hidden="true" />
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className={cn(
                "w-full rounded-lg border bg-[var(--background)] py-2 pl-9 pr-3 text-sm text-[var(--foreground)] transition-colors duration-300 ease-out focus:outline-none",
                errors.fullName ? "border-red-400" : "border-[var(--border)] focus:border-[var(--primary)]",
              )}
            />
          </div>
          {errors.fullName && (
            <p className="mt-1.5 flex items-center gap-1 text-xs text-red-600">
              <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
              {errors.fullName}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="text-sm font-medium text-[var(--foreground)]">
            Email
          </label>
          <div className="relative mt-1.5">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]" aria-hidden="true" />
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={cn(
                "w-full rounded-lg border bg-[var(--background)] py-2 pl-9 pr-3 text-sm text-[var(--foreground)] transition-colors duration-300 ease-out focus:outline-none",
                errors.email ? "border-red-400" : "border-[var(--border)] focus:border-[var(--primary)]",
              )}
            />
          </div>
          {errors.email && (
            <p className="mt-1.5 flex items-center gap-1 text-xs text-red-600">
              <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
              {errors.email}
            </p>
          )}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-full bg-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.25)] transition-all duration-300 ease-out hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <Save className="h-4 w-4" aria-hidden="true" />
          )}
          {saving ? "Saving…" : "Save changes"}
        </button>
        {successMessage && (
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-600">
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
            {successMessage}
          </span>
        )}
      </div>
    </form>
  );
}

function AccountSettingsCard() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<PasswordFormErrors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [serverMessage, setServerMessage] = useState<string | null>(null);

  const validate = (): PasswordFormErrors => {
    const nextErrors: PasswordFormErrors = {};
    if (!currentPassword) {
      nextErrors.currentPassword = "Current password is required.";
    }
    if (!newPassword) {
      nextErrors.newPassword = "New password is required.";
    } else if (newPassword.length < MIN_PASSWORD_LENGTH) {
      nextErrors.newPassword = `New password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
    }
    if (!confirmPassword) {
      nextErrors.confirmPassword = "Please confirm your new password.";
    } else if (newPassword !== confirmPassword) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }
    return nextErrors;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setServerMessage(null);
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setStatus("submitting");
    // NOTE: This is mock authentication with no real backend. We do not persist
    // the new password anywhere — we simply simulate latency and accept any
    // non-empty current password as "correct" for demo purposes.
    await new Promise((resolve) => setTimeout(resolve, 700));

    setStatus("success");
    setServerMessage("Password updated successfully.");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.12)] sm:p-8"
    >
      <h2 className="text-lg font-bold tracking-tight text-[var(--foreground)]">Change password</h2>
      <p className="mt-1 text-sm leading-relaxed text-[var(--muted-foreground)]">
        Update your password to keep your account secure.
      </p>

      <div className="mt-6 space-y-4">
        <PasswordField
          id="currentPassword"
          label="Current password"
          value={currentPassword}
          onChange={setCurrentPassword}
          show={showCurrent}
          onToggleShow={() => setShowCurrent((v) => !v)}
          error={errors.currentPassword}
        />
        <PasswordField
          id="newPassword"
          label="New password"
          value={newPassword}
          onChange={setNewPassword}
          show={showNew}
          onToggleShow={() => setShowNew((v) => !v)}
          error={errors.newPassword}
        />
        <PasswordField
          id="confirmPassword"
          label="Confirm new password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          show={showConfirm}
          onToggleShow={() => setShowConfirm((v) => !v)}
          error={errors.confirmPassword}
        />
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={status === "submitting"}
          className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--background)] px-5 py-2.5 text-sm font-semibold text-[var(--foreground)] transition-all duration-300 ease-out hover:border-[var(--primary)]/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {status === "submitting" ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <Lock className="h-4 w-4" aria-hidden="true" />
          )}
          {status === "submitting" ? "Updating…" : "Update password"}
        </button>
        {status === "success" && serverMessage && (
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-600">
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
            {serverMessage}
          </span>
        )}
        {status === "error" && serverMessage && (
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-red-600">
            <AlertCircle className="h-4 w-4" aria-hidden="true" />
            {serverMessage}
          </span>
        )}
      </div>
    </form>
  );
}

interface PasswordFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  show: boolean;
  onToggleShow: () => void;
  error?: string;
}

function PasswordField({ id, label, value, onChange, show, onToggleShow, error }: PasswordFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium text-[var(--foreground)]">
        {label}
      </label>
      <div className="relative mt-1.5">
        <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]" aria-hidden="true" />
        <input
          id={id}
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            "w-full rounded-lg border bg-[var(--background)] py-2 pl-9 pr-10 text-sm text-[var(--foreground)] transition-colors duration-300 ease-out focus:outline-none",
            error ? "border-red-400" : "border-[var(--border)] focus:border-[var(--primary)]",
          )}
        />
        <button
          type="button"
          onClick={onToggleShow}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] transition-colors duration-300 ease-out hover:text-[var(--foreground)]"
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
        </button>
      </div>
      {error && (
        <p className="mt-1.5 flex items-center gap-1 text-xs text-red-600">
          <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
}

function LogoutSection() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.12)] sm:p-8">
      <h2 className="text-lg font-bold tracking-tight text-[var(--foreground)]">Log out</h2>
      <p className="mt-1 text-sm leading-relaxed text-[var(--muted-foreground)]">
        You are signed in as <span className="font-medium text-[var(--foreground)]">{user?.email}</span>. Logging out
        will end your current session on this device.
      </p>
      <button
        type="button"
        onClick={handleLogout}
        className="mt-5 inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-5 py-2.5 text-sm font-semibold text-red-600 transition-all duration-300 ease-out hover:border-red-300 hover:bg-red-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400"
      >
        <LogOut className="h-4 w-4" aria-hidden="true" />
        Log out
      </button>
    </div>
  );
}

function ProfileContent() {
  return (
    <main className="bg-[var(--background)] text-[var(--foreground)]">
      <section className="relative overflow-hidden px-6 pb-8 pt-16 md:pt-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 right-0 h-72 w-72 rounded-full bg-[var(--accent)]/10 blur-3xl"
        />
        <div className="mx-auto max-w-4xl">
          <Reveal>
            <h1 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">Your profile</h1>
            <p className="mt-3 max-w-xl text-pretty text-base leading-relaxed text-[var(--muted-foreground)]">
              Manage your personal details, security settings, and session for your TeamBoard account.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="mx-auto flex max-w-4xl flex-col gap-6">
          <Reveal>
            <ProfileDetailsCard />
          </Reveal>
          <Reveal delay={0.05}>
            <AccountSettingsCard />
          </Reveal>
          <Reveal delay={0.1}>
            <LogoutSection />
          </Reveal>
        </div>
      </section>
    </main>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}
