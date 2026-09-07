"use client";

import { useEffect, useId, useRef, useState } from "react";
import { searchAddresses, type DawaAddress } from "@/lib/dawa";
import { MapPinIcon } from "@/components/ui/icons";

/**
 * Adressefelt med forslag, mens man skriver.
 * Forslagene kommer fra Danmarks officielle adresseregister, så vi er
 * sikre på, at adressen findes – og vi får de præcise koordinater med,
 * så afstanden kan regnes rigtigt ud.
 */
export function AddressAutocomplete({
  value,
  onChange,
  onSelect,
  inputClassName = "",
  id,
}: {
  value: string;
  onChange: (text: string) => void;
  onSelect: (address: DawaAddress) => void;
  inputClassName?: string;
  id?: string;
}) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const listboxId = `${inputId}-forslag`;

  const [suggestions, setSuggestions] = useState<DawaAddress[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  // Sættes når brugeren vælger et forslag, så vi ikke straks søger igen på samme tekst.
  const justSelectedRef = useRef(false);

  useEffect(() => {
    if (justSelectedRef.current) {
      justSelectedRef.current = false;
      return;
    }

    if (value.trim().length < 3) {
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      try {
        const results = await searchAddresses(value, controller.signal);
        setSuggestions(results);
        setIsOpen(results.length > 0);
        setHighlighted(-1);
      } catch {
        // Afbrudt søgning eller netværksfejl – kunden kan stadig skrive adressen selv.
      }
    }, 250);

    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [value]);

  useEffect(() => {
    function onClickOutside(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function choose(address: DawaAddress) {
    justSelectedRef.current = true;
    onSelect(address);
    setIsOpen(false);
    setSuggestions([]);
    setHighlighted(-1);
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (!isOpen || suggestions.length === 0) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlighted((current) => (current + 1) % suggestions.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlighted((current) =>
        current <= 0 ? suggestions.length - 1 : current - 1
      );
    } else if (event.key === "Enter" && highlighted >= 0) {
      event.preventDefault();
      choose(suggestions[highlighted]);
    } else if (event.key === "Escape") {
      setIsOpen(false);
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <input
        id={inputId}
        type="text"
        required
        autoComplete="off"
        placeholder="Begynd at skrive din adresse..."
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={onKeyDown}
        onFocus={() => suggestions.length > 0 && setIsOpen(true)}
        className={inputClassName}
        role="combobox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        aria-autocomplete="list"
        aria-activedescendant={
          highlighted >= 0 ? `${listboxId}-${highlighted}` : undefined
        }
      />

      {isOpen && suggestions.length > 0 && (
        <ul
          id={listboxId}
          role="listbox"
          className="absolute z-20 mt-2 max-h-64 w-full overflow-auto rounded-xl border border-ink/10 bg-white py-1 shadow-xl shadow-ink/10"
        >
          {suggestions.map((address, index) => (
            <li key={address.id} id={`${listboxId}-${index}`} role="option" aria-selected={index === highlighted}>
              <button
                type="button"
                onClick={() => choose(address)}
                onMouseEnter={() => setHighlighted(index)}
                className={`flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm transition-colors ${
                  index === highlighted ? "bg-brand-50 text-brand-800" : "text-ink-soft"
                }`}
              >
                <MapPinIcon className="h-4 w-4 flex-shrink-0 text-brand-500" />
                {address.text}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
