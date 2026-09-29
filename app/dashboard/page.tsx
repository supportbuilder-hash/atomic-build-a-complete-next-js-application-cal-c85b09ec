"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LayoutGrid, Folder, CheckSquare, Users, Activity, Plus, ArrowRight } from 'lucide-react';
import { Reveal } from "@/components/Reveal";
import { useAuth, ProtectedRoute, LoadingSpinner } from "@/lib/auth";

/* -------------------------------------------------------------------------- */
/* Mock dashboard data (architecture-ready to be swapped for real API calls) */
/* -------------------------------------------------------------------------- */

interface DashboardProject {
  id: string;
  name: string;
  description: string;
  memberInitials: string[];
  tasksByStatus: {
    todo: number;
    inProgress: number;
    review: number;
    done: number;
  };
}

const DASHBOARD_PROJECTS: DashboardProject[] = [
  {
    id: "project-1",
    name: "Website Redesign",
    description: "Refresh the marketing site with a new visual system and faster page loads.",
    memberInitials: ["JB", "MC", "AR"],
    tasksByStatus: { todo: 4, inProgress: 3, review: 2, done: 7 },
  },
  {
    id: "project-2",
    name: "Mobile App Launch",
    description: "Ship the v1.0 iOS and Android apps, including onboarding and push notifications.",
    memberInitials: ["PS", "JB"],
    tasksByStatus: { todo: 6, inProgress: 2, review: 1, done: 3 },
  },
  {
    id: "project-3",
    name: "Q3 Marketing Campaign",
    description: "Plan and execute the Q3 multi-channel campaign across email, social, and paid.",
    memberInitials: ["AR", "MC", "PS", "JB"],
    tasksByStatus: { todo: 5, inProgress: 4, review: 0, done: 9 },
  },
];

interface DashboardActivityItem {
  id: string;
  actor: string;
  action: string;
  target: string;
  time: string;
}

const RECENT_ACTIVITY: DashboardActivityItem[] = [
  { id: "act-1", actor: "Maya Chen", action: "completed", target: "Finalize homepage hero copy", time: "12m ago" },
  { id: "act-2", actor: "Priya Shah", action: "moved to Review", target: "Checkout flow redesign", time: "48m ago" },
  { id: "act-3", actor: "Alex Rivera", action: "commented on", target: "API rate limit handling", time: "1h ago" },
  { id: "act-4", actor: "Jordan Blake", action: "created", target: "Q3 Marketing Campaign", time: "3h ago" },
  { id: "act-5", actor: "Maya Chen", action: "assigned", target: "App Store screenshots to Priya Shah", time: "5h ago" },
];

function totalTasksFor(project: DashboardProject): number {
  const { todo, inProgress, review, done } = project.tasksByStatus;
  return todo + inProgress + review + done;
}

function DashboardContent() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const totalProjects = DASHBOARD_PROJECTS.length;
  const tasksInProgress = DASHBOARD_PROJECTS.reduce((sum, p) => sum + p.tasksByStatus.inProgress, 0);
  const tasksDone = DASHBOARD_PROJECTS.reduce((sum, p) => sum + p.tasksByStatus.done, 0);
  const teamMembers = new Set(DASHBOARD_PROJECTS.flatMap((p) => p.memberInitials)).size;

  const stats = [
    { label: "Total Projects", value: totalProjects, icon: Folder },
    { label: "Tasks in Progress", value: tasksInProgress, icon: LayoutGrid },
    { label: "Tasks Done", value: tasksDone, icon: CheckSquare },
    { label: "Team Members", value: teamMembers, icon: Users },
  ];

  const firstName = user?.fullName?.split(" ")[0] ?? "there";

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <main className="bg-[var(--background)] text-[var(--foreground)]">
      {/* HERO / WELCOME HEADER */}
      <Reveal>
        <section className="relative overflow-hidden px-6 pt-14 pb-10 md:pt-20 md:pb-14">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-32 right-0 h-80 w-80 rounded-full bg-[var(--accent)]/10 blur-3xl"
          />
          <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-4 py-1.5 text-sm font-medium text-[hsl(var(--muted-foreground))]">
                <LayoutGrid className="h-4 w-4 text-[var(--accent)]" aria-hidden="true" />
                Dashboard
              </span>
              <h1 className="mt-4 text-balance text-3xl font-bold tracking-tight sm:text-4xl">
                Welcome back, {firstName}
              </h1>
              <p className="mt-3 max-w-xl text-pretty text-base leading-relaxed text-[hsl(var(--muted-foreground))]">
                Here&apos;s what&apos;s happening across your projects today.
              </p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-5 py-2.5 text-sm font-semibold transition-all duration-300 ease-out hover:border-[var(--primary)]/40 hover:text-[var(--primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]"
            >
              Log out
            </button>
          </div>
        </section>
      </Reveal>

      {/* STATS ROW */}
      <Reveal>
        <section className="px-6 pb-14">
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.12)]"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[var(--primary)]/10 text-[var(--primary)]">
                  <stat.icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <p className="mt-4 text-2xl font-bold tracking-tight">{stat.value}</p>
                <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      {/* PROJECTS */}
      <Reveal>
        <section className="border-t border-[var(--border)] bg-[var(--card)] px-6 py-16 md:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Your projects</h2>
                <p className="mt-2 text-sm text-[hsl(var(--muted-foreground))]">
                  Jump back into an active project or start something new.
                </p>
              </div>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-[var(--accent-foreground)] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.25)] transition-all duration-300 ease-out hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
                New project
              </button>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
              {DASHBOARD_PROJECTS.map((project) => {
                const total = totalTasksFor(project);
                const donePercent = total > 0 ? Math.round((project.tasksByStatus.done / total) * 100) : 0;
                return (
                  <Link
                    key={project.id}
                    href={`/projects/${project.id}`}
                    className="group flex flex-col rounded-2xl border border-[hsl(var(--border))] bg-[var(--background)] p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.12)] transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[var(--primary)]/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[var(--primary)] text-white">
                      <Folder className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <h3 className="mt-4 text-lg font-bold tracking-tight">{project.name}</h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">
                      {project.description}
                    </p>

                    <div className="mt-5 h-2 w-full overflow-hidden rounded-full bg-[hsl(var(--border))]">
                      <div
                        className="h-full rounded-full bg-[var(--accent)]"
                        style={{ width: `${donePercent}%` }}
                      />
                    </div>
                    <p className="mt-2 text-xs text-[hsl(var(--muted-foreground))]">
                      {project.tasksByStatus.done} of {total} tasks done
                    </p>

                    <div className="mt-5 flex items-center justify-between">
                      <div className="flex -space-x-2">
                        {project.memberInitials.map((initials) => (
                          <span
                            key={initials}
                            className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[var(--background)] bg-[var(--primary)]/10 text-xs font-semibold text-[var(--primary)]"
                          >
                            {initials}
                          </span>
                        ))}
                      </div>
                      <span className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--primary)]">
                        Open
                        <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-out group-hover:translate-x-1" aria-hidden="true" />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      </Reveal>

      {/* RECENT ACTIVITY */}
      <Reveal>
        <section className="px-6 py-16 md:py-20">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.2fr_1fr]">
            <div>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Recent activity</h2>
              <p className="mt-2 text-sm text-[hsl(var(--muted-foreground))]">
                A live look at what your team has been working on.
              </p>
              <ul className="mt-6 flex flex-col gap-4">
                {RECENT_ACTIVITY.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-start gap-4 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.12)]"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--primary)]/10 text-[var(--primary)]">
                      <Activity className="h-4 w-4" aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm leading-relaxed">
                        <span className="font-semibold">{item.actor}</span>{" "}
                        <span className="text-[hsl(var(--muted-foreground))]">{item.action}</span>{" "}
                        <span className="font-medium">{item.target}</span>
                      </p>
                      <p className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">{item.time}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col justify-between rounded-2xl border border-[hsl(var(--border))] bg-[var(--primary)] p-6 text-white shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.25)]">
              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-white/10">
                  <Users className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="mt-4 text-lg font-bold tracking-tight">Manage your account</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/80">
                  Update your name, email, avatar, and password from your profile settings.
                </p>
              </div>
              <Link
                href="/profile"
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[var(--primary)] transition-all duration-300 ease-out hover:brightness-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                View profile
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      </Reveal>
    </main>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute fallback={<LoadingSpinner />}>
      <DashboardContent />
    </ProtectedRoute>
  );
}
