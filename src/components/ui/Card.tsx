import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "./cn";

type CardProps = HTMLAttributes<HTMLDivElement> & { children: ReactNode };

/** Shared white card with the app's lavender border and soft shadow. */
export default function Card({ className, children, ...rest }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-lavender-200/80 bg-white shadow-soft",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

/**
 * Lavender section heading used across profile and setup surfaces.
 * `as` lets callers keep a correct heading hierarchy (h1→h3).
 */
export function SectionTitle({
  children,
  eyebrow,
  as: Tag = "h2",
  className,
}: {
  children: ReactNode;
  eyebrow?: string;
  as?: "h1" | "h2" | "h3";
  className?: string;
}) {
  return (
    <div className={cn("border-b border-lavender-200 pb-2", className)}>
      {eyebrow ? (
        <p className="mb-1 font-body text-[11px] font-bold uppercase tracking-[0.16em] text-lavender-700">
          {eyebrow}
        </p>
      ) : null}
      <Tag className="font-serif text-2xl font-semibold leading-tight text-ink">
        {children}
      </Tag>
    </div>
  );
}

/** Quiet "reason for asking" note — muted ink, never a modal (see DESIGN.md). */
export function ReasonNote({ children, id }: { children: ReactNode; id?: string }) {
  return (
    <p id={id} className="font-body text-sm leading-relaxed text-ink-muted">
      {children}
    </p>
  );
}
