// Shared brand constants, navigation source of truth, and cross-cutting
// TypeScript types for TeamBoard. Individual pages own their own mock data
// arrays; this file only holds structural types + the single navLinks list.

export const BRAND = {
  name: "TeamBoard",
  tagline: "Plan projects, assign tasks, and track progress together.",
} as const;

export interface NavLink {
  label: string;
  href: string;
  /** Stable slug used for i18n lookup — never derive a key at runtime. */
  key: string;
}

// Single source of truth for every nav/footer link. Add new routes here only.
export const navLinks: NavLink[] = [
  { label: "Home", href: "/", key: "home" },
  { label: "Features", href: "/features", key: "features" },
  { label: "Pricing", href: "/pricing", key: "pricing" },
  { label: "Dashboard", href: "/dashboard", key: "dashboard" },
  { label: "Log in", href: "/login", key: "login" },
  { label: "Sign up", href: "/signup", key: "signup" },
];

// ---------------------------------------------------------------------------
// Shared domain types used across auth, dashboard, projects, tasks, etc.
// ---------------------------------------------------------------------------

export type TaskStatus = "todo" | "in_progress" | "review" | "done";
export type TaskPriority = "low" | "medium" | "high" | "urgent";
export type TeamRole = "Owner" | "Admin" | "Member";

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role?: string;
}

export interface TeamMember {
  id: string;
  userId: string;
  name: string;
  email: string;
  role: TeamRole;
  avatarUrl?: string;
}

export interface Comment {
  id: string;
  taskId: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: string;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId?: string;
  assigneeName?: string;
  dueDate?: string;
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  memberIds: string[];
}

export interface ActivityItem {
  id: string;
  projectId?: string;
  actorName: string;
  action: string;
  target: string;
  createdAt: string;
}
