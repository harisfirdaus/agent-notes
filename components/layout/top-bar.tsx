import { MoreVertical, RefreshCw, Search } from "lucide-react";

type TopBarProps = {
  title: string;
  searchPlaceholder?: string;
};

export function TopBar({ title, searchPlaceholder }: TopBarProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
      <div className="flex min-h-20 items-center gap-5 px-5 lg:px-8">
        <h1 className="font-display text-3xl font-bold text-primary lg:text-4xl lg:text-ink">
          {title}
        </h1>
        {searchPlaceholder ? (
          <div className="ml-auto hidden h-12 w-full max-w-md items-center gap-3 rounded-2xl bg-surface-muted px-4 text-ink-muted md:flex">
            <Search className="h-5 w-5" />
            <span>{searchPlaceholder}</span>
          </div>
        ) : null}
        <div className="ml-auto flex items-center gap-2 md:ml-0">
          <button className="flex h-10 w-10 items-center justify-center rounded-lg text-ink-muted hover:bg-surface-dim" aria-label="Sync">
            <RefreshCw className="h-5 w-5" />
          </button>
          <button className="flex h-10 w-10 items-center justify-center rounded-lg text-ink-muted hover:bg-surface-dim" aria-label="More actions">
            <MoreVertical className="h-5 w-5" />
          </button>
        </div>
      </div>
      {searchPlaceholder ? (
        <div className="px-5 pb-4 md:hidden">
          <div className="flex h-14 items-center gap-3 rounded-2xl border border-border bg-white px-4 text-ink-muted shadow-paper">
            <Search className="h-5 w-5" />
            <span>{searchPlaceholder}</span>
          </div>
        </div>
      ) : null}
    </header>
  );
}
