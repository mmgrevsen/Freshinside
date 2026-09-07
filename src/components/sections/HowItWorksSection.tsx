import { howItWorksSteps } from "@/config/site";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { CalendarIcon, CarIcon, SparkleIcon } from "@/components/ui/icons";

const stepIcons = [CalendarIcon, CarIcon, SparkleIcon];

export function HowItWorksSection() {
  return (
    <section id="saadan-fungerer-det" className="bg-paper-muted py-20 sm:py-28">
      <Container className="flex flex-col items-center gap-14">
        <Reveal>
          <SectionHeading
            eyebrow="Sådan fungerer det"
            title="Tre enkle trin til en friskere bil"
          />
        </Reveal>

        <div className="grid w-full grid-cols-1 gap-8 sm:grid-cols-3">
          {howItWorksSteps.map((step, index) => {
            const Icon = stepIcons[index] ?? SparkleIcon;
            return (
              <Reveal key={step.title} delay={index * 120}>
                <div className="flex flex-col items-center gap-4 text-center">
                  <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-brand-600 shadow-sm shadow-ink/5">
                    <Icon className="h-7 w-7" />
                    <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-ink text-xs font-bold text-white">
                      {index + 1}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-ink">{step.title}</h3>
                  <p className="max-w-xs text-sm leading-relaxed text-ink-soft">
                    {step.description}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
