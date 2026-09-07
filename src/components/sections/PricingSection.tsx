import { pricingPackages } from "@/config/pricing";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Badge } from "@/components/ui/Badge";
import { Reveal } from "@/components/ui/Reveal";
import { CheckIcon } from "@/components/ui/icons";
import { PackageSelectLink } from "@/components/sections/PackageSelectLink";

export function PricingSection() {
  return (
    <section id="priser" className="py-20 sm:py-28">
      <Container className="flex flex-col items-center gap-14">
        <Reveal>
          <SectionHeading
            eyebrow="Priser"
            title="Find den pakke, der passer til din bil"
            description="Tre enkle pakker – vælg den, der matcher, hvor grundig en rengøring bilen har brug for."
          />
        </Reveal>

        <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-3">
          {pricingPackages.map((pkg, index) => (
            <Reveal key={pkg.id} delay={index * 100}>
              <div
                className={`relative flex h-full flex-col gap-6 rounded-2xl border p-8 transition-shadow duration-300 hover:shadow-xl hover:shadow-ink/5 ${
                  pkg.popular
                    ? "border-brand-400 bg-white shadow-lg shadow-brand-500/10"
                    : "border-ink/10 bg-white"
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <Badge tone="brand">Mest populær</Badge>
                  </div>
                )}

                <div>
                  <h3 className="text-xl font-semibold text-ink">{pkg.name}</h3>
                  <p className="mt-1 text-sm text-ink-soft">{pkg.description}</p>
                </div>

                <p className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold tracking-tight text-ink">
                    {pkg.price}
                  </span>
                  <span className="text-sm font-medium text-ink-soft">
                    {pkg.priceSuffix}
                  </span>
                </p>

                <ul className="flex flex-1 flex-col gap-3">
                  {pkg.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm text-ink-soft">
                      <CheckIcon className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-500" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <PackageSelectLink
                  packageId={pkg.id}
                  label={pkg.ctaLabel}
                  variant={pkg.popular ? "primary" : "secondary"}
                />
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
