import type { ReactNode } from "react";
import { BottomNav } from "@/components/BottomNav";
import { FreshnessInit } from "@/components/FreshnessInit";

export default function TabsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col bg-surface">
      <FreshnessInit />
      <div className="flex min-h-0 flex-1 flex-col">{children}</div>
      <BottomNav />
    </div>
  );
}
