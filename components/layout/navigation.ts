import {
  Archive,
  CircleHelp,
  FileText,
  Inbox,
  Mic,
  Settings,
  Tag
} from "lucide-react";

export const primaryNavItems = [
  { href: "/inbox", label: "Inbox", icon: Inbox },
  { href: "/notes", label: "Notes", icon: FileText },
  { href: "/capture", label: "Capture", icon: Mic },
  { href: "/tags", label: "Tags", icon: Tag },
  { href: "/settings", label: "Settings", icon: Settings }
];

export const secondaryNavItems = [
  { href: "/help", label: "Help", icon: CircleHelp },
  { href: "/archive", label: "Archive", icon: Archive }
];
