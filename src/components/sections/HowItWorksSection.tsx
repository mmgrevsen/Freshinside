import { howItWorksSteps } from "@/config/site";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { CalendarIcon, CarIcon, SparkleIcon } from "@/components/ui/icons";

const stepIcons = [CalendarIcon, CarIcon, SparkleIcon];

export function HowItWorksSection() {
  return (
    <section id="saadan-fungerer-det" className="relative overflow-hidden bg-paper-muted py-20 sm:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 animate-drift rounded-full bg-brand-200/25 blur-3xl"
      />

      <Container className="relative flex flex-col items-center gap-14">
        <Reveal>
          <SectionHeading
            eyebrow="Sådan fungerer det"
            title="Tre enkle trin til en friskere bil"
          />
        </Reveal>

        <div className="relative w-full">
          <Reveal
            from="left"
            delay={200}
            className="pointer-events-none absolute inset-x-[16%] top-8 hidden sm:block"
          >
            <div
              aria-hidden="true"
              className="h-0.5 bg-gradient-to-r from-brand-200 via-brand-400 to-brand-200"
            />
          </Reveal>

          <div className="relative grid grid-cols-1 gap-8 sm:grid-cols-3">
            {howItWorksSteps.map((step, index) => {
              const Icon = stepIcons[index] ?? SparkleIcon;
              return (
                <Reveal key={step.title} delay={index * 150}>
                  <div className="group flex flex-col items-center gap-4 text-center">
                    <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-brand-600 shadow-sm shadow-ink/5 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg group-hover:shadow-brand-500/20">
                      <Icon className="h-7 w-7 transition-transform duration-300 group-hover:scale-110" />
                      <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-ink text-xs font-bold text-white">
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
        </div>
      </Container>
    </section>
  );
}
