import { AppSidebar } from "./app-sidebar";
import { MobileNav } from "./mobile-nav";
import { requireCurrentProfile } from "@/lib/supabase/profile";

export async function AppShell({ children }: { children: React.ReactNode }) {
  const profile = await requireCurrentProfile();

  return (
    <div className="min-h-dvh bg-background text-ink">
      <div className="flex min-h-dvh items-stretch">
        <AppSidebar profile={profile} />
        <main className="min-h-screen flex-1 pb-24 lg:pb-0">{children}</main>
      </div>
      <MobileNav />
    </div>
  );
}
