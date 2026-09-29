"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, LayoutGrid } from 'lucide-react';
import { navLinks, BRAND, type NavLink } from "@/lib/data";

export default function Navbar() {
  const pathname = usePathname();
  const t = useTranslations();
  const navT = t.raw("nav") as Record<string, string>;
  const [isOpen, setIsOpen] = useState(false);

  const renderLink = (link: NavLink, onNavigate?: () => void) => {
    const isSection = link.href.startsWith("#");
    const isCta = link.key === "signup";
    const isActive = !isSection && pathname === link.href;
    const label = navT[link.key] ?? link.label;

    const baseClasses = isCta
      ? "inline-flex items-center justify-center rounded-[10px] bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white shadow-[0_1px_2px_rgba(27,31,42,0.04),0_4px_12px_rgba(27,31,42,0.06)] transition-all duration-300 ease-out hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]"
      : `rounded-md px-1 text-sm font-medium transition-colors duration-300 ease-out hover:text-[var(--primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)] ${
          isActive ? "text-[var(--primary)]" : "text-[var(--foreground)]"
        }`;

    if (isSection) {
      const href = pathname === "/" ? link.href : `/${link.href}`;
      return (
        <Link
          key={link.key}
          href={href}
          className={baseClasses}
          onClick={(e) => {
            if (pathname === "/") {
              e.preventDefault();
              document.querySelector(link.href)?.scrollIntoView({ behavior: "smooth" });
            }
            onNavigate?.();
          }}
        >
          {label}
        </Link>
      );
    }

    return (
      <Link key={link.key} href={link.href} className={baseClasses} onClick={onNavigate}>
        {label}
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--card)]/90 backdrop-blur-md">
      <motion.nav
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8"
      >
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-extrabold tracking-tight text-[var(--foreground)]"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-[var(--primary)] text-white">
            <LayoutGrid className="h-5 w-5" aria-hidden="true" />
          </span>
          {navT.brand ?? BRAND.name}
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => renderLink(link))}
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-[10px] border border-[var(--border)] text-[var(--foreground)] transition-colors duration-300 ease-out hover:border-[var(--primary)] hover:text-[var(--primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)] md:hidden"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label={isOpen ? t("nav.closeMenu") : t("nav.openMenu")}
          aria-expanded={isOpen}
        >
          {isOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
        </button>
      </motion.nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="overflow-hidden border-t border-[var(--border)] bg-[var(--card)] md:hidden"
          >
            <div className="flex flex-col gap-1 px-4 py-4 sm:px-6">
              {navLinks.map((link) => renderLink(link, () => setIsOpen(false)))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
