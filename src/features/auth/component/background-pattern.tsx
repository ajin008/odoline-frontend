// components/layout/background-pattern.tsx
export function BackgroundPattern() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <svg
        className="absolute inset-0 h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="line-grid"
            x="0"
            y="0"
            width="120"
            height="120"
            patternUnits="userSpaceOnUse"
          >
            {/* Vertical lines */}
            <path
              d="M 120 0 L 0 0 0 120"
              fill="none"
              stroke="rgba(39, 39, 39, 0.06)"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#line-grid)" />
      </svg>
    </div>
  );
}
