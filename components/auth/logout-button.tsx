"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/browser";
import { cn } from "@/lib/utils";

type LogoutButtonProps = {
  className?: string;
  iconClassName?: string;
};

export function LogoutButton({ className, iconClassName }: LogoutButtonProps) {
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
        "mono-label mt-10 flex h-16 w-full items-center justify-center gap-3 rounded-lg bg-ink text-lg text-white",
        className
      )}
    >
      <LogOut className={cn("h-6 w-6", iconClassName)} />
      Logout
    </button>
  );
}
