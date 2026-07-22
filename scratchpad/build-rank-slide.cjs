const pptxgen = require("pptxgenjs");

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13.33 x 7.5
pres.author = "Kevin Cui";
pres.title = "Rank System & Rank-Up Screen";

// ── Palette (pulled from the app's rank-up moment) ──────────────────────────
const BG = "FDFCFF";
const INK = "1E1B2E";
const INK_MUTED = "6A6380";
const INK_SOFT = "9B94AD";
const PURPLE = "6D28D9";
const PURPLE_DEEP = "5B21B6";
const PURPLE_SOFT = "A78BFA";
const LAV = "EDE9FE";
const LAV_LT = "F5F3FF";
const WHITE = "FFFFFF";

const HEAD = "Helvetica Neue";
const BODY = "Helvetica Neue";

const slide = pres.addSlide();
slide.background = { color: BG };

const softShadow = () => ({ type: "outer", color: "5B21B6", blur: 10, offset: 3, angle: 90, opacity: 0.1 });

// ── Eyebrow chip ────────────────────────────────────────────────────────────
slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
  x: 0.7, y: 0.5, w: 3.05, h: 0.42, rectRadius: 0.21,
  fill: { color: LAV }, line: { type: "none" },
});
slide.addText("MY WORK · RANK SYSTEM", {
  x: 0.7, y: 0.5, w: 3.05, h: 0.42, align: "center", valign: "middle",
  fontFace: HEAD, fontSize: 11, bold: true, color: PURPLE, charSpacing: 2,
});

// ── Title + subtitle ─────────────────────────────────────────────────────────
slide.addText("Turning a checklist into a game", {
  x: 0.66, y: 1.05, w: 6.5, h: 1.35, margin: 0,
  fontFace: HEAD, fontSize: 40, bold: true, color: INK, lineSpacingMultiple: 0.98,
});
slide.addText(
  "The rank system is the heart of our gamification goal: every completed activity earns XP, and XP unlocks ranks — so progress is something students can see, feel, and chase.",
  {
    x: 0.7, y: 2.42, w: 6.25, h: 0.9, margin: 0,
    fontFace: BODY, fontSize: 14.5, color: INK_MUTED, lineSpacingMultiple: 1.15,
  }
);

// ── Rank ladder ───────────────────────────────────────────────────────────────
slide.addText("THE RANK LADDER  ·  DERIVED LIVE FROM XP", {
  x: 0.7, y: 3.42, w: 6.25, h: 0.3, margin: 0,
  fontFace: HEAD, fontSize: 11, bold: true, color: PURPLE_DEEP, charSpacing: 1.5,
});

const ladderX = 0.7, ladderY = 3.78, ladderW = 6.25, ladderH = 2.28;
slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
  x: ladderX, y: ladderY, w: ladderW, h: ladderH, rectRadius: 0.12,
  fill: { color: LAV_LT }, line: { color: LAV, width: 1 },
});

const ranks = [
  { n: "Explorer", t: "Your journey starts here.", xp: "0 XP" },
  { n: "Planner", t: "Course charted — you know where you're headed.", xp: "200 XP" },
  { n: "Builder", t: "Your career plan is taking shape.", xp: "400 XP" },
  { n: "Launch Ready", t: "Your applications are ready for liftoff.", xp: "700 XP" },
];

const rowH = 0.5;
const firstRowY = ladderY + 0.14;
ranks.forEach((r, i) => {
  const ry = firstRowY + i * (rowH + 0.02);
  const bx = ladderX + 0.22, by = ry + 0.03, bs = 0.44;

  // badge
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: bx, y: by, w: bs, h: bs, rectRadius: 0.1,
    fill: { color: PURPLE }, line: { type: "none" }, shadow: softShadow(),
  });
  // chevron insignia inside badge (the app's rank motif)
  const cxL = bx + 0.11, cy = by + 0.14, armW = 0.11, armH = 0.13;
  slide.addShape(pres.shapes.LINE, {
    x: cxL, y: cy, w: armW, h: armH, flipV: true,
    line: { color: WHITE, width: 2.25, endArrowType: "none" },
  });
  slide.addShape(pres.shapes.LINE, {
    x: cxL + armW, y: cy, w: armW, h: armH, flipV: false,
    line: { color: WHITE, width: 2.25, endArrowType: "none" },
  });

  // name + tagline
  slide.addText(r.n, {
    x: bx + bs + 0.22, y: ry - 0.02, w: 3.7, h: 0.26, margin: 0,
    fontFace: HEAD, fontSize: 15, bold: true, color: INK, valign: "middle",
  });
  slide.addText(r.t, {
    x: bx + bs + 0.22, y: ry + 0.24, w: 4.0, h: 0.24, margin: 0,
    fontFace: BODY, fontSize: 10.5, color: INK_SOFT, valign: "middle",
  });

  // xp threshold, right aligned
  slide.addText(r.xp, {
    x: ladderX + ladderW - 1.35, y: ry, w: 1.13, h: 0.44, margin: 0,
    fontFace: HEAD, fontSize: 15, bold: true, color: PURPLE, align: "right", valign: "middle",
  });
});

// ── "How it serves the goal" strip (bottom-left) ─────────────────────────────
slide.addText(
  [
    { text: "Why it works:  ", options: { bold: true, color: PURPLE_DEEP } },
    { text: "ranks are always derived from XP (never stored), a full-screen ", options: { color: INK_MUTED } },
    { text: "rank-up moment", options: { bold: true, color: INK } },
    { text: " fires once per level, and reset re-runs the whole journey.", options: { color: INK_MUTED } },
  ],
  { x: 0.7, y: 6.25, w: 6.25, h: 0.55, margin: 0, fontFace: BODY, fontSize: 12, lineSpacingMultiple: 1.1 }
);

// ── RIGHT COLUMN: rank-up screen + picture room ──────────────────────────────
const rX = 7.45, rW = 5.15;

slide.addText("THE RANK-UP SCREEN  ·  MY DESIGN", {
  x: rX, y: 0.55, w: rW, h: 0.3, margin: 0,
  fontFace: HEAD, fontSize: 11, bold: true, color: PURPLE_DEEP, charSpacing: 1.5,
});

// Frame 1 — hero rank-up celebration screenshot
const f1y = 0.98, f1h = 3.05;
slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
  x: rX, y: f1y, w: rW, h: f1h, rectRadius: 0.1,
  fill: { color: LAV_LT }, line: { color: PURPLE_SOFT, width: 1.5, dashType: "dash" },
});
slide.addText("RANK-UP CELEBRATION", {
  x: rX, y: f1y + 1.05, w: rW, h: 0.3, align: "center", margin: 0,
  fontFace: HEAD, fontSize: 13, bold: true, color: PURPLE, charSpacing: 1,
});
slide.addText("▽  drop screenshot here", {
  x: rX, y: f1y + 1.4, w: rW, h: 0.3, align: "center", margin: 0,
  fontFace: BODY, fontSize: 12, color: INK_SOFT,
});

// design-detail caption chips under hero
const chips = ["Full-screen moment", "Chevron insignia", "Animated tier track", "Fires once / rank"];
let chipX = rX;
const chipY = f1y + f1h + 0.16, chipH = 0.36, chipGap = 0.12;
const chipW = (rW - chipGap) / 2;
chips.forEach((c, i) => {
  const col = i % 2, row = Math.floor(i / 2);
  const cx = rX + col * (chipW + chipGap);
  const cy = chipY + row * (chipH + 0.1);
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: cx, y: cy, w: chipW, h: chipH, rectRadius: 0.18,
    fill: { color: LAV }, line: { type: "none" },
  });
  slide.addText(c, {
    x: cx, y: cy, w: chipW, h: chipH, align: "center", valign: "middle", margin: 0,
    fontFace: HEAD, fontSize: 11.5, bold: true, color: PURPLE_DEEP,
  });
});

// Frame 2 — experience bar / dashboard screenshot
const f2y = chipY + 2 * chipH + 0.1 + 0.18, f2h = 7.5 - f2y - 0.62;
slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
  x: rX, y: f2y, w: rW, h: f2h, rectRadius: 0.1,
  fill: { color: LAV_LT }, line: { color: PURPLE_SOFT, width: 1.5, dashType: "dash" },
});
slide.addText(
  [
    { text: "EXPERIENCE BAR — DASHBOARD", options: { bold: true, color: PURPLE, fontSize: 13, breakLine: true, charSpacing: 1 } },
    { text: "▽  drop screenshot here", options: { color: INK_SOFT, fontSize: 12 } },
  ],
  { x: rX, y: f2y, w: rW, h: f2h, align: "center", valign: "middle", margin: 0, fontFace: HEAD, lineSpacingMultiple: 1.6 }
);

// ── Footer ───────────────────────────────────────────────────────────────────
slide.addShape(pres.shapes.LINE, {
  x: 0.7, y: 7.0, w: 11.93, h: 0, line: { color: LAV, width: 1 },
});
slide.addText(
  [
    { text: "Also on me:  ", options: { bold: true, color: PURPLE_DEEP } },
    { text: "the project scaffold and the LLM integration", options: { color: INK_MUTED } },
    { text: "  — covered in a later section.", options: { color: INK_SOFT, italic: true } },
  ],
  { x: 0.7, y: 7.08, w: 9, h: 0.32, margin: 0, fontFace: BODY, fontSize: 11.5, valign: "middle" }
);
slide.addText("Dream College  ·  Rank System", {
  x: 9.6, y: 7.08, w: 3.03, h: 0.32, align: "right", valign: "middle", margin: 0,
  fontFace: HEAD, fontSize: 10.5, color: INK_SOFT,
});

pres.writeFile({ fileName: "outputs/rank-system-overview.pptx" }).then((f) => console.log("wrote", f));
