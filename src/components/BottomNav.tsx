"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/checklist", label: "Checklist", icon: "📋" },
  { href: "/chat", label: "Chat", icon: "💬" },
  { href: "/campus", label: "Campus", icon: "🎓" },
  { href: "/profile", label: "Profile", icon: "👤" },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="sticky bottom-0 z-40 border-t border-border bg-white/95 backdrop-blur safe-bottom"
      aria-label="Main"
    >
      <div className="mx-auto flex max-w-mobile items-stretch justify-around px-1 pt-1">
        {TABS.map((tab) => {
          const active =
            pathname === tab.href || pathname.startsWith(`${tab.href}/`);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex min-w-0 flex-1 flex-col items-center gap-0.5 py-2 text-[10px] font-semibold transition ${
                active ? "text-primary" : "text-muted hover:text-ink"
              }`}
            >
              <span className="text-lg leading-none" aria-hidden>
                {tab.icon}
              </span>
              <span className="truncate">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
