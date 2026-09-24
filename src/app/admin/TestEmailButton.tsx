"use client";

import { useState } from "react";

/** Sender en testmail til dig selv, så du kan se at mails virker. */
export function TestEmailButton() {
  const [state, setState] = useState<"idle" | "sending">("idle");
  const [result, setResult] = useState<{ ok: boolean; text: string } | null>(null);

  async function send() {
    setState("sending");
    setResult(null);

    try {
      const response = await fetch("/api/admin/test-email", { method: "POST" });
      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data.error || "Kunne ikke sende testmailen.");
      }

      setResult({
        ok: true,
        text: `Sendt til ${data.sentTo}. Tjek din indbakke – kig også i spam første gang.`,
      });
    } catch (caught) {
      setResult({
        ok: false,
        text: caught instanceof Error ? caught.message : "Kunne ikke sende testmailen.",
      });
    } finally {
      setState("idle");
    }
  }

  return (
    <div className="mt-3">
      <button
        type="button"
        onClick={send}
        disabled={state === "sending"}
        className="rounded-full border border-ink/15 bg-white px-4 py-2 text-sm font-medium text-ink transition-colors hover:border-brand-400 disabled:opacity-60"
      >
        {state === "sending" ? "Sender..." : "Send en testmail til mig selv"}
      </button>

      {result && (
        <p
          className={`mt-2 rounded-xl px-4 py-3 text-sm ${
            result.ok ? "bg-brand-50 text-brand-800" : "bg-amber-50 text-amber-900"
          }`}
        >
          {result.text}
        </p>
      )}
    </div>
  );
}
