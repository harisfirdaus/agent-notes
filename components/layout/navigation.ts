import {
  Archive,
  CircleHelp,
  FileText,
  PlusCircle,
  Settings,
  Tag
} from "lucide-react";

export const primaryNavItems = [
  { href: "/notes", label: "Notes", icon: FileText },
  { href: "/notes/new", label: "New", icon: PlusCircle, primary: true },
  { href: "/tags", label: "Tags", icon: Tag },
  { href: "/settings", label: "Settings", icon: Settings }
];

export const secondaryNavItems = [
  { href: "/help", label: "Help", icon: CircleHelp },
  { href: "/archive", label: "Archive", icon: Archive }
];
