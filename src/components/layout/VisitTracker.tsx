"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * BESØGSTÆLLER
 * ------------------------------------------------
 * Sender et kort livstegn, mens nogen kigger på hjemmesiden, så du kan
 * se på /admin, hvor mange der er inde.
 *
 * Vi gemmer BEVIDST ingenting om personen: der sendes kun et tilfældigt
 * tal, som kun findes, så længe fanen er åben, og som forsvinder igen.
 * Ingen cookie, ingen IP-adresse, intet der kan genkende nogen senere.
 * Derfor skal siden heller ikke have en cookie-boks.
 */

const STORAGE_KEY = "freshinside_session";
const HEARTBEAT_MS = 60_000;

function sessionId(): string {
  try {
    const existing = window.sessionStorage.getItem(STORAGE_KEY);
    if (existing) return existing;

    const fresh = Math.random().toString(36).slice(2) + Date.now().toString(36);
    window.sessionStorage.setItem(STORAGE_KEY, fresh);
    return fresh;
  } catch {
    // Kan sessionStorage ikke bruges, tæller besøget bare som nyt.
    return Math.random().toString(36).slice(2) + Date.now().toString(36);
  }
}

export function VisitTracker() {
  const pathname = usePathname();
  // Dine egne besøg på /admin skal ikke tælle med i tallene.
  const skip = pathname?.startsWith("/admin") ?? false;

  useEffect(() => {
    if (skip) return;

    const id = sessionId();
    let isFirstView = true;

    function ping(extra: Record<string, boolean> = {}) {
      const body = JSON.stringify({ id, first: isFirstView, ...extra });
      isFirstView = false;

      fetch("/api/visit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true,
      }).catch(() => {
        // En besøgstæller må aldrig larme i konsollen hos kunden.
      });
    }

    ping();

    // Livstegn så længe fanen er fremme.
    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible") ping();
    }, HEARTBEAT_MS);

    function onHidden() {
      if (document.visibilityState === "hidden") ping({ leaving: true });
      else ping();
    }

    document.addEventListener("visibilitychange", onHidden);

    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", onHidden);
    };
  }, [skip]);

  return null;
}
