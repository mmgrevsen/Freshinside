"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { pricingPackages } from "@/config/pricing";
import { addOns } from "@/config/addons";
import { serviceAreaConfig } from "@/config/serviceArea";
import { beforeVisitSteps } from "@/config/site";
import { weekSchedule, weekdayNames } from "@/config/schedule";
import { bookingDateRange } from "@/lib/schedule";
import { measureDistanceToCustomer, type AreaCheck } from "@/lib/distance";
import type { DawaAddress } from "@/lib/dawa";
import { Button } from "@/components/ui/Button";
import { AddressAutocomplete } from "@/components/ui/AddressAutocomplete";
import { AddressMapPicker } from "@/components/ui/AddressMapPicker";
import {
  BOOKING_SELECTION_EVENT,
  clearStoredSelection,
  readStoredSelection,
  type BookingSelection,
} from "@/lib/bookingSelection";
import {
  CheckIcon,
  ClockIcon,
  MailIcon,
  MapPinIcon,
  SparkleIcon,
} from "@/components/ui/icons";
import type { BookingRequest } from "@/types/booking";

type ContactFields = {
  name: string;
  phone: string;
  email: string;
  message: string;
};

const emptyContact: ContactFields = { name: "", phone: "", email: "", message: "" };

type Status = "idle" | "submitting" | "success" | "error";

const steps = ["Vælg service", "Tid & sted", "Dine oplysninger"] as const;

const inputClasses =
  "w-full rounded-xl border border-ink/15 bg-white px-4 py-3 text-sm text-ink placeholder:text-ink-soft/50 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20";
const labelClasses = "text-sm font-medium text-ink";

/** "fredag, lørdag og søndag" – læses ud af åbningstiderne. */
const openDaysText = (() => {
  const days = weekdayNames.filter((_, index) => weekSchedule[index].open);
  if (days.length === 0) return "";
  const lower = days.map((day) => day.toLowerCase());
  return lower.length === 1
    ? lower[0]
    : `${lower.slice(0, -1).join(", ")} og ${lower[lower.length - 1]}`;
})();

export function BookingForm() {
  const [step, setStep] = useState(0);
  const [packageId, setPackageId] = useState("");
  const [selectedAddOnIds, setSelectedAddOnIds] = useState<string[]>([]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [availability, setAvailability] = useState<{
    key: string;
    times: string[];
    message: string | null;
  } | null>(null);
  const [contact, setContact] = useState<ContactFields>(emptyContact);
  const [addressText, setAddressText] = useState("");
  const [selectedAddress, setSelectedAddress] = useState<DawaAddress | null>(null);
  const [areaCheck, setAreaCheck] = useState<(AreaCheck & { addressId: string }) | null>(
    null
  );
  const [showMap, setShowMap] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [confirmation, setConfirmation] = useState<BookingRequest | null>(null);

  // Overtager valget fra prissektionen eller quizzen – både når siden lige
  // er indlæst, og når kunden trykker "Vælg denne pakke" længere oppe.
  useEffect(() => {
    function applySelection(selection: BookingSelection) {
      setPackageId(selection.packageId);
      if (selection.addOnIds.length > 0) {
        setSelectedAddOnIds(selection.addOnIds);
      }
    }

    const stored = readStoredSelection();
    if (stored) {
      applySelection(stored);
    }

    function onSelection(event: Event) {
      applySelection((event as CustomEvent<BookingSelection>).detail);
    }

    window.addEventListener(BOOKING_SELECTION_EVENT, onSelection);
    return () => window.removeEventListener(BOOKING_SELECTION_EVENT, onSelection);
  }, []);

  // Henter de ledige tider, hver gang kunden vælger en dato eller pakke.
  useEffect(() => {
    if (!date || !packageId) return;

    const key = `${date}|${packageId}`;
    let cancelled = false;

    fetch(`/api/availability?date=${date}&packageId=${packageId}`)
      .then((response) => response.json())
      .then((data: { times?: string[]; message?: string | null }) => {
        if (cancelled) return;
        setAvailability({
          key,
          times: Array.isArray(data.times) ? data.times : [],
          message: data.message ?? null,
        });
      })
      .catch(() => {
        if (cancelled) return;
        setAvailability({
          key,
          times: [],
          message: "Kunne ikke hente de ledige tider lige nu. Prøv igen.",
        });
      });

    return () => {
      cancelled = true;
    };
  }, [date, packageId]);

  const handleAddressPicked = useCallback((address: DawaAddress) => {
    setSelectedAddress(address);
    setAddressText(address.text);
    setShowMap(false);
  }, []);

  useEffect(() => {
    if (!selectedAddress) return;

    let cancelled = false;
    measureDistanceToCustomer([
      selectedAddress.longitude,
      selectedAddress.latitude,
    ]).then((result) => {
      if (!cancelled) setAreaCheck({ addressId: selectedAddress.id, ...result });
    });

    return () => {
      cancelled = true;
    };
  }, [selectedAddress]);

  const currentCheck =
    selectedAddress && areaCheck?.addressId === selectedAddress.id ? areaCheck : null;
  const isMeasuring = selectedAddress !== null && currentCheck === null;
  const distanceKm = currentCheck?.distanceKm ?? null;
  const isInsideArea = currentCheck?.isInsideArea === true;
  const isOutsideArea = currentCheck?.isInsideArea === false;

  const chosenPackage = pricingPackages.find((pkg) => pkg.id === packageId);
  const chosenAddOns = addOns.filter((addOn) => selectedAddOnIds.includes(addOn.id));
  const totalPrice =
    (chosenPackage?.price ?? 0) +
    chosenAddOns.reduce((sum, addOn) => sum + addOn.price, 0);

  const dateRange = bookingDateRange();

  // Svaret hører kun til den dato og pakke, det blev hentet for.
  const availabilityKey = date && packageId ? `${date}|${packageId}` : "";
  const currentAvailability =
    availabilityKey && availability?.key === availabilityKey ? availability : null;
  const slotsLoading = availabilityKey !== "" && currentAvailability === null;
  const slots = currentAvailability?.times ?? [];
  const slotsMessage = currentAvailability?.message ?? null;
  const timeIsAvailable = time !== "" && slots.includes(time);

  const canContinue = [
    Boolean(packageId),
    Boolean(date && timeIsAvailable && isInsideArea),
    Boolean(contact.name && contact.phone && contact.email),
  ];

  function toggleAddOn(id: string) {
    setSelectedAddOnIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  }

  function resetForm() {
    setStep(0);
    setPackageId("");
    setSelectedAddOnIds([]);
    setDate("");
    setTime("");
    setAvailability(null);
    setContact(emptyContact);
    setAddressText("");
    setSelectedAddress(null);
    setAreaCheck(null);
    setStatus("idle");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedAddress || !chosenPackage) return;

    setStatus("submitting");
    setErrorMessage("");

    const payload: BookingRequest = {
      packageId,
      date,
      time,
      ...contact,
      address: selectedAddress.text,
      postalCode: selectedAddress.postalCode,
      addressId: selectedAddress.id,
      addOnIds: selectedAddOnIds,
      totalPrice,
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

      setConfirmation(payload);
      setStatus("success");
      clearStoredSelection();
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "Noget gik galt. Prøv igen."
      );
    }
  }

  if (status === "success" && confirmation) {
    const bookedPackage = pricingPackages.find(
      (pkg) => pkg.id === confirmation.packageId
    );
    const bookedAddOns = addOns.filter((addOn) =>
      confirmation.addOnIds.includes(addOn.id)
    );

    return (
      <div className="flex flex-col gap-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-500 text-white">
            <CheckIcon className="h-7 w-7" />
          </div>
          <h3 className="text-2xl font-semibold text-ink">Tak for din booking!</h3>
          <p className="max-w-md text-ink-soft">
            Din forespørgsel er sendt. Du hører fra FreshInside inden for kort tid,
            så vi kan bekræfte tid og sted.
          </p>
        </div>

        <div className="rounded-2xl border border-brand-200 bg-brand-50 p-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-700">
            Din forespørgsel
          </p>
          <dl className="mt-4 flex flex-col gap-2 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-ink-soft">Pakke</dt>
              <dd className="font-medium text-ink">{bookedPackage?.name}</dd>
            </div>
            {bookedAddOns.map((addOn) => (
              <div key={addOn.id} className="flex justify-between gap-4">
                <dt className="text-ink-soft">Ekstra</dt>
                <dd className="font-medium text-ink">{addOn.name}</dd>
              </div>
            ))}
            <div className="flex justify-between gap-4">
              <dt className="text-ink-soft">Dato</dt>
              <dd className="font-medium text-ink">{confirmation.date}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink-soft">Tidspunkt</dt>
              <dd className="font-medium text-ink">{confirmation.time}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink-soft">Adresse</dt>
              <dd className="text-right font-medium text-ink">{confirmation.address}</dd>
            </div>
            <div className="mt-2 flex justify-between gap-4 border-t border-brand-200 pt-3">
              <dt className="font-semibold text-ink">Estimeret pris</dt>
              <dd className="font-semibold text-ink">{confirmation.totalPrice} kr.</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-2xl border border-ink/10 bg-white p-6">
          <p className="text-sm font-semibold text-ink">Inden vi kommer</p>
          <ul className="mt-3 flex flex-col gap-2">
            {beforeVisitSteps.map((tip) => (
              <li key={tip} className="flex items-start gap-2.5 text-sm text-ink-soft">
                <CheckIcon className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-500" />
                {tip}
              </li>
            ))}
          </ul>
        </div>

        <Button variant="secondary" onClick={resetForm} className="self-center">
          Send en ny forespørgsel
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      {/* Trin-indikator */}
      <ol className="flex items-center gap-2">
        {steps.map((label, index) => (
          <li key={label} className="flex flex-1 flex-col gap-2">
            <span
              className={`h-1 rounded-full transition-colors duration-300 ${
                index <= step ? "bg-brand-500" : "bg-ink/10"
              }`}
            />
            <span
              className={`text-xs font-medium ${
                index === step ? "text-ink" : "text-ink-soft/70"
              }`}
            >
              {index + 1}. {label}
            </span>
          </li>
        ))}
      </ol>

      {/* Trin 1: Vælg service */}
      {step === 0 && (
        <div className="flex flex-col gap-6">
          <fieldset className="flex flex-col gap-3">
            <legend className={`${labelClasses} mb-2`}>Vælg din pakke</legend>
            {pricingPackages.map((pkg) => (
              <label
                key={pkg.id}
                className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors ${
                  packageId === pkg.id
                    ? "border-brand-500 bg-brand-50"
                    : "border-ink/10 bg-white hover:border-brand-300"
                }`}
              >
                <input
                  type="radio"
                  name="package"
                  value={pkg.id}
                  checked={packageId === pkg.id}
                  onChange={() => setPackageId(pkg.id)}
                  className="mt-1 h-4 w-4 accent-brand-600"
                />
                <span className="flex-1">
                  <span className="flex items-baseline justify-between gap-3">
                    <span className="font-semibold text-ink">{pkg.name}</span>
                    <span className="font-semibold text-ink">
                      {pkg.price} {pkg.priceSuffix}
                    </span>
                  </span>
                  <span className="mt-1 flex items-center gap-1.5 text-xs text-ink-soft">
                    <ClockIcon className="h-3.5 w-3.5" />
                    {pkg.duration}
                  </span>
                  <span className="mt-2 block text-sm text-ink-soft">
                    {pkg.description}
                  </span>
                </span>
              </label>
            ))}
          </fieldset>

          <fieldset className="flex flex-col gap-3">
            <legend className={`${labelClasses} mb-2`}>
              Ekstra services{" "}
              <span className="font-normal text-ink-soft">(valgfrit)</span>
            </legend>
            {addOns.map((addOn) => (
              <label
                key={addOn.id}
                className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors ${
                  selectedAddOnIds.includes(addOn.id)
                    ? "border-brand-400 bg-brand-50/60"
                    : "border-ink/10 bg-white hover:border-brand-300"
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedAddOnIds.includes(addOn.id)}
                  onChange={() => toggleAddOn(addOn.id)}
                  className="mt-1 h-4 w-4 accent-brand-600"
                />
                <span className="flex-1">
                  <span className="flex items-baseline justify-between gap-3">
                    <span className="font-medium text-ink">{addOn.name}</span>
                    <span className="text-sm font-medium text-ink">
                      +{addOn.price} kr.
                    </span>
                  </span>
                  <span className="mt-1 block text-sm text-ink-soft">
                    {addOn.description}
                  </span>
                </span>
              </label>
            ))}
          </fieldset>
        </div>
      )}

      {/* Trin 2: Tid & sted */}
      {step === 1 && (
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="date" className={labelClasses}>
                Ønsket dato
              </label>
              <input
                id="date"
                type="date"
                required
                min={dateRange.min}
                max={dateRange.max}
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                  setTime("");
                }}
                className={inputClasses}
              />
              <p className="text-xs text-ink-soft">
                Jeg kører ud {openDaysText}.
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="time" className={labelClasses}>
                Ledige tidspunkter
              </label>
              <select
                id="time"
                required
                disabled={!date || slots.length === 0}
                value={timeIsAvailable ? time : ""}
                onChange={(e) => setTime(e.target.value)}
                className={`${inputClasses} disabled:cursor-not-allowed disabled:bg-paper-muted disabled:text-ink-soft/60`}
              >
                <option value="">
                  {!date
                    ? "Vælg først en dato"
                    : slotsLoading
                      ? "Henter ledige tider..."
                      : slots.length === 0
                        ? "Ingen ledige tider"
                        : "Vælg et tidspunkt"}
                </option>
                {slots.map((slot) => (
                  <option key={slot} value={slot}>
                    kl. {slot}
                  </option>
                ))}
              </select>
              {slotsMessage && (
                <p className="text-xs text-amber-700">{slotsMessage}</p>
              )}
              {!slotsMessage && slots.length > 0 && chosenPackage && (
                <p className="text-xs text-ink-soft">
                  Sæt ca. {chosenPackage.duration.replace("Ca. ", "")} af.
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
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
        </div>
      )}

      {/* Trin 3: Dine oplysninger */}
      {step === 2 && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
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
              onChange={(e) => setContact({ ...contact, name: e.target.value })}
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
              onChange={(e) => setContact({ ...contact, phone: e.target.value })}
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
              onChange={(e) => setContact({ ...contact, email: e.target.value })}
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
              value={contact.message}
              onChange={(e) => setContact({ ...contact, message: e.target.value })}
              className={`${inputClasses} resize-none`}
            />
          </div>
        </div>
      )}

      {/* Løbende opsummering af pris */}
      {chosenPackage && (
        <div className="flex items-center justify-between gap-4 rounded-xl bg-paper-muted px-5 py-4">
          <div className="text-sm">
            <p className="font-medium text-ink">
              {chosenPackage.name}
              {chosenAddOns.length > 0 && ` + ${chosenAddOns.length} ekstra`}
            </p>
            <p className="text-ink-soft">{chosenPackage.duration}</p>
          </div>
          <p className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-ink">{totalPrice}</span>
            <span className="text-sm text-ink-soft">kr.</span>
          </p>
        </div>
      )}

      {status === "error" && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </p>
      )}

      <div className="flex flex-col gap-3 sm:flex-row-reverse">
        {step < steps.length - 1 ? (
          <Button
            type="button"
            size="lg"
            onClick={() => setStep((current) => current + 1)}
            disabled={!canContinue[step]}
            className="w-full disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:flex-1"
          >
            Fortsæt
          </Button>
        ) : (
          <Button
            type="submit"
            size="lg"
            disabled={status === "submitting" || !canContinue[2]}
            className="w-full disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:flex-1"
          >
            {status === "submitting" ? "Sender..." : "Send bookingforespørgsel"}
          </Button>
        )}

        {step > 0 && (
          <Button
            type="button"
            variant="secondary"
            size="lg"
            onClick={() => setStep((current) => current - 1)}
            className="w-full sm:w-auto"
          >
            Tilbage
          </Button>
        )}
      </div>

      <p className="flex items-center justify-center gap-2 text-center text-xs text-ink-soft">
        <SparkleIcon className="h-3.5 w-3.5 text-brand-500" />
        Dette er en forespørgsel – du får besked, når tid og sted er bekræftet.
      </p>
    </form>
  );
}
