import Link from "next/link";
import { bookingAnchor, siteConfig } from "@/config/site";

const footerLinks = [
  { label: "Forside", href: "#forside" },
  { label: "Priser", href: "#priser" },
  { label: "Booking", href: bookingAnchor },
  { label: "Kontakt", href: "#kontakt" },
  { label: "Privatlivspolitik", href: "/privatlivspolitik" },
];

const socialLabels = {
  instagram: "Instagram",
  facebook: "Facebook",
  tiktok: "TikTok",
} as const;

export function Footer() {
  const socialEntries = Object.entries(siteConfig.social).filter(
    ([, url]) => url
  ) as [keyof typeof socialLabels, string][];

  return (
    <footer className="bg-ink text-white/80">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-5 py-14 sm:px-8 lg:flex-row lg:justify-between">
        <div className="max-w-sm">
          <p className="text-xl font-bold text-white">{siteConfig.name}</p>
          <p className="mt-2 text-sm italic text-brand-200">{siteConfig.slogan}</p>
          <p className="mt-4 text-sm leading-relaxed text-white/60">
            {siteConfig.shortDescription}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-white/50">
              Naviger
            </p>
            <ul className="mt-4 flex flex-col gap-3 text-sm">
              {footerLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-white/70 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {socialEntries.length > 0 && (
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-white/50">
                Følg med
              </p>
              <ul className="mt-4 flex flex-col gap-3 text-sm">
                {socialEntries.map(([key, url]) => (
                  <li key={key}>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/70 transition-colors hover:text-white"
                    >
                      {socialLabels[key]}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-white/10 py-6">
        <p className="px-5 text-center text-xs text-white/40 sm:px-8">
          © {new Date().getFullYear()} {siteConfig.name}. Alle rettigheder forbeholdes.
        </p>
      </div>
    </footer>
  );
}
