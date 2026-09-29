"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ProtectedRoute } from "@/lib/auth";
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/utils";
import type { Task, TaskStatus, TaskPriority, TeamMember, ActivityItem } from "@/lib/data";
import { Plus, X, Search, Filter, Trash2, Pencil, Check, Circle, Clock, Eye, CheckCircle2, Users, Activity, ArrowLeft, ChevronDown } from 'lucide-react';

/* -------------------------------------------------------------------------- */
/* Mock project data (self-contained — architecture ready for a real API)    */
/* -------------------------------------------------------------------------- */

const PROJECT = {
  id: "project-1",
  name: "Website Redesign",
  description:
    "Full overhaul of the marketing site, including a new visual identity, faster page loads, and a refreshed content structure.",
  createdAt: "2024-01-08T09:00:00.000Z",
};

const initialTeamMembers: TeamMember[] = [
  { id: "tm_1", userId: "usr_1", name: "Maya Chen", email: "maya@teamboard.app", role: "Owner" },
  { id: "tm_2", userId: "usr_2", name: "Jordan Blake", email: "jordan@teamboard.app", role: "Admin" },
  { id: "tm_3", userId: "usr_3", name: "Priya Nair", email: "priya@teamboard.app", role: "Member" },
  { id: "tm_4", userId: "usr_4", name: "Sam Ortiz", email: "sam@teamboard.app", role: "Member" },
  { id: "tm_5", userId: "usr_5", name: "Ella Novak", email: "ella@teamboard.app", role: "Member" },
];

const initialTasks: Task[] = [
  {
    id: "task_1",
    projectId: "project-1",
    title: "Design homepage mockups",
    description: "Explore three directions for the new hero section and navigation.",
    status: "in_progress",
    priority: "high",
    assigneeName: "Maya Chen",
    dueDate: "2024-06-14",
    createdAt: "2024-06-01T09:00:00.000Z",
  },
  {
    id: "task_2",
    projectId: "project-1",
    title: "Audit current site content",
    description: "Inventory every page and flag outdated copy for rewrite.",
    status: "done",
    priority: "medium",
    assigneeName: "Priya Nair",
    dueDate: "2024-06-05",
    createdAt: "2024-05-28T09:00:00.000Z",
  },
  {
    id: "task_3",
    projectId: "project-1",
    title: "Set up design tokens",
    description: "Define color, spacing, and type scale in Figma and code.",
    status: "todo",
    priority: "medium",
    assigneeName: "Sam Ortiz",
    dueDate: "2024-06-18",
    createdAt: "2024-06-02T09:00:00.000Z",
  },
  {
    id: "task_4",
    projectId: "project-1",
    title: "Fix broken pricing page links",
    description: "Two CTAs on the pricing page 404 in staging.",
    status: "review",
    priority: "urgent",
    assigneeName: "Jordan Blake",
    dueDate: "2024-06-10",
    createdAt: "2024-06-03T09:00:00.000Z",
  },
  {
    id: "task_5",
    projectId: "project-1",
    title: "Write launch announcement",
    description: "Draft the blog post and email for the redesign launch.",
    status: "todo",
    priority: "low",
    assigneeName: "Ella Novak",
    dueDate: "2024-06-22",
    createdAt: "2024-06-04T09:00:00.000Z",
  },
  {
    id: "task_6",
    projectId: "project-1",
    title: "Optimize image assets",
    description: "Compress and convert hero images to WebP.",
    status: "in_progress",
    priority: "medium",
    assigneeName: "Sam Ortiz",
    dueDate: "2024-06-16",
    createdAt: "2024-06-05T09:00:00.000Z",
  },
  {
    id: "task_7",
    projectId: "project-1",
    title: "QA cross-browser testing",
    description: "Verify layout in Safari, Firefox, and Edge.",
    status: "review",
    priority: "high",
    assigneeName: "Maya Chen",
    dueDate: "2024-06-19",
    createdAt: "2024-06-06T09:00:00.000Z",
  },
  {
    id: "task_8",
    projectId: "project-1",
    title: "Migrate blog to new CMS",
    description: "Move existing posts and redirects to the new content system.",
    status: "done",
    priority: "high",
    assigneeName: "Jordan Blake",
    dueDate: "2024-06-01",
    createdAt: "2024-05-20T09:00:00.000Z",
  },
  {
    id: "task_9",
    projectId: "project-1",
    title: "Accessibility pass on forms",
    description: "Add labels, focus states, and keyboard navigation.",
    status: "todo",
    priority: "urgent",
    assigneeName: "Priya Nair",
    dueDate: "2024-06-20",
    createdAt: "2024-06-07T09:00:00.000Z",
  },
];

const activityLog: ActivityItem[] = [
  { id: "act_1", projectId: "project-1", actorName: "Maya Chen", action: "moved", target: "Design homepage mockups to In Progress", createdAt: "2024-06-10T14:20:00.000Z" },
  { id: "act_2", projectId: "project-1", actorName: "Priya Nair", action: "completed", target: "Audit current site content", createdAt: "2024-06-09T11:05:00.000Z" },
  { id: "act_3", projectId: "project-1", actorName: "Jordan Blake", action: "flagged", target: "Fix broken pricing page links as urgent", createdAt: "2024-06-08T16:42:00.000Z" },
  { id: "act_4", projectId: "project-1", actorName: "Sam Ortiz", action: "created", target: "Set up design tokens", createdAt: "2024-06-07T09:30:00.000Z" },
  { id: "act_5", projectId: "project-1", actorName: "Ella Novak", action: "commented on", target: "Write launch announcement", createdAt: "2024-06-06T13:15:00.000Z" },
  { id: "act_6", projectId: "project-1", actorName: "Maya Chen", action: "assigned", target: "QA cross-browser testing to herself", createdAt: "2024-06-05T10:00:00.000Z" },
  { id: "act_7", projectId: "project-1", actorName: "Jordan Blake", action: "completed", target: "Migrate blog to new CMS", createdAt: "2024-06-01T17:50:00.000Z" },
  { id: "act_8", projectId: "project-1", actorName: "Priya Nair", action: "created", target: "Accessibility pass on forms", createdAt: "2024-05-31T08:12:00.000Z" },
];

/* -------------------------------------------------------------------------- */
/* Static config                                                              */
/* -------------------------------------------------------------------------- */

const STATUS_COLUMNS: { status: TaskStatus; label: string; icon: typeof Circle }[] = [
  { status: "todo", label: "Todo", icon: Circle },
  { status: "in_progress", label: "In Progress", icon: Clock },
  { status: "review", label: "Review", icon: Eye },
  { status: "done", label: "Done", icon: CheckCircle2 },
];

const STATUS_LABELS: Record<TaskStatus, string> = {
  todo: "Todo",
  in_progress: "In Progress",
  review: "Review",
  done: "Done",
};

const PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  urgent: "Urgent",
};

const PRIORITY_STYLES: Record<TaskPriority, string> = {
  low: "bg-gray-100 text-gray-600 border border-gray-200",
  medium: "bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/20",
  high: "bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/30",
  urgent: "bg-red-50 text-red-600 border border-red-200",
};

const AVATAR_COLORS: string[] = [
  "bg-[var(--primary)]",
  "bg-[var(--accent)]",
  "bg-emerald-500",
  "bg-rose-500",
  "bg-violet-500",
];

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? "" : "";
  return `${first}${last}`.toUpperCase();
}

function avatarColorFor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash + name.charCodeAt(i)) % AVATAR_COLORS.length;
  }
  return AVATAR_COLORS[hash] ?? AVATAR_COLORS[0] ?? "bg-[var(--primary)]";
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return "No due date";
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return "No due date";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return "";
  const diffMs = Date.now() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffHours < 1) return "Just now";
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

/* -------------------------------------------------------------------------- */
/* Task form (create/edit modal)                                              */
/* -------------------------------------------------------------------------- */

interface TaskFormValues {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeName: string;
  dueDate: string;
}

const EMPTY_FORM: TaskFormValues = {
  title: "",
  description: "",
  status: "todo",
  priority: "medium",
  assigneeName: "",
  dueDate: "",
};

interface TaskModalProps {
  initialValues: TaskFormValues;
  isEditing: boolean;
  teamMembers: TeamMember[];
  onClose: () => void;
  onSubmit: (values: TaskFormValues) => void;
}

function TaskModal({ initialValues, isEditing, teamMembers, onClose, onSubmit }: TaskModalProps) {
  const [values, setValues] = useState<TaskFormValues>(initialValues);
  const [titleError, setTitleError] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!values.title.trim()) {
      setTitleError("Title is required.");
      return;
    }
    onSubmit(values);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-8"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-lg rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_20px_48px_-12px_rgba(0,0,0,0.25)]">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold tracking-tight text-[var(--foreground)]">
            {isEditing ? "Edit task" : "Create task"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-md p-1 text-[var(--muted-foreground)] transition-colors duration-300 ease-out hover:text-[var(--foreground)]"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[var(--foreground)]">Task title</label>
            <input
              type="text"
              value={values.title}
              onChange={(e) => {
                setValues((prev) => ({ ...prev, title: e.target.value }));
                if (titleError) setTitleError(null);
              }}
              placeholder="e.g. Design homepage mockups"
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] outline-none transition-colors duration-300 ease-out focus:border-[var(--primary)]"
            />
            {titleError && <p className="mt-1 text-xs text-red-600">{titleError}</p>}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-[var(--foreground)]">Task details</label>
            <textarea
              value={values.description}
              onChange={(e) => setValues((prev) => ({ ...prev, description: e.target.value }))}
              rows={3}
              placeholder="Optional details"
              className="w-full resize-none rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] outline-none transition-colors duration-300 ease-out focus:border-[var(--primary)]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[var(--foreground)]">Status</label>
              <select
                value={values.status}
                onChange={(e) => setValues((prev) => ({ ...prev, status: e.target.value as TaskStatus }))}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] outline-none transition-colors duration-300 ease-out focus:border-[var(--primary)]"
              >
                {STATUS_COLUMNS.map((col) => (
                  <option key={col.status} value={col.status}>
                    {col.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[var(--foreground)]">Priority</label>
              <select
                value={values.priority}
                onChange={(e) => setValues((prev) => ({ ...prev, priority: e.target.value as TaskPriority }))}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] outline-none transition-colors duration-300 ease-out focus:border-[var(--primary)]"
              >
                {(Object.keys(PRIORITY_LABELS) as TaskPriority[]).map((p) => (
                  <option key={p} value={p}>
                    {PRIORITY_LABELS[p]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[var(--foreground)]">Assignee</label>
              <select
                value={values.assigneeName}
                onChange={(e) => setValues((prev) => ({ ...prev, assigneeName: e.target.value }))}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] outline-none transition-colors duration-300 ease-out focus:border-[var(--primary)]"
              >
                <option value="">Unassigned</option>
                {teamMembers.map((member) => (
                  <option key={member.id} value={member.name}>
                    {member.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[var(--foreground)]">Due date</label>
              <input
                type="date"
                value={values.dueDate}
                onChange={(e) => setValues((prev) => ({ ...prev, dueDate: e.target.value }))}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] outline-none transition-colors duration-300 ease-out focus:border-[var(--primary)]"
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-[var(--border)] px-5 py-2 text-sm font-semibold text-[var(--foreground)] transition-all duration-300 ease-out hover:border-[var(--primary)]/40"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="rounded-full bg-[var(--primary)] px-5 py-2 text-sm font-semibold text-white shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.25)] transition-all duration-300 ease-out hover:brightness-110"
          >
            {isEditing ? "Save changes" : "Create task"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Task card                                                                  */
/* -------------------------------------------------------------------------- */

interface TaskCardProps {
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
  onComplete: () => void;
  onStatusChange: (status: TaskStatus) => void;
}

function TaskCard({ task, onEdit, onDelete, onComplete, onStatusChange }: TaskCardProps) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-3.5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all duration-300 ease-out hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.12)]">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-semibold leading-snug text-[var(--foreground)]">{task.title}</p>
        <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide", PRIORITY_STYLES[task.priority])}>
          {PRIORITY_LABELS[task.priority]}
        </span>
      </div>

      {task.description && (
        <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-[var(--muted-foreground)]">{task.description}</p>
      )}

      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {task.assigneeName ? (
            <span
              className={cn(
                "flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold text-white",
                avatarColorFor(task.assigneeName),
              )}
              title={task.assigneeName}
            >
              {getInitials(task.assigneeName)}
            </span>
          ) : (
            <span className="text-[11px] text-[var(--muted-foreground)]">Unassigned</span>
          )}
          <span className="text-[11px] text-[var(--muted-foreground)]">{formatDate(task.dueDate)}</span>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between gap-2 border-t border-[var(--border)] pt-2.5">
        <select
          value={task.status}
          onChange={(e) => onStatusChange(e.target.value as TaskStatus)}
          className="rounded-md border border-[var(--border)] bg-[var(--background)] px-1.5 py-1 text-[11px] text-[var(--foreground)] outline-none"
          aria-label="Change status"
        >
          {STATUS_COLUMNS.map((col) => (
            <option key={col.status} value={col.status}>
              {col.label}
            </option>
          ))}
        </select>
        <div className="flex items-center gap-1">
          {task.status !== "done" && (
            <button
              type="button"
              onClick={onComplete}
              aria-label="Mark done"
              className="rounded-md p-1.5 text-emerald-600 transition-colors duration-300 ease-out hover:bg-emerald-50"
            >
              <Check className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          )}
          <button
            type="button"
            onClick={onEdit}
            aria-label="Edit task"
            className="rounded-md p-1.5 text-[var(--muted-foreground)] transition-colors duration-300 ease-out hover:bg-[var(--primary)]/10 hover:text-[var(--primary)]"
          >
            <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={onDelete}
            aria-label="Delete task"
            className="rounded-md p-1.5 text-[var(--muted-foreground)] transition-colors duration-300 ease-out hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Page content                                                               */
/* -------------------------------------------------------------------------- */

function ProjectDetailContent() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "all">("all");
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | "all">("all");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [modalInitialValues, setModalInitialValues] = useState<TaskFormValues>(EMPTY_FORM);

  const filteredTasks = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return tasks.filter((task) => {
      const matchesQuery =
        !query ||
        task.title.toLowerCase().includes(query) ||
        (task.description ?? "").toLowerCase().includes(query);
      const matchesStatus = statusFilter === "all" || task.status === statusFilter;
      const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter;
      return matchesQuery && matchesStatus && matchesPriority;
    });
  }, [tasks, searchQuery, statusFilter, priorityFilter]);

  const openCreateModal = () => {
    setEditingTaskId(null);
    setModalInitialValues(EMPTY_FORM);
    setIsModalOpen(true);
  };

  const openEditModal = (task: Task) => {
    setEditingTaskId(task.id);
    setModalInitialValues({
      title: task.title,
      description: task.description ?? "",
      status: task.status,
      priority: task.priority,
      assigneeName: task.assigneeName ?? "",
      dueDate: task.dueDate ?? "",
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTaskId(null);
  };

  const handleModalSubmit = (values: TaskFormValues) => {
    if (editingTaskId) {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === editingTaskId
            ? {
                ...task,
                title: values.title.trim(),
                description: values.description.trim() || undefined,
                status: values.status,
                priority: values.priority,
                assigneeName: values.assigneeName || undefined,
                dueDate: values.dueDate || undefined,
              }
            : task,
        ),
      );
    } else {
      const newTask: Task = {
        id: Date.now().toString(),
        projectId: PROJECT.id,
        title: values.title.trim(),
        description: values.description.trim() || undefined,
        status: values.status,
        priority: values.priority,
        assigneeName: values.assigneeName || undefined,
        dueDate: values.dueDate || undefined,
        createdAt: new Date().toISOString(),
      };
      setTasks((prev) => [newTask, ...prev]);
    }
    closeModal();
  };

  const handleDelete = (taskId: string) => {
    if (typeof window !== "undefined" && !window.confirm("Delete this task? This cannot be undone.")) {
      return;
    }
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
  };

  const handleComplete = (taskId: string) => {
    setTasks((prev) => prev.map((task) => (task.id === taskId ? { ...task, status: "done" } : task)));
  };

  const handleStatusChange = (taskId: string, status: TaskStatus) => {
    setTasks((prev) => prev.map((task) => (task.id === taskId ? { ...task, status } : task)));
  };

  const sortedActivity = useMemo(
    () => [...activityLog].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [],
  );

  return (
    <main className="min-h-screen bg-[var(--background)] px-4 pb-24 pt-8 text-[var(--foreground)] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Header / hero */}
        <Reveal>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-medium text-[var(--muted-foreground)] transition-colors duration-300 ease-out hover:text-[var(--primary)]"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to dashboard
          </Link>

          <div className="mt-4 flex flex-col gap-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.12)] sm:p-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-balance text-2xl font-bold tracking-tight sm:text-3xl">{PROJECT.name}</h1>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-[var(--muted-foreground)]">{PROJECT.description}</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex -space-x-2">
                {initialTeamMembers.slice(0, 5).map((member) => (
                  <span
                    key={member.id}
                    title={member.name}
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-full border-2 border-[var(--card)] text-xs font-bold text-white",
                      avatarColorFor(member.name),
                    )}
                  >
                    {getInitials(member.name)}
                  </span>
                ))}
              </div>
              <button
                type="button"
                onClick={openCreateModal}
                className="inline-flex items-center gap-2 rounded-full bg-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.25)] transition-all duration-300 ease-out hover:brightness-110"
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
                Add task
              </button>
            </div>
          </div>
        </Reveal>

        {/* Toolbar */}
        <Reveal delay={0.05}>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]" aria-hidden="true" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tasks by title or description…"
                className="w-full rounded-full border border-[var(--border)] bg-[var(--card)] py-2.5 pl-10 pr-4 text-sm text-[var(--foreground)] outline-none transition-colors duration-300 ease-out focus:border-[var(--primary)]"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 shrink-0 text-[var(--muted-foreground)]" aria-hidden="true" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as TaskStatus | "all")}
                className="rounded-full border border-[var(--border)] bg-[var(--card)] px-4 py-2.5 text-sm text-[var(--foreground)] outline-none transition-colors duration-300 ease-out focus:border-[var(--primary)]"
              >
                <option value="all">All statuses</option>
                {STATUS_COLUMNS.map((col) => (
                  <option key={col.status} value={col.status}>
                    {col.label}
                  </option>
                ))}
              </select>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value as TaskPriority | "all")}
                className="rounded-full border border-[var(--border)] bg-[var(--card)] px-4 py-2.5 text-sm text-[var(--foreground)] outline-none transition-colors duration-300 ease-out focus:border-[var(--primary)]"
              >
                <option value="all">All priorities</option>
                {(Object.keys(PRIORITY_LABELS) as TaskPriority[]).map((p) => (
                  <option key={p} value={p}>
                    {PRIORITY_LABELS[p]}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Reveal>

        {/* Kanban board */}
        <Reveal delay={0.1}>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STATUS_COLUMNS.map((col) => {
              const ColumnIcon = col.icon;
              const columnTasks = filteredTasks.filter((task) => task.status === col.status);
              return (
                <div
                  key={col.status}
                  className="flex max-h-[70vh] flex-col rounded-2xl border border-[var(--border)] bg-[var(--card)]/60 p-3"
                >
                  <div className="mb-3 flex items-center gap-2 px-1">
                    <ColumnIcon className="h-4 w-4 text-[var(--muted-foreground)]" aria-hidden="true" />
                    <span className="text-sm font-semibold text-[var(--foreground)]">{col.label}</span>
                    <span className="ml-auto rounded-full bg-[var(--background)] px-2 py-0.5 text-xs font-semibold text-[var(--muted-foreground)]">
                      {columnTasks.length}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col gap-3 overflow-y-auto pr-0.5">
                    {columnTasks.length === 0 && (
                      <p className="px-1 py-6 text-center text-xs text-[var(--muted-foreground)]">No tasks here.</p>
                    )}
                    {columnTasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onEdit={() => openEditModal(task)}
                        onDelete={() => handleDelete(task.id)}
                        onComplete={() => handleComplete(task.id)}
                        onStatusChange={(status) => handleStatusChange(task.id, status)}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </Reveal>

        {/* Team members */}
        <Reveal delay={0.1}>
          <section className="mt-14">
            <div className="mb-4 flex items-center gap-2">
              <Users className="h-5 w-5 text-[var(--primary)]" aria-hidden="true" />
              <h2 className="text-xl font-bold tracking-tight">Team members</h2>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {initialTeamMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
                >
                  <span
                    className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white",
                      avatarColorFor(member.name),
                    )}
                  >
                    {getInitials(member.name)}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[var(--foreground)]">{member.name}</p>
                    <p className="truncate text-xs text-[var(--muted-foreground)]">{member.email}</p>
                  </div>
                  <span className="ml-auto shrink-0 rounded-full border border-[var(--border)] bg-[var(--background)] px-2.5 py-1 text-[11px] font-semibold text-[var(--muted-foreground)]">
                    {member.role}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </Reveal>

        {/* Activity log */}
        <Reveal delay={0.1}>
          <section className="mt-14">
            <div className="mb-4 flex items-center gap-2">
              <Activity className="h-5 w-5 text-[var(--primary)]" aria-hidden="true" />
              <h2 className="text-xl font-bold tracking-tight">Activity log</h2>
            </div>
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-2 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.12)] sm:p-4">
              <ul className="flex flex-col divide-y divide-[var(--border)]">
                {sortedActivity.map((item) => (
                  <li key={item.id} className="flex items-start gap-3 px-2 py-3.5">
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--primary)]/10 text-[var(--primary)]">
                      <Activity className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <p className="flex-1 text-sm leading-relaxed text-[var(--foreground)]">
                      <span className="font-semibold">{item.actorName}</span> {item.action} {item.target}
                    </p>
                    <span className="shrink-0 whitespace-nowrap text-xs text-[var(--muted-foreground)]">
                      {formatRelativeTime(item.createdAt)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </Reveal>
      </div>

      {isModalOpen && (
        <TaskModal
          initialValues={modalInitialValues}
          isEditing={Boolean(editingTaskId)}
          teamMembers={initialTeamMembers}
          onClose={closeModal}
          onSubmit={handleModalSubmit}
        />
      )}
    </main>
  );
}

export default function ProjectDetailPage() {
  return (
    <ProtectedRoute>
      <ProjectDetailContent />
    </ProtectedRoute>
  );
}
