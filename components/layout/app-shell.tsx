import { AppFrame } from "./app-frame";
import { requireCurrentProfile } from "@/lib/supabase/profile";

type AppShellProps = {
  children: React.ReactNode;
  collapsibleSidebar?: boolean;
};

export async function AppShell({ children, collapsibleSidebar }: AppShellProps) {
  const profile = await requireCurrentProfile();

  return <AppFrame profile={profile} collapsibleSidebar={collapsibleSidebar}>{children}</AppFrame>;
}
