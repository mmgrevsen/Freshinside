"use client";

import { useEffect, useState } from "react";
import { bookingAnchor, navLinks, siteConfig } from "@/config/site";
import { Button } from "@/components/ui/Button";
import { CloseIcon, MenuIcon } from "@/components/ui/icons";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        isScrolled || isOpen
          ? "bg-paper/90 shadow-sm shadow-ink/5 backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
        <a href="#forside" className="flex items-center gap-2 text-lg font-bold tracking-tight text-ink">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-sm font-bold text-brand-300">
            F
          </span>
          {siteConfig.name}
        </a>

        <ul className="hidden items-center gap-7 lg:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm font-medium text-ink-soft transition-colors hover:text-ink"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden lg:block">
          <Button as="a" href={bookingAnchor} size="md">
            Book en rengøring
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full text-ink lg:hidden"
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
          aria-label={isOpen ? "Luk menu" : "Åbn menu"}
        >
          {isOpen ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
        </button>
      </nav>

      {isOpen && (
        <div
          id="mobile-menu"
          className="border-t border-ink/10 bg-paper px-5 pb-8 pt-2 lg:hidden"
        >
          <ul className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block rounded-lg px-3 py-3 text-base font-medium text-ink-soft transition-colors hover:bg-paper-muted hover:text-ink"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <Button
            as="a"
            href={bookingAnchor}
            size="lg"
            className="mt-4 w-full"
            onClick={() => setIsOpen(false)}
          >
            Book en rengøring
          </Button>
        </div>
      )}
    </header>
  );
}
