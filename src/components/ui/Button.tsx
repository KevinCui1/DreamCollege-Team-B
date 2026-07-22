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
 * Shared lavender button treatment. The primary action uses the app's vivid purple.
 * Min height 44px meets the touch-target guideline.
 */
const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-lavender-700 text-white shadow-soft hover:bg-lavender-800 focus-visible:ring-lavender-600",
  secondary:
    "border border-lavender-200 bg-white text-ink hover:bg-lavender-50 focus-visible:ring-lavender-500",
  ghost:
    "bg-transparent text-lavender-800 hover:bg-lavender-100 focus-visible:ring-lavender-500",
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
        "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-lavender-50",
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
