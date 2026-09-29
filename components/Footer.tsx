"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { LayoutGrid } from 'lucide-react';
import { navLinks, BRAND } from "@/lib/data";

export default function Footer() {
  const pathname = usePathname();
  const t = useTranslations();
  const navT = t.raw("nav") as Record<string, string>;

  const renderLink = (href: string, label: string, key: string) => {
    const isSection = href.startsWith("#");

    if (isSection) {
      const target = pathname === "/" ? href : `/${href}`;
      return (
        <Link
          key={key}
          href={target}
          className="text-sm text-[var(--muted-foreground)] transition-colors duration-300 ease-out hover:text-[var(--primary)]"
          onClick={(e) => {
            if (pathname === "/") {
              e.preventDefault();
              document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
            }
          }}
        >
          {label}
        </Link>
      );
    }

    return (
      <Link
        key={key}
        href={href}
        className="text-sm text-[var(--muted-foreground)] transition-colors duration-300 ease-out hover:text-[var(--primary)]"
      >
        {label}
      </Link>
    );
  };

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--card)]">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8"
      >
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
          <div>
            <div className="flex items-center gap-2 text-lg font-extrabold tracking-tight text-[var(--foreground)]">
              <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[var(--primary)] text-white">
                <LayoutGrid className="h-4 w-4" aria-hidden="true" />
              </span>
              {navT.brand ?? BRAND.name}
            </div>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-[var(--muted-foreground)]">
              {t("footer.tagline")}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-[var(--foreground)]">
              {t("footer.productHeading")}
            </h3>
            <ul className="mt-4 flex flex-col gap-3">
              {navLinks.map((link) => (
                <li key={link.key}>
                  {renderLink(link.href, navT[link.key] ?? link.label, link.key)}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-[var(--foreground)]">
              {t("footer.accountHeading")}
            </h3>
            <ul className="mt-4 flex flex-col gap-3">
              <li>{renderLink("/forgot-password", t("footer.forgotPassword"), "forgot-password")}</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-[var(--border)] pt-6 sm:flex-row">
          <p className="text-xs text-[var(--muted-foreground)]">{t("footer.copyright")}</p>
        </div>
      </motion.div>
    </footer>
  );
}