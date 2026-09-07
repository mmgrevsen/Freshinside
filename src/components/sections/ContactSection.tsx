import { contactInfo, openingHours } from "@/config/contact";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ClockIcon, MailIcon, MapPinIcon, PhoneIcon } from "@/components/ui/icons";

const contactItems = [
  {
    icon: PhoneIcon,
    label: "Telefon",
    value: contactInfo.phone.display,
    href: contactInfo.phone.href,
  },
  {
    icon: MailIcon,
    label: "E-mail",
    value: contactInfo.email.display,
    href: contactInfo.email.href,
  },
  {
    icon: MapPinIcon,
    label: "Område",
    value: contactInfo.area,
    href: undefined,
  },
];

export function ContactSection() {
  return (
    <section id="kontakt" className="py-20 sm:py-28">
      <Container className="flex flex-col items-center gap-14">
        <Reveal>
          <SectionHeading
            eyebrow="Kontakt"
            title="Har du spørgsmål?"
            description="Ring, skriv eller send en booking – jeg svarer så hurtigt som muligt."
          />
        </Reveal>

        <div className="grid w-full max-w-3xl grid-cols-1 gap-6 sm:grid-cols-2">
          {contactItems.map((item) => (
            <div
              key={item.label}
              className="flex items-start gap-4 rounded-2xl border border-ink/10 bg-white p-6"
            >
              <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                <item.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-ink-soft">
                  {item.label}
                </p>
                {item.href ? (
                  <a href={item.href} className="text-lg font-medium text-ink hover:text-brand-700">
                    {item.value}
                  </a>
                ) : (
                  <p className="text-lg font-medium text-ink">{item.value}</p>
                )}
              </div>
            </div>
          ))}

          <div className="flex items-start gap-4 rounded-2xl border border-ink/10 bg-white p-6">
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600">
              <ClockIcon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-ink-soft">
                Åbningstider
              </p>
              <ul className="mt-1 flex flex-col gap-0.5">
                {openingHours.map((entry) => (
                  <li key={entry.days} className="flex justify-between gap-4 text-sm text-ink">
                    <span className="text-ink-soft">{entry.days}</span>
                    <span className="font-medium">{entry.hours}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
