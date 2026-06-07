"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/browser";
import { cn } from "@/lib/utils";

type LogoutButtonProps = {
  className?: string;
  iconClassName?: string;
  variant?: "solid" | "subtle";
};

export function LogoutButton({ className, iconClassName, variant = "solid" }: LogoutButtonProps) {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className={cn(
        "mono-label flex w-full items-center justify-center gap-3 rounded-lg transition-colors",
        variant === "solid" &&
          "mt-10 h-16 bg-ink text-lg text-white hover:bg-primary",
        variant === "subtle" &&
          "h-10 border border-border bg-white text-xs text-ink-muted hover:border-danger hover:bg-red-50 hover:text-danger",
        className
      )}
    >
      <LogOut className={cn("h-6 w-6", iconClassName)} />
      Logout
    </button>
  );
}
