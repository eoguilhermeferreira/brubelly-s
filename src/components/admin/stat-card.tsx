import type { LucideIcon } from "lucide-react";

export function StatCard({
  label,
  value,
  icon: Icon,
  tone = "mint",
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  tone?: "mint" | "rose" | "gold";
}) {
  const toneClasses = {
    mint: "bg-mint-200 text-pine-900",
    rose: "bg-rose-100 text-rose-600",
    gold: "bg-gold-400/25 text-gold-600",
  }[tone];

  return (
    <div className="flex items-center gap-4 rounded-2xl border border-border bg-white p-5">
      <span className={`flex size-11 items-center justify-center rounded-full ${toneClasses}`}>
        <Icon className="size-5" strokeWidth={1.75} />
      </span>
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="font-display text-xl font-bold text-pine-900">{value}</p>
      </div>
    </div>
  );
}
