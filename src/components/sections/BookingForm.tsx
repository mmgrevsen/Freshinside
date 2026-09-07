"use client";

import { useEffect, useState, type FormEvent } from "react";
import { pricingPackages } from "@/config/pricing";
import { serviceAreaConfig } from "@/config/serviceArea";
import { checkServiceArea } from "@/lib/distance";
import { Button } from "@/components/ui/Button";
import { SELECTED_PACKAGE_STORAGE_KEY } from "@/lib/constants";
import { CheckIcon, MailIcon, MapPinIcon } from "@/components/ui/icons";
import type { BookingRequest } from "@/types/booking";

const emptyForm: BookingRequest = {
  packageId: "",
  date: "",
  time: "",
  name: "",
  phone: "",
  email: "",
  address: "",
  postalCode: "",
  message: "",
};

type Status = "idle" | "submitting" | "success" | "error";
type AreaStatus = "unknown" | "checking" | "inside" | "outside";

/** Resultatet af et områdetjek, sammen med den adresse det gælder for. */
type AreaResult = {
  postalCode: string;
  address: string;
  isInsideArea: boolean;
  distanceKm: number | null;
};

const inputClasses =
  "w-full rounded-xl border border-ink/15 bg-white px-4 py-3 text-sm text-ink placeholder:text-ink-soft/50 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20";
const labelClasses = "text-sm font-medium text-ink";

export function BookingForm() {
  const [form, setForm] = useState<BookingRequest>(emptyForm);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [areaResult, setAreaResult] = useState<AreaResult | null>(null);

  useEffect(() => {
    try {
      const savedPackageId = window.sessionStorage.getItem(SELECTED_PACKAGE_STORAGE_KEY);
      if (savedPackageId) {
        // Synkroniserer med sessionStorage (kun tilgængelig i browseren), derfor
        // sat efter mount i stedet for i den lazy useState-initializer.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setForm((current) => ({ ...current, packageId: savedPackageId }));
      }
    } catch {
      // sessionStorage kan være utilgængelig – ikke kritisk, brugeren vælger blot pakke manuelt.
    }
  }, []);

  // Slår kundens område op, kort tid efter postnummeret er skrevet færdigt.
  const { postalCode, address } = form;
  const hasValidPostalCode = /^\d{4}$/.test(postalCode);

  useEffect(() => {
    if (!/^\d{4}$/.test(postalCode)) return;

    let cancelled = false;
    const timer = window.setTimeout(async () => {
      const result = await checkServiceArea(address, postalCode);
      if (cancelled) return;
      setAreaResult({ postalCode, address, ...result });
    }, 500);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [postalCode, address]);

  // Resultatet gælder kun, hvis adressen ikke er ændret siden opslaget.
  const resolvedArea =
    areaResult &&
    areaResult.postalCode === postalCode &&
    areaResult.address === address
      ? areaResult
      : null;

  const areaStatus: AreaStatus = !hasValidPostalCode
    ? "unknown"
    : resolvedArea
      ? resolvedArea.isInsideArea
        ? "inside"
        : "outside"
      : "checking";

  const distanceKm = resolvedArea?.distanceKm ?? null;

  const todayIsoDate = new Date().toISOString().split("T")[0];

  function updateField<K extends keyof BookingRequest>(field: K, value: BookingRequest[K]) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    try {
      const response = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        if (data.outOfArea) {
          setAreaResult({
            postalCode,
            address,
            isInsideArea: false,
            distanceKm: null,
          });
        }
        throw new Error(data.error || "Noget gik galt. Prøv igen.");
      }

      setStatus("success");
      setForm(emptyForm);
      setAreaResult(null);
      try {
        window.sessionStorage.removeItem(SELECTED_PACKAGE_STORAGE_KEY);
      } catch {
        // Ikke kritisk.
      }
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "Noget gik galt. Prøv igen."
      );
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-brand-200 bg-brand-50 px-8 py-14 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-500 text-white">
          <CheckIcon className="h-7 w-7" />
        </div>
        <h3 className="text-2xl font-semibold text-ink">Tak for din booking!</h3>
        <p className="max-w-md text-ink-soft">
          Din bookingforespørgsel er sendt. Du hører fra FreshInside inden
          for kort tid for at bekræfte tid og sted.
        </p>
        <Button variant="secondary" onClick={() => setStatus("idle")}>
          Send en ny forespørgsel
        </Button>
      </div>
    );
  }

  const isOutsideArea = areaStatus === "outside";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label htmlFor="packageId" className={labelClasses}>
            Rengøringspakke
          </label>
          <select
            id="packageId"
            required
            value={form.packageId}
            onChange={(e) => updateField("packageId", e.target.value)}
            className={inputClasses}
          >
            <option value="" disabled>
              Vælg en pakke
            </option>
            {pricingPackages.map((pkg) => (
              <option key={pkg.id} value={pkg.id}>
                {pkg.name} – {pkg.price} {pkg.priceSuffix}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="date" className={labelClasses}>
            Ønsket dato
          </label>
          <input
            id="date"
            type="date"
            required
            min={todayIsoDate}
            value={form.date}
            onChange={(e) => updateField("date", e.target.value)}
            className={inputClasses}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="time" className={labelClasses}>
            Ønsket tidspunkt
          </label>
          <input
            id="time"
            type="time"
            required
            value={form.time}
            onChange={(e) => updateField("time", e.target.value)}
            className={inputClasses}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className={labelClasses}>
            Navn
          </label>
          <input
            id="name"
            type="text"
            required
            autoComplete="name"
            placeholder="Dit fulde navn"
            value={form.name}
            onChange={(e) => updateField("name", e.target.value)}
            className={inputClasses}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="phone" className={labelClasses}>
            Telefonnummer
          </label>
          <input
            id="phone"
            type="tel"
            required
            autoComplete="tel"
            placeholder="12 34 56 78"
            value={form.phone}
            onChange={(e) => updateField("phone", e.target.value)}
            className={inputClasses}
          />
        </div>

        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label htmlFor="email" className={labelClasses}>
            E-mail
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            placeholder="dig@eksempel.dk"
            value={form.email}
            onChange={(e) => updateField("email", e.target.value)}
            className={inputClasses}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="address" className={labelClasses}>
            Adresse
          </label>
          <input
            id="address"
            type="text"
            required
            autoComplete="street-address"
            placeholder="Vejnavn 12"
            value={form.address}
            onChange={(e) => updateField("address", e.target.value)}
            className={inputClasses}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="postalCode" className={labelClasses}>
            Postnummer
          </label>
          <input
            id="postalCode"
            type="text"
            inputMode="numeric"
            pattern="[0-9]{4}"
            maxLength={4}
            required
            autoComplete="postal-code"
            placeholder="9000"
            value={form.postalCode}
            onChange={(e) =>
              updateField("postalCode", e.target.value.replace(/\D/g, "").slice(0, 4))
            }
            className={inputClasses}
          />
        </div>

        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label htmlFor="message" className={labelClasses}>
            Besked (valgfrit)
          </label>
          <textarea
            id="message"
            rows={4}
            placeholder="Fortæl f.eks. om bilens stand, eller hvor du gerne vil mødes."
            value={form.message}
            onChange={(e) => updateField("message", e.target.value)}
            className={`${inputClasses} resize-none`}
          />
        </div>
      </div>

      {areaStatus === "checking" && (
        <p className="text-sm text-ink-soft">Tjekker om jeg kører ud til dig...</p>
      )}

      {areaStatus === "inside" && (
        <p className="flex items-center gap-2 rounded-xl bg-brand-50 px-4 py-3 text-sm text-brand-700">
          <MapPinIcon className="h-4 w-4 flex-shrink-0" />
          Din adresse ligger inden for mit område
          {distanceKm !== null ? ` (ca. ${distanceKm} km herfra)` : ""} – du kan booke direkte.
        </p>
      )}

      {isOutsideArea && (
        <div className="flex flex-col gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-900">
          <p className="font-medium">
            {serviceAreaConfig.outOfAreaMessage}
            {distanceKm !== null ? ` (Din adresse er ca. ${distanceKm} km væk.)` : ""}
          </p>
          <a
            href={`mailto:${serviceAreaConfig.outOfAreaEmail}?subject=${encodeURIComponent(
              "Forespørgsel om bilrengøring uden for området"
            )}`}
            className="inline-flex w-fit items-center gap-2 rounded-full bg-ink px-5 py-2.5 font-medium text-white transition-colors hover:bg-brand-700"
          >
            <MailIcon className="h-4 w-4" />
            Skriv til {serviceAreaConfig.outOfAreaEmail}
          </a>
        </div>
      )}

      {status === "error" && !isOutsideArea && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </p>
      )}

      <Button
        type="submit"
        size="lg"
        disabled={status === "submitting" || isOutsideArea}
        className="w-full disabled:cursor-not-allowed disabled:opacity-50"
      >
        {status === "submitting" ? "Sender..." : "Send bookingforespørgsel"}
      </Button>

      <p className="text-center text-xs text-ink-soft">
        Dette er en forespørgsel, ikke en endelig bekræftelse. Du hører fra
        FreshInside for at bekræfte tid og sted.
      </p>
    </form>
  );
}
