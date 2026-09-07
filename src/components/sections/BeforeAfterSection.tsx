import Image from "next/image";
import { beforeAfterItems } from "@/config/gallery";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Badge } from "@/components/ui/Badge";
import { Reveal } from "@/components/ui/Reveal";

export function BeforeAfterSection() {
  return (
    <section id="foer-efter" className="py-20 sm:py-28">
      <Container className="flex flex-col items-center gap-10">
        <Reveal>
          <SectionHeading
            eyebrow="Før & efter"
            title="Se forskellen med det samme"
            description="Eksempler på, hvordan en rengøring kan forvandle bilens indvendige overflader."
          />
        </Reveal>

        <Reveal>
          <Badge tone="outline">Eksempelbilleder – erstattes med rigtige billeder</Badge>
        </Reveal>

        <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {beforeAfterItems.map((item, index) => (
            <Reveal key={item.id} delay={(index % 3) * 100}>
              <div className="overflow-hidden rounded-2xl border border-ink/10 bg-white">
                <div className="grid grid-cols-2">
                  <div className="relative aspect-square">
                    <Image
                      src={item.before}
                      alt={`${item.title} – før rengøring (eksempelbillede)`}
                      fill
                      className="object-cover"
                      sizes="(min-width: 1024px) 200px, (min-width: 640px) 260px, 45vw"
                    />
                    <span className="absolute left-2 top-2 rounded-full bg-ink/80 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
                      Før
                    </span>
                  </div>
                  <div className="relative aspect-square">
                    <Image
                      src={item.after}
                      alt={`${item.title} – efter rengøring (eksempelbillede)`}
                      fill
                      className="object-cover"
                      sizes="(min-width: 1024px) 200px, (min-width: 640px) 260px, 45vw"
                    />
                    <span className="absolute left-2 top-2 rounded-full bg-brand-500 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
                      Efter
                    </span>
                  </div>
                </div>
                <p className="px-4 py-3 text-sm font-medium text-ink">{item.title}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
