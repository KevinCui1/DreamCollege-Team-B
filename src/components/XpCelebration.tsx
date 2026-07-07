import { useEffect } from "react";
import { createPortal } from "react-dom";
import { Sparkles, Star } from "lucide-react";
import Confetti from "./Confetti";

/**
 * Full-screen celebratory moment shown the first time a task is completed,
 * announcing the XP just earned. Portals over the current route, auto-dismisses
 * after a few seconds, and closes on click or Enter/Escape/Space. Under
 * prefers-reduced-motion the confetti is skipped and the card simply appears.
 */
export default function XpCelebration({
  amount,
  onDone,
}: {
  amount: number;
  onDone: () => void;
}) {
  const reducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Auto-close after the beat has landed.
  useEffect(() => {
    const t = setTimeout(onDone, 3600);
    return () => clearTimeout(t);
  }, [onDone]);

  // Dismiss on keypress.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === "Escape" || e.key === " ") {
        e.preventDefault();
        onDone();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onDone]);

  return createPortal(
    <div
      onClick={onDone}
      role="dialog"
      aria-modal="true"
      aria-label={`You earned ${amount} experience points`}
      className="fixed inset-0 z-[120] flex cursor-pointer flex-col items-center justify-center px-8 outline-none"
      style={{
        background:
          "radial-gradient(circle at 50% 40%, rgba(237,233,254,0.97) 0%, rgba(221,214,254,0.95) 60%, rgba(196,181,253,0.95) 100%)",
      }}
    >
      {!reducedMotion && <Confetti />}

      <div
        className={`relative flex flex-col items-center ${
          reducedMotion ? "" : "xp-celebrate-card"
        }`}
      >
        {/* Burst rings + XP coin */}
        <div className="relative flex h-32 w-32 items-center justify-center">
          {!reducedMotion && (
            <>
              <span className="xp-celebrate-ring absolute h-24 w-24 rounded-full border-4 border-lavender-400/60" />
              <span
                className="xp-celebrate-ring absolute h-24 w-24 rounded-full border-4 border-lavender-300/50"
                style={{ animationDelay: "0.2s" }}
              />
            </>
          )}
          <div
            className={`flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-lavender-500 to-lavender-700 text-white shadow-soft-lg ${
              reducedMotion ? "" : "xp-celebrate-coin"
            }`}
          >
            <Star size={42} strokeWidth={2.25} fill="currentColor" />
          </div>
        </div>

        {/* The awarded amount */}
        <p
          className={`mt-7 font-display text-6xl font-extrabold tracking-tight text-lavender-700 sm:text-7xl ${
            reducedMotion ? "" : "xp-celebrate-amount"
          }`}
        >
          +{amount} XP
        </p>
        <p className="mt-2 text-sm font-bold uppercase tracking-[0.25em] text-lavender-500">
          Experience earned
        </p>

        <p className="mt-8 flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.22em] text-lavender-400">
          <Sparkles size={12} strokeWidth={2.5} />
          Tap anywhere to continue
        </p>
      </div>
    </div>,
    document.body,
  );
}
