import { AlertTriangle, Bot, ChevronRight, Clock3, Download, Palette, UserCircle } from "lucide-react";
import { LogoutButton } from "@/components/auth/logout-button";
import { AppShell } from "@/components/layout/app-shell";
import { TopBar } from "@/components/layout/top-bar";
import { requireCurrentProfile } from "@/lib/supabase/profile";

const settings = [
  { label: "Account", icon: UserCircle },
  { label: "Agent Access", icon: Bot },
  { label: "Activity Log", icon: Clock3 },
  { label: "Export Data", icon: Download },
  { label: "Theme", icon: Palette }
];

export default async function SettingsPage() {
  const profile = await requireCurrentProfile();

  return (
    <AppShell>
      <TopBar title="Settings" />
      <section className="mx-auto max-w-3xl px-5 py-7 lg:px-12">
        <div className="mb-10 flex items-center gap-5 rounded-2xl bg-white p-6 shadow-paper">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-ink-muted text-2xl font-bold text-white">
            {profile.initials}
          </div>
          <div className="min-w-0">
            <h2 className="truncate text-3xl font-semibold">{profile.displayName}</h2>
            <p className="truncate text-xl text-ink-muted">{profile.email}</p>
          </div>
        </div>

        <p className="mono-label mb-4 text-ink-muted">Preferences</p>
        <div className="space-y-4">
          {settings.map((item) => {
            const Icon = item.icon;
            return (
              <button key={item.label} className="flex h-20 w-full items-center gap-5 rounded-2xl bg-white px-6 text-left text-2xl shadow-paper">
                <Icon className="h-7 w-7 text-primary" />
                <span className="flex-1">{item.label}</span>
                <ChevronRight className="h-6 w-6 text-ink-muted" />
              </button>
            );
          })}
        </div>

        <p className="mono-label mb-4 mt-10 text-danger">Danger Zone</p>
        <button className="flex h-20 w-full items-center gap-5 rounded-2xl border border-red-200 bg-red-50 px-6 text-left text-2xl text-danger">
          <AlertTriangle className="h-7 w-7" />
          <span className="flex-1">Delete Account</span>
        </button>

        <LogoutButton />
        <p className="mono-label mt-8 text-center text-lg tracking-[0.25em] text-ink-muted">
          Version 0.1.0
        </p>
      </section>
    </AppShell>
  );
}
