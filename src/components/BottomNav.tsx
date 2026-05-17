"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";

const TABS = [
  {
    href: "/checklist",
    labelKey: "nav.checklist" as const,
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
        <rect x="3" y="3" width="14" height="14" rx="0" stroke="currentColor" strokeWidth="2" />
        <path d="M6.5 10l2.5 2.5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" />
      </svg>
    ),
  },
  {
    href: "/chat",
    labelKey: "nav.chat" as const,
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
        <path d="M3 4h14v10H8l-5 4V4z" stroke="currentColor" strokeWidth="2" strokeLinejoin="miter" />
      </svg>
    ),
  },
  {
    href: "/campus",
    labelKey: "nav.campus" as const,
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
        <path d="M10 3l7 3.5v1L10 11 3 7.5v-1L10 3z" stroke="currentColor" strokeWidth="2" strokeLinejoin="miter" />
        <path d="M5.5 9.5v5c1.5 1.5 3 2 4.5 2s3-.5 4.5-2v-5" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
      </svg>
    ),
  },
  {
    href: "/profile",
    labelKey: "nav.profile" as const,
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
        <rect x="6" y="3" width="8" height="8" rx="0" stroke="currentColor" strokeWidth="2" />
        <path d="M3 18c0-3.5 3-5 7-5s7 1.5 7 5" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
      </svg>
    ),
  },
] as const;

export function BottomNav() {
  const pathname = usePathname();
  const { t } = useLanguage();

  return (
    <nav
      className="sticky bottom-0 z-40 border-t-2 border-black bg-white safe-bottom"
      aria-label="Main"
    >
      <div className="mx-auto flex max-w-mobile items-stretch">
        {TABS.map((tab, idx) => {
          const active =
            pathname === tab.href || pathname.startsWith(`${tab.href}/`);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`relative flex min-w-0 flex-1 flex-col items-center gap-1.5 py-3 text-[9px] font-bold uppercase tracking-widest transition ${
                idx > 0 ? "border-l-2 border-black" : ""
              } ${active ? "" : "text-muted hover:text-black"}`}
              style={active ? { background: "var(--yellow)", color: "var(--black)" } : undefined}
            >
              <span>{tab.icon}</span>
              <span>{t(tab.labelKey)}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
