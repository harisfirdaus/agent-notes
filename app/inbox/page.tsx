import { AppShell } from "@/components/layout/app-shell";
import { TopBar } from "@/components/layout/top-bar";
import { InboxCard } from "@/components/notes/inbox-card";
import { FilterChip } from "@/components/ui/filter-chip";

const captures = [
  {
    kind: "Research Summary",
    title: "Project Aurora Synthesis",
    excerpt: "External agent Sisu analyzed the last three meetings and saved the key priorities for review.",
    tags: ["strategy", "agent-output"],
    actor: "Agent" as const,
    time: "14:20"
  },
  {
    kind: "Voice Capture",
    title: "Grocery list & Reminders",
    excerpt: "Remember to pick up almond milk, heavy cream, and sourdough. Also call the bank tomorrow.",
    tags: ["personal"],
    actor: "User" as const,
    time: "12:05",
    tone: "brown" as const
  },
  {
    kind: "Draft Note",
    title: "Architecture Review Thoughts",
    excerpt: "Thinking about moving the state management to the edge. Need to verify latency assumptions.",
    tags: ["dev", "latency"],
    actor: "User" as const,
    time: "Yesterday",
    tone: "brown" as const
  },
  {
    kind: "Agent Task",
    title: "Unlabeled Inbox Clean-up",
    excerpt: "Sisu proposed categories for older notes. Review the suggested tags before converting them.",
    tags: ["maintenance"],
    actor: "Agent" as const,
    time: "Oct 24"
  }
];

export default function InboxPage() {
  return (
    <AppShell>
      <TopBar title="AgentNotes" searchPlaceholder="Search notes and captures..." />
      <section className="mx-auto max-w-2xl px-5 py-6 lg:max-w-none lg:px-12">
        <div className="mb-7 flex gap-3 overflow-x-auto pb-1">
          <FilterChip active>All</FilterChip>
          <FilterChip>Capture</FilterChip>
          <FilterChip>Notes</FilterChip>
          <FilterChip>Agent-created</FilterChip>
        </div>
        <div className="space-y-5 lg:grid lg:grid-cols-2 lg:gap-6 lg:space-y-0 xl:grid-cols-3">
          {captures.map((capture) => (
            <InboxCard key={capture.title} {...capture} />
          ))}
        </div>
      </section>
    </AppShell>
  );
}
