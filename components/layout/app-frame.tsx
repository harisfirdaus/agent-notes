"use client";

import { useState } from "react";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { AppSidebar } from "./app-sidebar";
import { MobileNav } from "./mobile-nav";
import type { CurrentProfile } from "@/lib/supabase/profile";

type AppFrameProps = {
  children: React.ReactNode;
  profile: CurrentProfile;
  collapsibleSidebar?: boolean;
};

export function AppFrame({ children, profile, collapsibleSidebar }: AppFrameProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="min-h-dvh bg-background text-ink">
      <div className="flex min-h-dvh items-stretch">
        {isSidebarOpen ? <AppSidebar profile={profile} /> : null}
        <main className="relative min-h-dvh flex-1 pb-24 lg:pb-0">
          {collapsibleSidebar ? (
            <button
              type="button"
              onClick={() => setIsSidebarOpen((current) => !current)}
              className="fixed left-3 top-3 z-50 hidden h-9 w-9 items-center justify-center rounded-lg border border-border bg-white text-ink-muted shadow-paper hover:text-primary lg:flex"
              aria-label={isSidebarOpen ? "Hide sidebar" : "Show sidebar"}
            >
              {isSidebarOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
            </button>
          ) : null}
          {children}
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
