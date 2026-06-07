import { cn } from "@/lib/utils";

type FilterChipProps = {
  children: React.ReactNode;
  active?: boolean;
};

export function FilterChip({ children, active }: FilterChipProps) {
  return (
    <button
      className={cn(
        "rounded-full border border-border px-5 py-2 font-mono text-sm transition-colors",
        active ? "border-ink bg-ink text-white" : "bg-white text-ink-muted hover:border-primary"
      )}
    >
      {children}
    </button>
  );
}
