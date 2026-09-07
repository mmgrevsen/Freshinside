"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Bløder sektioner diskret ind i synsfeltet, når man scroller.
 * Ren CSS-transition + IntersectionObserver – ingen ekstra afhængigheder,
 * så hjemmesiden forbliver hurtig at indlæse.
 *
 * "from" bestemmer, hvilken retning indholdet glider ind fra.
 */
type Direction = "bottom" | "left" | "right" | "scale";

const hiddenStyles: Record<Direction, string> = {
  bottom: "translate-y-6 opacity-0",
  left: "-translate-x-6 opacity-0",
  right: "translate-x-6 opacity-0",
  scale: "scale-95 opacity-0",
};

export function Reveal({
  children,
  delay = 0,
  from = "bottom",
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  from?: Direction;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out motion-reduce:transition-none ${
        isVisible ? "translate-x-0 translate-y-0 scale-100 opacity-100" : hiddenStyles[from]
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
