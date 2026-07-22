import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "./cn";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "md" | "sm";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
};

/**
 * Almanac button. Marigold is reserved for the single primary action per view
 * (see DESIGN.md "one accent rule"); everything else is ink/evergreen on paper.
 * Min height 44px meets the touch-target guideline.
 */
const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-marigold-700 text-white shadow-almanac hover:bg-marigold-800 focus-visible:ring-marigold-700",
  secondary:
    "bg-paper-card text-graphite border border-line hover:bg-paper-deep focus-visible:ring-evergreen",
  ghost:
    "bg-transparent text-evergreen hover:bg-evergreen-50 focus-visible:ring-evergreen",
  danger:
    "bg-transparent text-oxblood border border-oxblood/40 hover:bg-oxblood/5 focus-visible:ring-oxblood",
};

const SIZES: Record<Size, string> = {
  md: "min-h-[44px] px-5 py-2.5 text-sm",
  sm: "min-h-[38px] px-3.5 py-2 text-sm",
};

export default function Button({
  variant = "secondary",
  size = "md",
  className,
  children,
  type = "button",
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl font-body font-semibold",
        "transition-colors duration-150 outline-none",
        "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-paper",
        "disabled:cursor-not-allowed disabled:opacity-50",
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
