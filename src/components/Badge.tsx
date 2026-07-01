import type { LucideIcon } from "lucide-react";
import type { BadgeColor } from "../data/badges";

type Props = {
  icon: LucideIcon;
  label: string;
  color: BadgeColor;
  earned?: boolean;
};

// Milestones deepen along a single lavender ramp so the row reads as one warm
// progression rather than a rainbow — with a soft gold reward for "All Done".
const COLOR_STYLES: Record<
  BadgeColor,
  { gradient: string; ring: string; shadow: string; text: string }
> = {
  emerald: {
    gradient: "from-lavender-300 to-lavender-400",
    ring: "ring-lavender-100",
    shadow: "shadow-lavender-400/50",
    text: "text-lavender-600",
  },
  sky: {
    gradient: "from-lavender-400 to-lavender-500",
    ring: "ring-lavender-200",
    shadow: "shadow-lavender-500/50",
    text: "text-lavender-700",
  },
  violet: {
    gradient: "from-lavender-500 to-lavender-700",
    ring: "ring-lavender-200",
    shadow: "shadow-lavender-600/50",
    text: "text-lavender-700",
  },
  rose: {
    gradient: "from-lavender-600 to-lavender-800",
    ring: "ring-lavender-300",
    shadow: "shadow-lavender-700/50",
    text: "text-lavender-800",
  },
  amber: {
    gradient: "from-amber-300 to-amber-500",
    ring: "ring-amber-200",
    shadow: "shadow-amber-400/60",
    text: "text-amber-600",
  },
};

export default function Badge({ icon: Icon, label, color, earned = true }: Props) {
  const style = COLOR_STYLES[color];

  return (
    <div className="flex w-28 flex-col items-center gap-2.5 text-center">
      <div
        className={`flex h-20 w-20 items-center justify-center rounded-full ring-4 transition duration-300 ${
          earned
            ? `scale-105 bg-gradient-to-br ${style.gradient} text-white shadow-xl ${style.shadow} ${style.ring}`
            : "bg-lavender-50 text-lavender-200 ring-lavender-100"
        }`}
      >
        <Icon size={30} strokeWidth={earned ? 2.5 : 2} />
      </div>
      <span
        className={`text-sm font-bold leading-tight ${
          earned ? style.text : "text-ink-soft/70"
        }`}
      >
        {label}
      </span>
    </div>
  );
}
