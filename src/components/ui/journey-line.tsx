// components/ui/journey-line.tsx
// Decorative brand motif: a car's life in the showroom drawn as one continuous
// line, from purchase to delivery. Purely illustrative — hidden from AT.

const STOPS = [
  { label: "Bought", x: 40, y: 232 },
  { label: "Papers", x: 152, y: 192 },
  { label: "Refurb", x: 264, y: 212 },
  { label: "In stock", x: 376, y: 146 },
  { label: "Booked", x: 488, y: 162 },
  { label: "Delivered", x: 600, y: 82 },
] as const;

// Index of the stop the car is currently at
const CURRENT = 4;

// Smooth curve through every stop: horizontal handles keep each stop on the line
function pathThrough(points: ReadonlyArray<{ x: number; y: number }>) {
  return points.reduce((d, p, i) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    const prev = points[i - 1];
    const dx = (p.x - prev.x) / 2;
    return `${d} C ${prev.x + dx} ${prev.y} ${p.x - dx} ${p.y} ${p.x} ${p.y}`;
  }, "");
}

const FULL_PATH = pathThrough(STOPS);
const DONE_PATH = pathThrough(STOPS.slice(0, CURRENT + 1));

type JourneyLineProps = {
  /** "dark" for the brand panel, "light" for the compact mobile strip */
  tone?: "dark" | "light";
  showLabels?: boolean;
  className?: string;
};

export function JourneyLine({
  tone = "dark",
  showLabels = true,
  className,
}: JourneyLineProps) {
  const dark = tone === "dark";
  const muted = dark ? "text-footer-muted" : "text-ink-subtle";
  const solid = dark ? "text-footer-ink" : "text-ink";
  const surface = dark ? "text-footer" : "text-canvas";

  return (
    <svg
      viewBox={showLabels ? "0 40 640 240" : "20 62 600 190"}
      className={className}
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      {/* The road ahead — faint dotted track */}
      <path
        d={FULL_PATH}
        className={`${muted} opacity-40`}
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeDasharray="1 7"
      />

      {/* Distance covered — draws itself in once */}
      <path
        d={DONE_PATH}
        pathLength={1}
        className="text-accent line-draw"
        stroke="currentColor"
        strokeWidth={dark ? 3 : 4}
        strokeLinecap="round"
      />

      {STOPS.map((stop, i) => {
        const isDone = i < CURRENT;
        const isCurrent = i === CURRENT;
        const labelAbove = i % 2 === 1;

        return (
          <g
            key={stop.label}
            className="rise-in"
            style={{ animationDelay: `${0.35 + i * 0.22}s` }}
          >
            {isCurrent && (
              <circle
                cx={stop.x}
                cy={stop.y}
                r={16}
                className="text-highlight opacity-25 origin-center [transform-box:fill-box] motion-safe:animate-ping"
                fill="currentColor"
              />
            )}
            <circle
              cx={stop.x}
              cy={stop.y}
              r={isCurrent ? 8 : 5.5}
              className={
                isCurrent ? "text-highlight" : isDone ? "text-accent" : surface
              }
              fill="currentColor"
            />
            {!isDone && !isCurrent && (
              <circle
                cx={stop.x}
                cy={stop.y}
                r={5.5}
                className={muted}
                stroke="currentColor"
                strokeWidth={1.5}
              />
            )}
            {isDone && (
              <circle cx={stop.x} cy={stop.y} r={2} className={surface} fill="currentColor" />
            )}

            {showLabels && (
              <text
                x={stop.x}
                y={labelAbove ? stop.y - 22 : stop.y + 32}
                textAnchor="middle"
                className={`font-mono text-[11px] uppercase tracking-[0.14em] ${
                  isCurrent ? solid : muted
                }`}
                fill="currentColor"
              >
                {stop.label}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
