"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Sparkles, ArrowRight, Folder, Check, User, Mail, Activity, Search, Circle, Clock, Eye, ChevronRight } from 'lucide-react';
import { Reveal } from "@/components/Reveal";
interface TaskStatusOption {
  value: string;
  label: string;
}
const TASK_STATUSES: TaskStatusOption[] = [
  { value: "todo", label: "Todo" },
  { value: "in_progress", label: "In Progress" },
  { value: "review", label: "Review" },
  { value: "done", label: "Done" },
];
import { cn } from "@/lib/utils";

const FEATURE_ICONS = [Folder, Check, User, Mail, Activity, Search];
const STATUS_ICONS = [Circle, Clock, Eye, Check];

export default function HomePage() {
  const t = useTranslations();

  const heroStats = (Array.isArray(t.raw("home.hero.stats")) ? t.raw("home.hero.stats") : []) as {
    value: string;
    label: string;
  }[];

  const mockColumns = (Array.isArray(t.raw("home.hero.mockColumns")) ? t.raw("home.hero.mockColumns") : []) as string[];
  const mockCards = (Array.isArray(t.raw("home.hero.mockCards")) ? t.raw("home.hero.mockCards") : []) as string[];
  const mockColumnCards = [mockCards.slice(0, 2), mockCards.slice(2, 4), mockCards.slice(4, 5)];

  const featureItems = (Array.isArray(t.raw("home.features.items")) ? t.raw("home.features.items") : []) as {
    title: string;
    description: string;
  }[];

  const workflowSteps = (Array.isArray(t.raw("home.workflow.steps")) ? t.raw("home.workflow.steps") : []) as {
    description: string;
  }[];

  const activityItems = (Array.isArray(t.raw("home.activity.items")) ? t.raw("home.activity.items") : []) as {
    actor: string;
    action: string;
    target: string;
    time: string;
  }[];

  const teamMembers = (Array.isArray(t.raw("home.activity.team")) ? t.raw("home.activity.team") : []) as {
    name: string;
    role: string;
  }[];

  return (
    <main className="bg-[var(--background)] text-[var(--foreground)]">
      {/* HERO */}
      <Reveal>
        <section id="hero" className="relative overflow-hidden px-6 pt-20 pb-24 md:pt-28 md:pb-32">
          <div aria-hidden="true" className="pointer-events-none absolute -top-32 right-0 h-96 w-96 rounded-full bg-[var(--accent)]/10 blur-3xl" />
          <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-[1.05fr_1fr] lg:items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-4 py-1.5 text-sm font-medium text-[hsl(var(--muted-foreground))]">
                <Sparkles className="h-4 w-4 text-[var(--accent)]" aria-hidden="true" />
                {t("home.hero.badge")}
              </span>
              <h1 className="mt-6 text-balance text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                {t("home.hero.title")}
              </h1>
              <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-[hsl(var(--muted-foreground))]">
                {t("home.hero.subtitle")}
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link href="/signup" className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-[var(--accent-foreground)] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.25)] transition-all duration-300 ease-out hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]">
                  {t("home.hero.ctaPrimary")}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <a href="#features" className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-6 py-3 text-sm font-semibold transition-all duration-300 ease-out hover:border-[var(--accent)]/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]">
                  {t("home.hero.ctaSecondary")}
                </a>
              </div>
              <div className="mt-10 grid grid-cols-3 gap-4 border-t border-[hsl(var(--border))] pt-6">
                {heroStats.map((s, i) => (
                  <div key={i}>
                    <div className="text-2xl font-bold text-[var(--accent)]">{s.value}</div>
                    <div className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <motion.div initial={{ opacity: 0, y: 30, rotate: -1 }} animate={{ opacity: 1, y: 0, rotate: 0 }} transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }} className="relative">
              <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.16)]">
                <div className="flex items-center justify-between border-b border-[hsl(var(--border))] pb-3">
                  <span className="text-sm font-semibold">{t("home.hero.mockProject")}</span>
                  <span className="flex -space-x-2">
                    {teamMembers.slice(0, 3).map((m, i) => (
                      <span key={i} className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-[hsl(var(--card))] bg-[var(--accent)]/20 text-xs font-semibold text-[var(--accent)]">
                        {m.name.charAt(0)}
                      </span>
                    ))}
                  </span>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-3">
                  {mockColumns.map((col, colIdx) => (
                    <div key={colIdx} className="space-y-2">
                      <div className="text-xs font-semibold uppercase tracking-wide text-[hsl(var(--muted-foreground))]">
                        {col}
                      </div>
                      {mockColumnCards[colIdx]?.map((card, cardIdx) => (
                        <div key={cardIdx} className="rounded-xl border border-[hsl(var(--border))] bg-[var(--background)] p-2.5 text-xs font-medium leading-snug shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                          {card}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </Reveal>
      {/* FEATURES - bento grid */}
      <Reveal>
        <section id="features" className="px-6 py-24 md:py-32">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-2xl">
              <span className="text-sm font-semibold uppercase tracking-wide text-[var(--accent)]">
                {t("home.features.eyebrow")}
              </span>
              <h2
                className="mt-3 text-balance text-3xl font-bold tracking-tight sm:text-4xl"
                style={{
                  color: "#f97316"
                }}>
                {t("home.features.title")}
              </h2>
              <p className="mt-4 text-pretty text-lg leading-relaxed text-[hsl(var(--muted-foreground))]">
                {t("home.features.subtitle")}
              </p>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2">
              {featureItems.map((f, i) => {
                const Icon = FEATURE_ICONS[i] ?? Folder;
                const big = i === 0;
                return (
                  <Reveal key={f.title} delay={i * 0.06} className={big ? "lg:col-span-2 lg:row-span-2" : ""}>
                    <div
                      className={cn(
                        "flex h-full flex-col rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_1px_2px_rgba(0,0,0,0.04),0_16px_32px_-12px_rgba(0,0,0,0.18)]",
                        big && "justify-between",
                      )}>
                      <div>
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--accent)]/10">
                          <Icon className="h-5 w-5 text-[var(--accent)]" aria-hidden="true" />
                        </div>
                        <h3 className={cn("mt-4 font-semibold", big ? "text-xl" : "text-base")}>{f.title}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">
                          {f.description}
                        </p>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>
      </Reveal>
      {/* WORKFLOW - status pipeline */}
      <Reveal>
        <section id="workflow" className="border-y border-[hsl(var(--border))] bg-[hsl(var(--card))] px-6 py-24 md:py-32">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-2xl">
              <span className="text-sm font-semibold uppercase tracking-wide text-[var(--accent)]">
                {t("home.workflow.eyebrow")}
              </span>
              <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight sm:text-4xl">
                {t("home.workflow.title")}
              </h2>
              <p className="mt-4 text-pretty text-lg leading-relaxed text-[hsl(var(--muted-foreground))]">
                {t("home.workflow.subtitle")}
              </p>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {TASK_STATUSES.map((status: TaskStatusOption, i: number) => {
                const Icon = STATUS_ICONS[i] ?? Circle;
                const description = workflowSteps[i]?.description ?? "";
                return (
                  <Reveal key={status.value} delay={i * 0.08}>
                    <div className="relative flex h-full flex-col rounded-2xl border border-[hsl(var(--border))] bg-[var(--background)] p-6">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--accent)]/10">
                        <Icon className="h-5 w-5 text-[var(--accent)]" aria-hidden="true" />
                      </div>
                      <h3 className="mt-4 font-semibold">{status.label}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">
                        {description}
                      </p>
                      {i < TASK_STATUSES.length - 1 && (
                        <ChevronRight
                          aria-hidden="true"
                          className="absolute -right-3 top-1/2 hidden h-6 w-6 -translate-y-1/2 text-[hsl(var(--muted-foreground))]/40 lg:block"
                        />
                      )}
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>
      </Reveal>
      {/* ACTIVITY + TEAM */}
      <Reveal>
        <section id="activity" className="px-6 py-24 md:py-32">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-2xl">
              <span className="text-sm font-semibold uppercase tracking-wide text-[var(--accent)]">
                {t("home.activity.eyebrow")}
              </span>
              <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight sm:text-4xl">
                {t("home.activity.title")}
              </h2>
              <p className="mt-4 text-pretty text-lg leading-relaxed text-[hsl(var(--muted-foreground))]">
                {t("home.activity.subtitle")}
              </p>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-[1.4fr_1fr]">
              <Reveal className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6">
                <ol className="space-y-5">
                  {activityItems.map((item, i) => (
                    <li key={i} className="flex gap-4">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--accent)]/10 text-xs font-semibold text-[var(--accent)]">
                        {item.actor.charAt(0)}
                      </div>
                      <div className="min-w-0 flex-1 border-b border-[hsl(var(--border))] pb-5 last:border-none last:pb-0">
                        <p className="text-sm leading-relaxed">
                          <span className="font-semibold">{item.actor}</span>{" "}
                          <span className="text-[hsl(var(--muted-foreground))]">{item.action}</span>{" "}
                          <span className="font-medium">{item.target}</span>
                        </p>
                        <span className="mt-1 inline-flex items-center gap-1 text-xs text-[hsl(var(--muted-foreground))]">
                          <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                          {item.time}
                        </span>
                      </div>
                    </li>
                  ))}
                </ol>
              </Reveal>

              <Reveal delay={0.1} className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-[hsl(var(--muted-foreground))]">
                  {t("home.activity.teamTitle")}
                </h3>
                <ul className="mt-4 space-y-4">
                  {teamMembers.map((m, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--accent)]/10">
                        <User className="h-4 w-4 text-[var(--accent)]" aria-hidden="true" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{m.name}</p>
                        <p className="text-xs text-[hsl(var(--muted-foreground))]">{m.role}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </div>
        </section>
      </Reveal>
      {/* CTA */}
      <Reveal>
        <section id="cta" className="px-6 pb-24 md:pb-32">
          <div className="mx-auto max-w-5xl rounded-2xl border border-[var(--accent)]/25 bg-[var(--accent)]/5 px-6 py-14 text-center sm:px-14">
            <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">{t("home.cta.title")}</h2>
            <p className="mx-auto mt-4 max-w-xl text-pretty text-lg leading-relaxed text-[hsl(var(--muted-foreground))]">
              {t("home.cta.subtitle")}
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link href="/signup" className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-[var(--accent-foreground)] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.25)] transition-all duration-300 ease-out hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]">
                {t("home.cta.primary")}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link href="/login" className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-6 py-3 text-sm font-semibold transition-all duration-300 ease-out hover:border-[var(--accent)]/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]">
                {t("home.cta.secondary")}
              </Link>
            </div>
          </div>
        </section>
      </Reveal>
    </main>
  );
}