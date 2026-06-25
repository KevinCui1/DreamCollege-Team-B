const COLORS = ["#6366f1", "#a855f7", "#22c55e", "#f59e0b", "#ec4899", "#06b6d4"];
const PIECE_COUNT = 40;

const pieces = Array.from({ length: PIECE_COUNT }, (_, i) => ({
  id: i,
  left: Math.random() * 100,
  delay: Math.random() * 1.5,
  duration: 2.5 + Math.random() * 1.8,
  color: COLORS[i % COLORS.length],
  rotation: Math.random() * 360,
}));

/** Brief full-screen confetti burst. Unmount after ~2s via the caller. */
export default function Confetti() {
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {pieces.map((piece) => (
        <span
          key={piece.id}
          className="absolute top-[-10px] h-2.5 w-1.5 rounded-sm animate-confetti-fall"
          style={{
            left: `${piece.left}%`,
            backgroundColor: piece.color,
            animationDelay: `${piece.delay}s`,
            animationDuration: `${piece.duration}s`,
            transform: `rotate(${piece.rotation}deg)`,
          }}
        />
      ))}
    </div>
  );
}
