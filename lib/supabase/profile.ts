import { redirect } from "next/navigation";
import { cache } from "react";
import { createClient } from "./server";

export type CurrentProfile = {
  id: string;
  email: string;
  displayName: string;
  initials: string;
};

function deriveDisplayName(email: string, displayName?: string | null) {
  if (displayName?.trim()) {
    return displayName.trim();
  }

  return email.split("@")[0] || "AgentNotes User";
}

function deriveInitials(name: string, email: string) {
  const source = name.trim() || email;
  const parts = source
    .replace(/[^a-zA-Z0-9@\s._-]/g, "")
    .split(/[\s._@-]+/)
    .filter(Boolean);

  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }

  return source.slice(0, 2).toUpperCase();
}

export const getCurrentProfile = cache(async (): Promise<CurrentProfile | null> => {
  const supabase = await createClient();
  const {
    data: { user },
    error
  } = await supabase.auth.getUser();

  if (error || !user?.email) {
    return null;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name,email")
    .eq("id", user.id)
    .maybeSingle();

  const email = profile?.email || user.email;
  const displayName = deriveDisplayName(email, profile?.display_name);

  return {
    id: user.id,
    email,
    displayName,
    initials: deriveInitials(displayName, email)
  };
});

export async function requireCurrentProfile() {
  const profile = await getCurrentProfile();

  if (!profile) {
    redirect("/login");
  }

  return profile;
}
