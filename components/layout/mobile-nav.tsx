"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { primaryNavItems } from "./navigation";

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 grid h-20 grid-cols-5 border-t border-border bg-white/95 px-4 pb-3 pt-2 backdrop-blur lg:hidden">
      {primaryNavItems.map((item) => {
        const Icon = item.icon;
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
        const isCapture = item.href === "/capture";

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center gap-1 font-mono text-[11px] text-ink-muted",
              active && "text-primary"
            )}
          >
            {isCapture ? (
              <span className="mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-modal">
                <Plus className="h-7 w-7" />
              </span>
            ) : (
              <Icon className="h-6 w-6" strokeWidth={active ? 2.4 : 2} />
            )}
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
