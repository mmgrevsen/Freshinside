import {
  SELECTED_PACKAGE_STORAGE_KEY,
  SUGGESTED_ADDONS_STORAGE_KEY,
} from "@/lib/constants";

/**
 * OVERFØRSEL AF VALG TIL BOOKING-FORMULAREN
 * ------------------------------------------------
 * Når kunden trykker "Vælg denne pakke" i prissektionen eller "Book"
 * i quizzen, skal booking-formularen længere nede på siden opdatere sig.
 *
 * Formularen er allerede indlæst på det tidspunkt, så det er ikke nok at
 * gemme valget – vi sender også en besked (et event), som formularen
 * lytter efter. Det gemte valg bruges, hvis siden bliver genindlæst.
 */

export const BOOKING_SELECTION_EVENT = "freshinside:booking-selection";

export type BookingSelection = {
  packageId: string;
  addOnIds: string[];
};

/** Gemmer valget og fortæller booking-formularen, at den skal opdatere sig. */
export function selectForBooking(selection: BookingSelection) {
  try {
    window.sessionStorage.setItem(SELECTED_PACKAGE_STORAGE_KEY, selection.packageId);
    window.sessionStorage.setItem(
      SUGGESTED_ADDONS_STORAGE_KEY,
      JSON.stringify(selection.addOnIds)
    );
  } catch {
    // sessionStorage kan være utilgængelig – eventet virker stadig.
  }

  window.dispatchEvent(
    new CustomEvent<BookingSelection>(BOOKING_SELECTION_EVENT, { detail: selection })
  );
}

/** Læser et tidligere gemt valg (bruges, når siden lige er indlæst). */
export function readStoredSelection(): BookingSelection | null {
  try {
    const packageId = window.sessionStorage.getItem(SELECTED_PACKAGE_STORAGE_KEY);
    if (!packageId) return null;

    const rawAddOns = window.sessionStorage.getItem(SUGGESTED_ADDONS_STORAGE_KEY);
    const parsed = rawAddOns ? JSON.parse(rawAddOns) : [];

    return {
      packageId,
      addOnIds: Array.isArray(parsed)
        ? parsed.filter((id): id is string => typeof id === "string")
        : [],
    };
  } catch {
    return null;
  }
}

/** Rydder valget, når bookingen er sendt. */
export function clearStoredSelection() {
  try {
    window.sessionStorage.removeItem(SELECTED_PACKAGE_STORAGE_KEY);
    window.sessionStorage.removeItem(SUGGESTED_ADDONS_STORAGE_KEY);
  } catch {
    // Ikke kritisk.
  }
}
