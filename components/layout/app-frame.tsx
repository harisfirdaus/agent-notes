"use client";

import { cloneElement, isValidElement, useState } from "react";
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
  const content =
    collapsibleSidebar && isValidElement(children)
      ? cloneElement(children, {
          isSidebarOpen,
          onToggleSidebar: () => setIsSidebarOpen((current) => !current)
        } as Partial<{
          isSidebarOpen: boolean;
          onToggleSidebar: () => void;
        }>)
      : children;

  return (
    <div className="min-h-dvh bg-background text-ink">
      <div className="flex min-h-dvh items-stretch">
        {isSidebarOpen ? <AppSidebar profile={profile} /> : null}
        <main className="relative min-h-dvh flex-1 pb-24 lg:pb-0">
          {content}
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
