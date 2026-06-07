"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/browser";

export function LogoutButton() {
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
      className="mono-label mt-10 flex h-16 w-full items-center justify-center gap-3 rounded-lg bg-ink text-lg text-white"
    >
      <LogOut className="h-6 w-6" />
      Logout
    </button>
  );
}
