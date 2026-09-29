"use client";

import Link from "next/link";
import { LayoutGrid, Columns, Users, MessageSquare, Activity, CheckSquare, Filter, Search, Shield, ArrowRight, Sparkles } from 'lucide-react';
import { Reveal } from "@/components/Reveal";

interface FeatureBlock {
  icon: typeof LayoutGrid;
  title: string;
  description: string;
  bullets: string[];
}

const DEEP_FEATURES: FeatureBlock[] = [
  {
    icon: LayoutGrid,
    title: "Projects & dynamic workspaces",
    description:
      "Every project gets its own dedicated workspace with a unique URL, so teams can bookmark, share, and jump straight into the work that matters. Spin up a new project in seconds and invite the right people from day one.",
    bullets: [
      "Per-project pages with their own tasks, members, and activity",
      "Dynamic routing keeps every project's data isolated and shareable",
      "Switch between projects without losing your place",
    ],
  },
  {
    icon: Columns,
    title: "Kanban task board",
    description:
      "Visualize work as it moves from idea to done. Drag tasks across four clear stages and assign a priority so the team always knows what to tackle first.",
    bullets: [
      "Statuses: Todo, In Progress, Review, Done",
      "Priorities: Low, Medium, High, Urgent with color-coded badges",
      "Create, edit, delete, and complete tasks inline",
    ],
  },
  {
    icon: Filter,
    title: "Filters & search",
    description:
      "Once a board grows past a handful of cards, finding the right task shouldn't take scrolling. Filter by status, priority, or assignee, or just start typing to search titles and descriptions instantly.",
    bullets: [
      "Combine status and priority filters at the same time",
      "Instant keyword search across task titles and descriptions",
      "Filters persist while you work across a project",
    ],
  },
  {
    icon: Users,
    title: "Team members & roles",
    description:
      "Bring your whole team into a project with role-based permissions that keep ownership clear. Owners manage the project, Admins keep things moving, and Members focus on their tasks.",
    bullets: [
      "Roles: Owner, Admin, and Member",
      "See every teammate's avatar, role, and assigned work at a glance",
      "Assign tasks directly to any team member",
    ],
  },
  {
    icon: MessageSquare,
    title: "Comments on tasks",
    description:
      "Keep context where the work happens. Discuss blockers, share updates, and leave feedback directly on a task instead of losing decisions in a separate chat app.",
    bullets: [
      "Threaded comments attached to each task",
      "Author and timestamp on every message",
      "Comment history stays with the task permanently",
    ],
  },
  {
    icon: Activity,
    title: "Activity feed",
    description:
      "A live log of everything happening across a project. From status changes to new comments, the activity feed gives everyone a shared source of truth without needing a status meeting.",
    bullets: [
      "Chronological log of task, comment, and member changes",
      "Attributed to the teammate who made the change",
      "Scoped per project so context never gets lost",
    ],
  },
];

const VALUE_STATS: { value: string; label: string }[] = [
  { value: "3.4x", label: "Faster sprint planning for teams that switch to TeamBoard" },
  { value: "48k+", label: "Tasks tracked and completed across active workspaces" },
  { value: "96%", label: "Of projects delivered on schedule with clear ownership" },
];

export default function FeaturesPage() {
  return (
    <main className="bg-[var(--background)] text-[var(--foreground)]">
      {/* HERO */}
      <Reveal>
        <section className="relative overflow-hidden px-6 pt-20 pb-20 md:pt-28 md:pb-24">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-32 right-0 h-96 w-96 rounded-full bg-[var(--accent)]/10 blur-3xl"
          />
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card)] px-4 py-1.5 text-sm font-medium text-[var(--muted-foreground)]">
              <Sparkles className="h-4 w-4 text-[var(--accent)]" aria-hidden="true" />
              Everything you need
            </span>
            <h1 className="mt-6 text-balance text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Built for how modern teams actually work
            </h1>
            <p className="mt-6 text-pretty text-lg leading-relaxed text-[var(--muted-foreground)]">
              TeamBoard brings projects, tasks, people, and conversations into one shared
              workspace, so your team spends less time coordinating and more time shipping.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-[var(--accent-foreground)] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.25)] transition-all duration-300 ease-out hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
              >
                Get started free
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card)] px-6 py-3 text-sm font-semibold transition-all duration-300 ease-out hover:border-[var(--accent)]/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
              >
                View pricing
              </Link>
            </div>
          </div>
        </section>
      </Reveal>

      {/* VALUE PROP / STATS */}
      <Reveal>
        <section className="border-y border-[var(--border)] bg-[var(--card)] px-6 py-16">
          <div className="mx-auto grid max-w-5xl gap-10 sm:grid-cols-3">
            {VALUE_STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-4xl font-bold tracking-tight text-[var(--primary)]">{stat.value}</p>
                <p className="mt-2 text-sm leading-relaxed text-[var(--muted-foreground)]">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      {/* DEEP FEATURE SECTIONS */}
      <section className="px-6 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card)] px-4 py-1.5 text-sm font-medium text-[var(--muted-foreground)]">
                <CheckSquare className="h-4 w-4 text-[var(--accent)]" aria-hidden="true" />
                Feature breakdown
              </span>
              <h2 className="mt-6 text-balance text-3xl font-bold tracking-tight sm:text-4xl">
                Every part of your workflow, covered
              </h2>
              <p className="mt-4 text-pretty leading-relaxed text-[var(--muted-foreground)]">
                From the first task to a shipped release, TeamBoard keeps projects organized,
                visible, and easy to collaborate on.
              </p>
            </div>
          </Reveal>

          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {DEEP_FEATURES.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Reveal key={feature.title} delay={(index % 2) * 0.08}>
                  <div className="flex h-full flex-col rounded-2xl border border-[var(--border)] bg-[var(--card)] p-7 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.12)] transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_1px_2px_rgba(0,0,0,0.06),0_16px_32px_-12px_rgba(0,0,0,0.18)]">
                    <span className="flex h-11 w-11 items-center justify-center rounded-[10px] bg-[var(--primary)]/10 text-[var(--primary)]">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <h3 className="mt-5 text-lg font-semibold tracking-tight">{feature.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--muted-foreground)]">
                      {feature.description}
                    </p>
                    <ul className="mt-4 flex flex-1 flex-col gap-2">
                      {feature.bullets.map((bullet) => (
                        <li
                          key={bullet}
                          className="flex items-start gap-2 text-sm leading-relaxed text-[var(--foreground)]"
                        >
                          <CheckSquare
                            className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent)]"
                            aria-hidden="true"
                          />
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* SEARCH + SHIELD HIGHLIGHT STRIP */}
      <Reveal>
        <section className="border-y border-[var(--border)] bg-[var(--card)] px-6 py-16">
          <div className="mx-auto grid max-w-5xl gap-10 sm:grid-cols-2">
            <div className="flex items-start gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] bg-[var(--accent)]/10 text-[var(--accent)]">
                <Search className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <h3 className="text-base font-semibold tracking-tight">Find anything in seconds</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--muted-foreground)]">
                  Search spans every task in a project, so nothing gets buried once your backlog
                  grows past a few dozen cards.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] bg-[var(--accent)]/10 text-[var(--accent)]">
                <Shield className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <h3 className="text-base font-semibold tracking-tight">Access that matches your team</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--muted-foreground)]">
                  Role-based permissions mean Owners and Admins can manage a project's structure
                  while Members stay focused on their own tasks.
                </p>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      {/* FINAL CTA */}
      <Reveal>
        <section className="px-6 py-20 md:py-28">
          <div className="mx-auto max-w-4xl rounded-2xl bg-[var(--primary)] px-8 py-14 text-center shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.25)] sm:px-14">
            <h2 className="text-balance text-3xl font-bold tracking-tight text-[var(--accent-foreground)] sm:text-4xl">
              Ready to transform your workflow?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-pretty leading-relaxed text-white/80">
              Join thousands of teams shipping faster with TeamBoard. Get started free, no
              credit card required.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-[var(--accent-foreground)] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.25)] transition-all duration-300 ease-out hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
              >
                Get started free
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-transparent px-6 py-3 text-sm font-semibold text-white transition-all duration-300 ease-out hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                View pricing
              </Link>
            </div>
          </div>
        </section>
      </Reveal>
    </main>
  );
}
