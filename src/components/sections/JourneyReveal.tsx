"use client";

import * as React from "react";

interface JourneyRevealProps {
  children: React.ReactNode;
}

const emptySubscribe = () => () => {};

function useIsMounted() {
  return React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

export function JourneyReveal({ children }: JourneyRevealProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const isMounted = useIsMounted();
  const [isRevealed, setIsRevealed] = React.useState(false);

  React.useEffect(() => {
    // If user prefers reduced motion, set revealed without animation
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      queueMicrotask(() => setIsRevealed(true));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsRevealed(true);
          if (containerRef.current) {
            observer.unobserve(containerRef.current);
          }
        }
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      data-mounted={isMounted ? "true" : "false"}
      data-revealed={isRevealed ? "true" : "false"}
      className="journey-reveal-wrapper"
    >
      {children}
    </div>
  );
}
