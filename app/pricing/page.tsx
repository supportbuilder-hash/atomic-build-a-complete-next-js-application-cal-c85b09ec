"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, X, Sparkles, ArrowRight } from 'lucide-react';
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/utils";

interface PricingTier {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number | null;
  highlighted: boolean;
  ctaLabel: string;
  features: { label: string; included: boolean }[];
}

const PRICING_TIERS: PricingTier[] = [
  {
    id: "starter",
    name: "Starter",
    description: "For small teams just getting organized.",
    monthlyPrice: 0,
    highlighted: false,
    ctaLabel: "Get started free",
    features: [
      { label: "Up to 3 projects", included: true },
      { label: "Up to 5 team members", included: true },
      { label: "Basic kanban board", included: true },
      { label: "Community support", included: true },
      { label: "Task priorities & filters", included: false },
      { label: "Activity feed & comments", included: false },
    ],
  },
  {
    id: "team",
    name: "Team",
    description: "For growing teams that need full visibility.",
    monthlyPrice: 12,
    highlighted: true,
    ctaLabel: "Start free trial",
    features: [
      { label: "Unlimited projects", included: true },
      { label: "Unlimited team members", included: true },
      { label: "Task priorities & filters", included: true },
      { label: "Full activity feed", included: true },
      { label: "Comments on every task", included: true },
      { label: "Priority email support", included: true },
    ],
  },
  {
    id: "business",
    name: "Business",
    description: "For organizations with advanced needs.",
    monthlyPrice: 24,
    highlighted: false,
    ctaLabel: "Start free trial",
    features: [
      { label: "Everything in Team", included: true },
      { label: "Advanced permissions", included: true },
      { label: "Audit log", included: true },
      { label: "SSO (single sign-on)", included: true },
      { label: "Dedicated onboarding", included: true },
      { label: "24/7 dedicated support", included: true },
    ],
  },
];

const COMPARISON_ROWS: { label: string; values: [string, string, string] }[] = [
  { label: "Projects", values: ["Up to 3", "Unlimited", "Unlimited"] },
  { label: "Tasks & kanban", values: ["Basic board", "Full board with priorities", "Full board with priorities"] },
  { label: "Team members", values: ["Up to 5", "Unlimited", "Unlimited"] },
  { label: "Comments", values: ["—", "Included", "Included"] },
  { label: "Activity feed", values: ["—", "Included", "Included"] },
  { label: "Support", values: ["Community", "Priority email", "Dedicated 24/7"] },
];

const ANNUAL_DISCOUNT = 0.8;

function formatPrice(monthlyPrice: number | null, isAnnual: boolean): string {
  if (monthlyPrice === null) return "Custom";
  if (monthlyPrice === 0) return "$0";
  const price = isAnnual ? monthlyPrice * ANNUAL_DISCOUNT : monthlyPrice;
  return `$${Number.isInteger(price) ? price : price.toFixed(2)}`;
}

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <main className="bg-[var(--background)] text-[var(--foreground)]">
      {/* HERO */}
      <Reveal>
        <section className="relative overflow-hidden px-6 pt-20 pb-16 md:pt-28 md:pb-20">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-[var(--accent)]/10 blur-3xl"
          />
          <div className="relative mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-4 py-1.5 text-sm font-medium text-[hsl(var(--muted-foreground))]">
              <Sparkles className="h-4 w-4 text-[var(--accent)]" aria-hidden="true" />
              Simple, transparent pricing
            </span>
            <h1 className="mt-6 text-balance text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Plans that grow with your team
            </h1>
            <p className="mt-6 text-pretty text-lg leading-relaxed text-[hsl(var(--muted-foreground))]">
              Start free and upgrade as your team scales. Every plan includes the core kanban workflow,
              with more power unlocked as you grow.
            </p>

            <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-1.5">
              <button
                type="button"
                onClick={() => setIsAnnual(false)}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 ease-out",
                  !isAnnual
                    ? "bg-[var(--primary)] text-white shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.08)]"
                    : "text-[hsl(var(--muted-foreground))] hover:text-[var(--foreground)]"
                )}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setIsAnnual(true)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 ease-out",
                  isAnnual
                    ? "bg-[var(--primary)] text-white shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.08)]"
                    : "text-[hsl(var(--muted-foreground))] hover:text-[var(--foreground)]"
                )}
              >
                Annual
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-xs font-semibold",
                    isAnnual ? "bg-white/20 text-white" : "bg-[var(--accent)]/15 text-[var(--accent)]"
                  )}
                >
                  Save 20%
                </span>
              </button>
            </div>
          </div>
        </section>
      </Reveal>

      {/* PRICING TIERS */}
      <Reveal>
        <section className="px-6 pb-24">
          <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-3">
            {PRICING_TIERS.map((tier) => (
              <div
                key={tier.id}
                className={cn(
                  "relative flex flex-col rounded-2xl border bg-[hsl(var(--card))] p-8 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.12)] transition-all duration-300 ease-out",
                  tier.highlighted
                    ? "border-[var(--primary)] lg:-translate-y-3 lg:scale-[1.03]"
                    : "border-[hsl(var(--border))]"
                )}
              >
                {tier.highlighted && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[var(--primary)] px-4 py-1 text-xs font-semibold text-white shadow-[0_4px_12px_rgba(0,0,0,0.15)]">
                    Most popular
                  </span>
                )}

                <h2 className="text-xl font-bold tracking-tight">{tier.name}</h2>
                <p className="mt-2 text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">
                  {tier.description}
                </p>

                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-bold tracking-tight">
                    {formatPrice(tier.monthlyPrice, isAnnual)}
                  </span>
                  {tier.monthlyPrice !== null && tier.monthlyPrice > 0 && (
                    <span className="text-sm font-medium text-[hsl(var(--muted-foreground))]">
                      /user/mo
                    </span>
                  )}
                </div>

                <Link
                  href="/signup"
                  className={cn(
                    "mt-6 inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-all duration-300 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
                    tier.highlighted
                      ? "bg-[var(--primary)] text-white hover:brightness-110 focus-visible:outline-[var(--primary)]"
                      : "border border-[hsl(var(--border))] text-[var(--foreground)] hover:border-[var(--primary)]/40 focus-visible:outline-[var(--primary)]"
                  )}
                >
                  {tier.ctaLabel}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>

                <ul className="mt-8 flex flex-col gap-3">
                  {tier.features.map((feature) => (
                    <li key={feature.label} className="flex items-start gap-3 text-sm">
                      {feature.included ? (
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--primary)]" aria-hidden="true" />
                      ) : (
                        <X className="mt-0.5 h-4 w-4 shrink-0 text-[hsl(var(--muted-foreground))]/50" aria-hidden="true" />
                      )}
                      <span
                        className={
                          feature.included
                            ? "text-[var(--foreground)]"
                            : "text-[hsl(var(--muted-foreground))]/70"
                        }
                      >
                        {feature.label}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      {/* COMPARISON TABLE */}
      <Reveal>
        <section className="border-y border-[hsl(var(--border))] bg-[hsl(var(--card))] px-6 py-24">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
                Compare every feature
              </h2>
              <p className="mt-4 text-pretty text-base leading-relaxed text-[hsl(var(--muted-foreground))]">
                A closer look at what's included in each TeamBoard plan.
              </p>
            </div>

            <div className="mt-12 overflow-x-auto">
              <table className="w-full min-w-[640px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-[hsl(var(--border))]">
                    <th className="py-4 pr-4 font-semibold text-[hsl(var(--muted-foreground))]">Feature</th>
                    {PRICING_TIERS.map((tier) => (
                      <th
                        key={tier.id}
                        className={cn(
                          "py-4 px-4 font-semibold",
                          tier.highlighted ? "text-[var(--primary)]" : "text-[var(--foreground)]"
                        )}
                      >
                        {tier.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON_ROWS.map((row) => (
                    <tr key={row.label} className="border-b border-[hsl(var(--border))] last:border-0">
                      <td className="py-4 pr-4 font-medium text-[var(--foreground)]">{row.label}</td>
                      {row.values.map((value, index) => (
                        <td key={`${row.label}-${index}`} className="py-4 px-4 text-[hsl(var(--muted-foreground))]">
                          {value}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </Reveal>

      {/* FINAL CTA */}
      <Reveal>
        <section className="px-6 py-24 md:py-32">
          <div className="mx-auto max-w-3xl rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-8 py-16 text-center shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.12)]">
            <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to transform your workflow?
            </h2>
            <p className="mt-4 text-pretty text-base leading-relaxed text-[hsl(var(--muted-foreground))]">
              Join thousands of teams shipping faster with TeamBoard. No credit card required to start.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-[var(--accent-foreground)] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.25)] transition-all duration-300 ease-out hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
              >
                Start free trial
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/features"
                className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-6 py-3 text-sm font-semibold transition-all duration-300 ease-out hover:border-[var(--accent)]/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
              >
                Explore features
              </Link>
            </div>
          </div>
        </section>
      </Reveal>
    </main>
  );
}
