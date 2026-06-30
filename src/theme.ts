// Shared design tokens for the dashboard surface.
// Frosted translucent white card with a crisp hairline and a neutral, layered shadow.
export const glassCard =
  "rounded-xl bg-white/75 backdrop-blur-xl border border-slate-900/[0.06] shadow-card";

// Interactive variant — adds a gentle hover lift.
export const glassCardInteractive = `${glassCard} transition duration-300 hover:shadow-card-lg hover:-translate-y-0.5`;

// Primary accent — a single restrained solid violet.
export const accent = "bg-violet-600 hover:bg-violet-700";

// Small uppercase eyebrow label.
export const eyebrow =
  "text-[11px] font-bold uppercase tracking-widest text-slate-500";
