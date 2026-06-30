import type { LucideIcon } from "lucide-react";
import type { BadgeColor } from "../data/badges";

type Props = {
  icon: LucideIcon;
  label: string;
  color: BadgeColor;
  earned?: boolean;
};

const COLOR_STYLES: Record<
  BadgeColor,
  { gradient: string; ring: string; shadow: string; text: string }
> = {
  emerald: {
    gradient: "from-emerald-300 via-emerald-400 to-teal-500",
    ring: "ring-emerald-200",
    shadow: "shadow-emerald-400/60",
    text: "text-emerald-700",
  },
  sky: {
    gradient: "from-sky-300 via-sky-400 to-blue-500",
    ring: "ring-sky-200",
    shadow: "shadow-sky-400/60",
    text: "text-sky-700",
  },
  violet: {
    gradient: "from-violet-300 via-violet-400 to-purple-600",
    ring: "ring-violet-200",
    shadow: "shadow-violet-400/60",
    text: "text-violet-700",
  },
  rose: {
    gradient: "from-rose-300 via-rose-400 to-pink-500",
    ring: "ring-rose-200",
    shadow: "shadow-rose-400/60",
    text: "text-rose-700",
  },
  amber: {
    gradient: "from-amber-300 via-amber-400 to-orange-500",
    ring: "ring-amber-200",
    shadow: "shadow-amber-400/60",
    text: "text-amber-700",
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
            : "bg-violet-50 text-violet-200 ring-violet-100"
        }`}
      >
        <Icon size={30} strokeWidth={earned ? 2.5 : 2} />
      </div>
      <span
        className={`text-sm font-bold leading-tight ${
          earned ? style.text : "text-violet-300"
        }`}
      >
        {label}
      </span>
    </div>
  );
}
