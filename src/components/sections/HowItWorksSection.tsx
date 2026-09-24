import { howItWorksSteps } from "@/config/site";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { stepScenes } from "@/components/ui/StepScenes";

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
              const Scene = stepScenes[index] ?? stepScenes[0];
              return (
                <Reveal key={step.title} delay={index * 110}>
                  <div className="group flex flex-col items-center gap-5 text-center">
                    {/* Tegningen sidder i sit eget felt, så de tre trin
                        står som et sæt og ikke som løse billeder. */}
                    <div className="card-lift relative w-full overflow-hidden rounded-2xl border border-ink/5 bg-white p-2 shadow-sm shadow-ink/5">
                      <Scene className="h-auto w-full" />
                      <span className="absolute left-4 top-4 flex h-7 w-7 items-center justify-center rounded-full bg-ink text-xs font-bold text-white">
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
