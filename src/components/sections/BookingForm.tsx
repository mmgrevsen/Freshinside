"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { pricingPackages } from "@/config/pricing";
import { serviceAreaConfig } from "@/config/serviceArea";
import { measureDistanceToCustomer, type AreaCheck } from "@/lib/distance";
import type { DawaAddress } from "@/lib/dawa";
import { Button } from "@/components/ui/Button";
import { AddressAutocomplete } from "@/components/ui/AddressAutocomplete";
import { AddressMapPicker } from "@/components/ui/AddressMapPicker";
import { SELECTED_PACKAGE_STORAGE_KEY } from "@/lib/constants";
import { CheckIcon, MailIcon, MapPinIcon } from "@/components/ui/icons";
import type { BookingRequest } from "@/types/booking";

type ContactFields = {
  packageId: string;
  date: string;
  time: string;
  name: string;
  phone: string;
  email: string;
  message: string;
};

const emptyContact: ContactFields = {
  packageId: "",
  date: "",
  time: "",
  name: "",
  phone: "",
  email: "",
  message: "",
};

type Status = "idle" | "submitting" | "success" | "error";

const inputClasses =
  "w-full rounded-xl border border-ink/15 bg-white px-4 py-3 text-sm text-ink placeholder:text-ink-soft/50 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20";
const labelClasses = "text-sm font-medium text-ink";

export function BookingForm() {
  const [contact, setContact] = useState<ContactFields>(emptyContact);
  const [addressText, setAddressText] = useState("");
  const [selectedAddress, setSelectedAddress] = useState<DawaAddress | null>(null);
  const [areaCheck, setAreaCheck] = useState<(AreaCheck & { addressId: string }) | null>(
    null
  );
  const [showMap, setShowMap] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    try {
      const savedPackageId = window.sessionStorage.getItem(SELECTED_PACKAGE_STORAGE_KEY);
      if (savedPackageId) {
        // Synkroniserer med sessionStorage (kun tilgængelig i browseren), derfor
        // sat efter mount i stedet for i den lazy useState-initializer.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setContact((current) => ({ ...current, packageId: savedPackageId }));
      }
    } catch {
      // sessionStorage kan være utilgængelig – ikke kritisk, brugeren vælger blot pakke manuelt.
    }
  }, []);

  const handleAddressPicked = useCallback((address: DawaAddress) => {
    setSelectedAddress(address);
    setAddressText(address.text);
    setShowMap(false);
  }, []);

  // Henter den rigtige cykelrute-afstand, når kunden har valgt en adresse.
  useEffect(() => {
    if (!selectedAddress) return;

    let cancelled = false;
    measureDistanceToCustomer([
      selectedAddress.longitude,
      selectedAddress.latitude,
    ]).then((result) => {
      if (!cancelled) {
        setAreaCheck({ addressId: selectedAddress.id, ...result });
      }
    });

    return () => {
      cancelled = true;
    };
  }, [selectedAddress]);

  // Resultatet gælder kun den adresse, det blev målt på.
  const currentCheck =
    selectedAddress && areaCheck?.addressId === selectedAddress.id ? areaCheck : null;

  const isMeasuring = selectedAddress !== null && currentCheck === null;
  const distanceKm = currentCheck?.distanceKm ?? null;
  const isInsideArea = currentCheck?.isInsideArea === true;
  const isOutsideArea = currentCheck?.isInsideArea === false;

  const todayIsoDate = new Date().toISOString().split("T")[0];

  function updateField<K extends keyof ContactFields>(field: K, value: ContactFields[K]) {
    setContact((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedAddress) return;

    setStatus("submitting");
    setErrorMessage("");

    const payload: BookingRequest = {
      ...contact,
      address: selectedAddress.text,
      postalCode: selectedAddress.postalCode,
      addressId: selectedAddress.id,
    };

    try {
      const response = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok || !data.ok) {
        throw new Error(data.error || "Noget gik galt. Prøv igen.");
      }

      setStatus("success");
      setContact(emptyContact);
      setAddressText("");
      setSelectedAddress(null);
      setAreaCheck(null);
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
            value={contact.packageId}
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
            value={contact.date}
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
            value={contact.time}
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
            value={contact.name}
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
            value={contact.phone}
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
            value={contact.email}
            onChange={(e) => updateField("email", e.target.value)}
            className={inputClasses}
          />
        </div>

        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label htmlFor="address" className={labelClasses}>
            Adresse
          </label>
          <AddressAutocomplete
            id="address"
            value={addressText}
            inputClassName={inputClasses}
            onChange={(text) => {
              setAddressText(text);
              setSelectedAddress(null);
              setAreaCheck(null);
            }}
            onSelect={handleAddressPicked}
          />

          <button
            type="button"
            onClick={() => setShowMap((open) => !open)}
            className="mt-1 w-fit text-sm font-medium text-brand-700 underline underline-offset-4 hover:text-brand-800"
          >
            {showMap ? "Skjul kortet" : "Eller vælg din adresse på et kort"}
          </button>

          {showMap && (
            <div className="mt-2">
              <AddressMapPicker onPick={handleAddressPicked} />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label htmlFor="message" className={labelClasses}>
            Besked (valgfrit)
          </label>
          <textarea
            id="message"
            rows={4}
            placeholder="Fortæl f.eks. om bilens stand, eller hvor du gerne vil mødes."
            value={contact.message}
            onChange={(e) => updateField("message", e.target.value)}
            className={`${inputClasses} resize-none`}
          />
        </div>
      </div>

      {!selectedAddress && addressText.trim().length > 0 && (
        <p className="text-sm text-ink-soft">
          Vælg din adresse i listen (eller på kortet), så vi kan se, om vi kører ud til dig.
        </p>
      )}

      {isMeasuring && (
        <p className="text-sm text-ink-soft">Beregner cykelruten til din adresse...</p>
      )}

      {isInsideArea && (
        <p className="flex items-center gap-2 rounded-xl bg-brand-50 px-4 py-3 text-sm text-brand-700">
          <MapPinIcon className="h-4 w-4 flex-shrink-0" />
          Din adresse ligger inden for mit område
          {distanceKm !== null &&
            ` (ca. ${distanceKm} km ${currentCheck?.isCyclingRoute ? "på cykel" : "herfra"})`}
          {" "}– du kan booke direkte.
        </p>
      )}

      {isOutsideArea && (
        <div className="flex flex-col gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-900">
          <p className="font-medium">
            {serviceAreaConfig.outOfAreaMessage}
            {distanceKm !== null &&
              ` (Der er ca. ${distanceKm} km ${currentCheck?.isCyclingRoute ? "at cykle" : "i fugleflugt"}.)`}
          </p>
          <a
            href={`mailto:${serviceAreaConfig.outOfAreaEmail}?subject=${encodeURIComponent(
              "Forespørgsel om bilrengøring uden for området"
            )}&body=${encodeURIComponent(`Hej Marcus\n\nJeg bor på ${addressText} og vil gerne høre, om du alligevel kan komme forbi.\n\nVenlig hilsen\n`)}`}
            className="inline-flex w-fit items-center gap-2 rounded-full bg-ink px-5 py-2.5 font-medium text-white transition-colors hover:bg-brand-700"
          >
            <MailIcon className="h-4 w-4" />
            Skriv til {serviceAreaConfig.outOfAreaEmail}
          </a>
        </div>
      )}

      {status === "error" && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </p>
      )}

      <Button
        type="submit"
        size="lg"
        disabled={status === "submitting" || !isInsideArea}
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
