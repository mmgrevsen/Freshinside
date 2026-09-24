"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Lader indhold glide blødt på plads, når man scroller ned til det.
 * Ren CSS + IntersectionObserver – ingen ekstra kodepakker, så siden
 * bliver ikke tungere af det.
 *
 * To ting gør, at det føles rigtigt frem for langsomt:
 *
 *  1. Bevægelsen er KORT (10 px) og HURTIG. Man skal ane, at noget
 *     landede – ikke vente på, at det kommer flyvende.
 *  2. Den starter, LIGE FØR indholdet er i syne (rootMargin). Så er
 *     det færdigt, når øjet når derned, i stedet for at man kigger
 *     på noget, der stadig er ved at tone frem.
 *
 * "from" bestemmer retningen. "immediate" springer ventetiden over
 * og bruges øverst på siden, hvor der ikke er noget at scrolle til.
 */
type Direction = "bottom" | "left" | "right" | "scale";

const hiddenStyles: Record<Direction, string> = {
  bottom: "translate-y-2.5 opacity-0",
  left: "-translate-x-3 opacity-0",
  right: "translate-x-3 opacity-0",
  scale: "scale-[0.98] opacity-0",
};

export function Reveal({
  children,
  delay = 0,
  from = "bottom",
  immediate = false,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  from?: Direction;
  /** Start med det samme i stedet for at vente på, at man scroller. */
  immediate?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // "immediate" bruger en ren CSS-animation og har hverken brug for
    // en observer eller for at vente på noget.
    if (immediate) return;

    const node = ref.current;
    if (!node) return;

    // Er indholdet allerede i syne, når siden åbnes (f.eks. hvis man
    // lander midt på siden via et link), skal det ikke vente.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        // Sæt i gang 12% af skærmhøjden før indholdet er i syne.
        rootMargin: "0px 0px -12% 0px",
        // Lav tærskel, så meget høje sektioner også bliver vist.
        threshold: 0.01,
      }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [immediate]);

  if (immediate) {
    return (
      <div
        className={`animate-enter ${className}`}
        style={{ animationDelay: `${delay}ms` }}
      >
        {children}
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={`transition-[opacity,transform] duration-[520ms] motion-reduce:transition-none ${
        isVisible ? "translate-x-0 translate-y-0 scale-100 opacity-100" : hiddenStyles[from]
      } ${className}`}
      style={{
        transitionDelay: `${delay}ms`,
        transitionTimingFunction: "var(--ease-soft)",
      }}
    >
      {children}
    </div>
  );
}
