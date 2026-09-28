import Image from "next/image";
import { beforeAfterItems } from "@/config/gallery";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

/**
 * FØR & EFTER
 * ------------------------------------------------
 * Marcus' egne billeder fra rigtige biler. Billederne er kun rettet
 * i lys og skarphed – efter samme regel for både "før" og "efter", så
 * resultatet ikke ser bedre ud, end arbejdet var.
 *
 * Billederne skiftes i src/config/gallery.ts.
 */
export function BeforeAfterSection() {
  return (
    <section id="foer-efter" className="py-20 sm:py-28">
      <Container className="flex flex-col items-center gap-12">
        <Reveal>
          <SectionHeading
            eyebrow="Før & efter"
            title="Se forskellen med det samme"
            description="Billeder fra en rigtig bil, jeg har haft fingrene i. Ingen pynt – kun lys og skarphed er rettet, og præcis lige meget på begge billeder."
          />
        </Reveal>

        <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {beforeAfterItems.map((item, index) => (
            <Reveal key={item.id} delay={(index % 3) * 90}>
              <figure className="card-lift overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-sm shadow-ink/5">
                <div className="grid grid-cols-2 gap-px bg-ink/10">
                  <div className="relative aspect-[4/5] bg-paper-muted">
                    <Image
                      src={item.before}
                      alt={`${item.title} før rengøring`}
                      fill
                      className="object-cover"
                      sizes="(min-width: 1024px) 190px, (min-width: 768px) 240px, 45vw"
                    />
                    <span className="absolute left-2 top-2 rounded-full bg-ink/85 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white backdrop-blur-sm">
                      Før
                    </span>
                  </div>
                  <div className="relative aspect-[4/5] bg-paper-muted">
                    <Image
                      src={item.after}
                      alt={`${item.title} efter rengøring`}
                      fill
                      className="object-cover"
                      sizes="(min-width: 1024px) 190px, (min-width: 768px) 240px, 45vw"
                    />
                    <span className="absolute left-2 top-2 rounded-full bg-brand-500 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
                      Efter
                    </span>
                  </div>
                </div>

                <figcaption className="px-4 py-3.5">
                  <p className="font-semibold text-ink">{item.title}</p>
                  {item.note && (
                    <p className="mt-0.5 text-sm text-ink-soft">{item.note}</p>
                  )}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
