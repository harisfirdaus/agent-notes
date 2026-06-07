"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus, Sparkles } from "lucide-react";
import { LogoutButton } from "@/components/auth/logout-button";
import { cn } from "@/lib/utils";
import type { CurrentProfile } from "@/lib/supabase/profile";
import { primaryNavItems, secondaryNavItems } from "./navigation";

type AppSidebarProps = {
  profile: CurrentProfile;
};

export function AppSidebar({ profile }: AppSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="hidden h-screen w-[280px] shrink-0 border-r border-border bg-surface-muted px-5 py-6 lg:flex lg:flex-col">
      <Link href="/notes" className="mb-9 flex items-center gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary text-white">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <p className="font-display text-xl font-bold leading-none">AgentNotes</p>
          <p className="mono-label mt-2 text-[10px] text-ink">Precision Workspace</p>
        </div>
      </Link>

      <Link
        href="/notes/new"
        className="mono-label mb-8 flex h-14 items-center justify-center gap-3 rounded-lg bg-primary text-sm text-white shadow-paper"
      >
        <Plus className="h-5 w-5" />
        New Note
      </Link>

      <nav className="space-y-2">
        {primaryNavItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex h-12 items-center gap-4 rounded-lg px-5 text-lg text-ink-muted transition-colors",
                active && "bg-surface-dim font-semibold text-primary ring-1 ring-primary/20"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="font-mono text-base">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-border pt-6">
        <nav className="space-y-2">
          {secondaryNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex h-11 items-center gap-4 rounded-lg px-5 text-ink-muted transition-colors hover:bg-surface-dim"
              >
                <Icon className="h-5 w-5" />
                <span className="font-mono text-base">{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="mt-7 flex items-center gap-3 px-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
            {profile.initials}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{profile.displayName}</p>
            <p className="truncate text-xs text-ink-muted">{profile.email}</p>
          </div>
        </div>
        <LogoutButton className="mt-4 h-10 rounded-lg border border-border bg-white text-xs text-ink-muted hover:border-danger hover:text-danger" iconClassName="h-4 w-4" />
      </div>
    </aside>
  );
}
