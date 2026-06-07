import { cn } from "@/lib/utils";

type InboxCardProps = {
  kind: string;
  title: string;
  excerpt: string;
  tags: string[];
  actor: "User" | "Agent";
  time: string;
  tone?: "blue" | "brown";
};

export function InboxCard({
  kind,
  title,
  excerpt,
  tags,
  actor,
  time,
  tone = "blue"
}: InboxCardProps) {
  return (
    <article className="rounded-2xl bg-white p-6 shadow-paper">
      <div className="mb-3 flex items-start justify-between gap-3">
        <p
          className={cn(
            "mono-label text-sm tracking-[0.2em]",
            tone === "blue" ? "text-primary" : "text-[#7a2f00]"
          )}
        >
          {kind}
        </p>
        <span className="mono-label rounded-md bg-surface-dim px-3 py-1 text-ink-muted">
          {actor}
        </span>
      </div>
      <h2 className="mb-3 text-xl font-medium">{title}</h2>
      <p className="mb-5 line-clamp-3 text-lg leading-relaxed text-ink-muted">{excerpt}</p>
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span key={tag} className="rounded bg-surface-dim px-2 py-1 font-mono text-sm">
              #{tag}
            </span>
          ))}
        </div>
        <span className="font-mono text-lg text-ink-muted">{time}</span>
      </div>
    </article>
  );
}
