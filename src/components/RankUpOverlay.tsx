import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useRank } from "../context/RankContext";
import { ranks, type Rank } from "../data/ranks";

/**
 * App-native palette: white for foreground contrast inside the emblem, very light
 * lavender for atmosphere, and a strong purple for the rank-up energy (emblem,
 * title, impact, confirmation). No second hue — the moment reads as part of the app.
 */
const LAVENDER = "#ede9fe";
const LAVENDER_DEEP = "#ddd6fe";
const PURPLE = "#6d28d9";
const PURPLE_DEEP = "#5b21b6";
const PURPLE_SOFT = "#a78bfa";
const WHITE = "#ffffff";

/**
 * The rank insignia: a stack of upward chevrons, one per earned rank
 * (`rank.order + 1`). The previous rank's chevrons sit settled; the top chevron is
 * the newly-earned one and is the element that snaps in.
 */
function ChevronStack({
  count,
  reducedMotion,
}: {
  count: number;
  reducedMotion: boolean;
}) {
  const pitch = 17; // vertical gap between nested chevrons
  const armH = 15; // height of a chevron's arms
  const chevW = 60; // chevron span
  const stroke = 7;
  const padX = 12;
  const padTop = 12;
  const padBottom = 10;

  const vbW = chevW + stroke + padX * 2;
  const cx = vbW / 2;
  const maxIndex = count - 1;
  const vbH = padTop + maxIndex * pitch + armH + padBottom;
  const left = cx - chevW / 2;
  const right = cx + chevW / 2;

  return (
    <svg
      viewBox={`0 0 ${vbW} ${vbH}`}
      className="w-24 sm:w-28"
      role="presentation"
      aria-hidden="true"
    >
      {Array.from({ length: count }, (_, i) => {
        const isNew = i === maxIndex; // top chevron = newest, climbs highest
        const peakY = padTop + (maxIndex - i) * pitch;
        const points = `${left},${peakY + armH} ${cx},${peakY} ${right},${peakY + armH}`;
        return (
          <polyline
            key={i}
            points={points}
            fill="none"
            stroke={WHITE}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={isNew ? 1 : 0.8}
            className={isNew && !reducedMotion ? "rankup-chevron-new" : undefined}
          />
        );
      })}
    </svg>
  );
}

/**
 * The four-rank tier track. The earned rule advances to the new node, earned nodes
 * are solid purple, the newly-earned node locks in last, future nodes are hollow.
 */
function TierTrack({
  earnedOrder,
  reducedMotion,
}: {
  earnedOrder: number;
  reducedMotion: boolean;
}) {
  const nodeX = (i: number) => 45 + i * 90;
  const y = 32;
  const first = nodeX(0);
  const last = nodeX(ranks.length - 1);
  const newX = nodeX(earnedOrder);

  return (
    <svg
      viewBox="0 0 360 64"
      className="w-full"
      role="presentation"
      aria-hidden="true"
    >
      {/* The full track, faint. */}
      <line
        x1={first}
        y1={y}
        x2={last}
        y2={y}
        stroke={PURPLE_SOFT}
        strokeWidth={2}
        opacity={0.5}
      />
      {/* The earned stretch, drawing up to the new node. */}
      <line
        x1={first}
        y1={y}
        x2={newX}
        y2={y}
        stroke={PURPLE}
        strokeWidth={2}
        pathLength={100}
        className={reducedMotion ? undefined : "rankup-track-rule"}
      />

      {ranks.map((r) => {
        const x = nodeX(r.order);
        const isNew = r.order === earnedOrder;
        const earned = r.order < earnedOrder;
        const fill = isNew || earned ? PURPLE : WHITE;

        return (
          <g key={r.id}>
            <circle
              cx={x}
              cy={y}
              r={isNew ? 8 : 6}
              fill={fill}
              stroke={isNew || earned ? "none" : PURPLE_SOFT}
              strokeWidth={isNew || earned ? 0 : 2}
              className={isNew && !reducedMotion ? "rankup-track-node" : undefined}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            />
            <text
              x={x}
              y={14}
              textAnchor="middle"
              fontSize={9}
              fontWeight={600}
              letterSpacing="0.1em"
              fill={isNew ? PURPLE : earned ? PURPLE_DEEP : "#a8a0c9"}
              style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}
            >
              {String(r.order + 1).padStart(2, "0")}
            </text>
            <text
              x={x}
              y={52}
              textAnchor="middle"
              fontSize={10}
              fontWeight={isNew ? 700 : 500}
              fill={isNew ? PURPLE_DEEP : earned ? "#6d5fa6" : "#a8a0c9"}
            >
              {r.name}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/**
 * Decorative light-purple mesh filling the lower two-thirds of the overlay. A grid
 * of nodes rolls with a slow idle wave and rises toward the cursor (a soft Gaussian
 * lift that trails the smoothed pointer), with small chevron "motes" drifting up
 * through it — all on-motif accents that grow busier with `level`. Pure canvas
 * drawing — `pointer-events-none` and aria-hidden, so it never blocks the dismiss
 * click. Under prefers-reduced-motion it paints a single static frame and attaches
 * no animation loop or pointer listeners.
 */
function MeshField({
  level,
  reducedMotion,
}: {
  level: number;
  reducedMotion: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Density / energy step up slightly with rank so higher tiers feel busier.
    const COL_GAP = 40 - level * 3; // 37 / 34 / 31
    const ROW_GAP = 28 - level * 2; // 26 / 24 / 22
    const MARGIN = 90; // extra points beyond the edges so the mesh bleeds off-screen
    const WAVE_AMP = 11 + level * 1.5; // idle swell height
    const WAVE_SPEED = 0.0012;
    const LIFT_AMP = 80 + level * 8; // how high the mesh rises toward the cursor
    const SIGMA = 140; // radius of the cursor's influence
    const EASE = 0.12; // pointer / influence smoothing
    const MOTE_COUNT = level * 3; // drifting chevrons: 3 / 6 / 9

    let width = 0;
    let height = 0;

    // Smoothed cursor in canvas space; `influence` eases 0..1 with the pointer's
    // presence so the lift fades in and out instead of snapping.
    const pointer = { x: 0, y: 0, tx: 0, ty: 0, influence: 0, target: 0 };

    // Drifting chevron motes (canvas px). Re-seeded on resize.
    const motes: { x: number; y: number; v: number; s: number }[] = [];
    const seedMotes = () => {
      motes.length = 0;
      for (let i = 0; i < MOTE_COUNT; i++) {
        motes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          v: 0.15 + Math.random() * 0.28, // upward px/frame
          s: 7 + Math.random() * 6, // chevron half-span
        });
      }
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seedMotes();
    };

    const draw = (t: number) => {
      pointer.x += (pointer.tx - pointer.x) * EASE;
      pointer.y += (pointer.ty - pointer.y) * EASE;
      pointer.influence += (pointer.target - pointer.influence) * EASE;

      ctx.clearRect(0, 0, width, height);

      const cols = Math.ceil((width + MARGIN * 2) / COL_GAP);
      const rows = Math.ceil((height + MARGIN * 2) / ROW_GAP);

      // Resolve every node position once (idle wave + cursor lift).
      const pts: { x: number; y: number }[][] = [];
      for (let r = 0; r <= rows; r++) {
        const row: { x: number; y: number }[] = [];
        const baseY = -MARGIN + r * ROW_GAP;
        for (let c = 0; c <= cols; c++) {
          const baseX = -MARGIN + c * COL_GAP;
          const wave =
            Math.sin(baseX * 0.018 + t * WAVE_SPEED + baseY * 0.01) * WAVE_AMP;
          let y = baseY + wave;
          if (pointer.influence > 0.001) {
            const dx = baseX - pointer.x;
            const dy = y - pointer.y;
            const d2 = dx * dx + dy * dy;
            y -= LIFT_AMP * pointer.influence * Math.exp(-d2 / (2 * SIGMA * SIGMA));
          }
          row.push({ x: baseX, y });
        }
        pts.push(row);
      }

      // Draw per row (alpha is constant across a row), fading toward the top so
      // the mesh dissolves into the lavender field instead of ending in a hard line.
      for (let r = 0; r <= rows; r++) {
        const baseY = -MARGIN + r * ROW_GAP;
        const a = Math.max(0, Math.min(1, baseY / height));
        if (a <= 0) continue;

        ctx.strokeStyle = `rgba(167, 139, 250, ${0.7 * a})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let c = 0; c <= cols; c++) {
          const p = pts[r][c];
          if (c < cols) {
            const q = pts[r][c + 1];
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
          }
          if (r < rows) {
            const q = pts[r + 1][c];
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
          }
        }
        ctx.stroke();

        ctx.fillStyle = `rgba(196, 181, 253, ${0.95 * a})`;
        ctx.beginPath();
        for (let c = 0; c <= cols; c++) {
          const p = pts[r][c];
          ctx.moveTo(p.x + 1.7, p.y);
          ctx.arc(p.x, p.y, 1.7, 0, Math.PI * 2);
        }
        ctx.fill();
      }

      // Drifting chevron motes, fading toward the top like the mesh.
      ctx.lineWidth = 2;
      for (const m of motes) {
        const a = Math.max(0, Math.min(1, m.y / height)) * 0.55;
        if (a <= 0) continue;
        ctx.strokeStyle = `rgba(167, 139, 250, ${a})`;
        ctx.beginPath();
        ctx.moveTo(m.x - m.s, m.y + m.s * 0.5);
        ctx.lineTo(m.x, m.y - m.s * 0.5);
        ctx.lineTo(m.x + m.s, m.y + m.s * 0.5);
        ctx.stroke();
      }
    };

    resize();

    // Reduced motion: one calm static frame, no loop, no pointer follow.
    if (reducedMotion) {
      draw(0);
      const onResize = () => {
        resize();
        draw(0);
      };
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
    }

    const onResize = () => resize();
    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.tx = e.clientX - rect.left;
      pointer.ty = e.clientY - rect.top;
      pointer.target = 1;
    };
    const onLeave = () => {
      pointer.target = 0;
    };

    let raf = 0;
    const loop = (t: number) => {
      // Advance motes upward; wrap back to the bottom when they exit the top.
      for (const m of motes) {
        m.y -= m.v;
        if (m.y < -m.s * 2) {
          m.y = height + m.s * 2;
          m.x = Math.random() * width;
        }
      }
      draw(t);
      raf = window.requestAnimationFrame(loop);
    };
    raf = window.requestAnimationFrame(loop);

    window.addEventListener("resize", onResize);
    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);

    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, [level, reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-2/3 w-full"
    />
  );
}

/**
 * Halo rings + radial spokes radiating from the emblem — an instrument-dial /
 * mission-control flourish whose density grows with `level`. Centered on the card
 * (via margins, not transforms, so the pulse animation doesn't fight the
 * centering) and rendered behind it. Decorative: aria-hidden, pointer-events-none.
 */
function HaloRings({
  level,
  reducedMotion,
}: {
  level: number;
  reducedMotion: boolean;
}) {
  const size = 460;
  const c = size / 2;
  const baseR = 118; // innermost ring sits just outside the emblem card
  const ringGap = 44;
  const ringCount = 1 + level; // 2 / 3 / 4
  const showSpokes = level >= 2;
  const spokeCount = level >= 3 ? 16 : 12;
  const outerR = baseR + (ringCount - 1) * ringGap;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 top-1/2 z-0"
      style={{ width: size, height: size, marginLeft: -c, marginTop: -c }}
    >
      <div className={`h-full w-full ${reducedMotion ? "" : "rankup-halo"}`}>
        <svg
          viewBox={`0 0 ${size} ${size}`}
          className={`h-full w-full ${reducedMotion ? "" : "rankup-orbit"}`}
        >
          {showSpokes &&
            Array.from({ length: spokeCount }, (_, i) => {
              const ang = (i / spokeCount) * Math.PI * 2;
              const r1 = baseR - 14;
              const r2 = outerR + 24;
              return (
                <line
                  key={`spoke-${i}`}
                  x1={c + Math.cos(ang) * r1}
                  y1={c + Math.sin(ang) * r1}
                  x2={c + Math.cos(ang) * r2}
                  y2={c + Math.sin(ang) * r2}
                  stroke="rgba(124, 58, 237, 0.13)"
                  strokeWidth={1}
                />
              );
            })}
          {Array.from({ length: ringCount }, (_, i) => (
            <circle
              key={`ring-${i}`}
              cx={c}
              cy={c}
              r={baseR + i * ringGap}
              fill="none"
              stroke={`rgba(124, 58, 237, ${0.3 - i * 0.05})`}
              strokeWidth={1.5}
              strokeDasharray={i === 0 ? undefined : "2 11"}
            />
          ))}
        </svg>
      </div>
    </div>
  );
}

/**
 * HUD corner brackets framing the whole moment, appearing at level >= 2 and
 * growing at level 3. Decorative: aria-hidden, pointer-events-none, behind content.
 */
function CornerFrame({
  level,
  reducedMotion,
}: {
  level: number;
  reducedMotion: boolean;
}) {
  if (level < 2) return null;

  const len = level >= 3 ? 56 : 40;
  const thick = level >= 3 ? 2 : 1.5;
  const inset = 28;
  const color = "rgba(124, 58, 237, 0.45)";
  const corners = [
    { top: inset, left: inset, borderTop: true, borderLeft: true },
    { top: inset, right: inset, borderTop: true, borderRight: true },
    { bottom: inset, left: inset, borderBottom: true, borderLeft: true },
    { bottom: inset, right: inset, borderBottom: true, borderRight: true },
  ];

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 z-0 ${
        reducedMotion ? "" : "rankup-fade"
      }`}
      style={reducedMotion ? undefined : { animationDelay: "500ms" }}
    >
      {corners.map((corner, i) => {
        const edge = `${thick}px solid ${color}`;
        return (
          <span
            key={i}
            className="absolute"
            style={{
              top: corner.top,
              left: corner.left,
              right: corner.right,
              bottom: corner.bottom,
              width: len,
              height: len,
              borderTop: corner.borderTop ? edge : undefined,
              borderLeft: corner.borderLeft ? edge : undefined,
              borderRight: corner.borderRight ? edge : undefined,
              borderBottom: corner.borderBottom ? edge : undefined,
            }}
          />
        );
      })}
    </div>
  );
}

function OverlayContent({ rank }: { rank: Rank }) {
  const { onRankUpComplete } = useRank();
  const dialogRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useRef(
    typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  ).current;

  // The promotion sequence plays once, then the overlay waits for the student to
  // dismiss it — a click anywhere (or Enter/Escape/Space) calls onRankUpComplete
  // (which records celebratedOrder so the rank never replays).
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === "Escape" || e.key === " ") {
        e.preventDefault();
        onRankUpComplete();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onRankUpComplete]);

  // Move focus into the overlay on mount and restore it on close, so focus is
  // never left trapped or lost while the (non-interactive) overlay is up.
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    dialogRef.current?.focus();
    return () => {
      if (previouslyFocused && document.contains(previouslyFocused)) {
        previouslyFocused.focus();
      }
    };
  }, []);

  const fadeClass = reducedMotion ? "" : "rankup-fade";
  const fadeStyle = (delayMs: number) =>
    reducedMotion ? undefined : { animationDelay: `${delayMs}ms` };
  const chevronCount = rank.order + 1;
  // Decoration scales with the rank reached (1 Navigator → 3 Launch Ready).
  const level = rank.order;

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-live="polite"
      aria-label={`New rank reached: ${rank.name}`}
      tabIndex={-1}
      onClick={onRankUpComplete}
      className={`fixed inset-0 z-[100] flex cursor-pointer flex-col items-center justify-center px-8 outline-none ${
        reducedMotion ? "" : "rankup-field"
      }`}
      style={{
        background: `radial-gradient(circle at 50% 38%, ${LAVENDER_DEEP} 0%, ${LAVENDER} 62%)`,
        color: PURPLE_DEEP,
      }}
    >
      {/* Living mesh backdrop — sits behind everything, never blocks the dismiss. */}
      <MeshField level={level} reducedMotion={reducedMotion} />
      {/* HUD corner frame — appears at higher ranks. */}
      <CornerFrame level={level} reducedMotion={reducedMotion} />

      <div className="relative z-10 flex w-full flex-col items-center">
        {/* Eyebrow */}
        <span
          className={`text-xs font-bold uppercase tracking-[0.45em] ${fadeClass}`}
          style={{ color: PURPLE, paddingLeft: "0.45em", ...fadeStyle(250) }}
        >
          Rank Up
        </span>

        {/* Emblem: purple insignia card with halo rings radiating behind it. */}
        <div className="relative mt-6 flex items-center justify-center">
          <HaloRings level={level} reducedMotion={reducedMotion} />
          <div className={`relative z-10 ${reducedMotion ? "" : "rankup-card"}`}>
            <div
              className={`relative flex h-40 w-40 items-center justify-center rounded-3xl sm:h-44 sm:w-44 ${
                reducedMotion ? "" : "rankup-thunk"
              }`}
              style={{
                background: `linear-gradient(160deg, ${PURPLE} 0%, ${PURPLE_DEEP} 100%)`,
                border: `1px solid ${PURPLE_SOFT}`,
                boxShadow: "0 18px 38px -16px rgba(91, 33, 182, 0.55)",
              }}
            >
              {/* A single impact ring expands as the new chevron lands. */}
              {!reducedMotion && (
                <span
                  aria-hidden="true"
                  className="rankup-impact pointer-events-none absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full"
                  style={{ border: `3px solid ${PURPLE_SOFT}` }}
                />
              )}
              <ChevronStack count={chevronCount} reducedMotion={reducedMotion} />
            </div>
          </div>
        </div>

        {/* Rank name — the reveal. */}
        <h2
          className={`mt-8 text-center text-5xl font-extrabold tracking-tight sm:text-6xl ${
            reducedMotion ? "" : "rankup-title"
          }`}
          style={{ color: PURPLE_DEEP }}
        >
          {rank.name}
        </h2>

        {/* Tier track — the advance. */}
        <div className="mt-10 w-full max-w-md">
          <TierTrack earnedOrder={rank.order} reducedMotion={reducedMotion} />
        </div>

        {/* Confirmation lockup — the final state. */}
        <div
          className={`mt-6 flex items-center gap-2 ${fadeClass}`}
          style={fadeStyle(2350)}
        >
          <span className="h-px w-6" style={{ backgroundColor: PURPLE }} />
          <span
            className="text-xs font-semibold uppercase tracking-[0.3em]"
            style={{ color: PURPLE }}
          >
            Promotion Confirmed
          </span>
          <span className="h-px w-6" style={{ backgroundColor: PURPLE }} />
        </div>

        {/* Dismiss hint — fades in once the sequence has settled. */}
        <span
          className={`mt-8 text-xs font-medium uppercase tracking-[0.25em] ${fadeClass}`}
          style={{ color: PURPLE_SOFT, ...fadeStyle(2800) }}
        >
          Tap anywhere to continue
        </span>
      </div>
    </div>
  );
}

/**
 * Full-screen rank-up moment. Portals over the current route (so navigation and
 * page state are untouched), plays the promotion sequence, then stays up until the
 * student dismisses it. Renders nothing when no rank-up is pending.
 */
export default function RankUpOverlay() {
  const { pendingRankUp } = useRank();
  if (!pendingRankUp) return null;
  // `key` remounts the content per rank so a back-to-back rank-up replays cleanly.
  return createPortal(
    <OverlayContent key={pendingRankUp.id} rank={pendingRankUp} />,
    document.body,
  );
}
