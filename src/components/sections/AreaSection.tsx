import { areaContent, bookingAnchor } from "@/config/site";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { MapPinIcon } from "@/components/ui/icons";

export function AreaSection() {
  return (
    <section className="relative overflow-hidden bg-brand-50 py-20 sm:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 top-10 h-72 w-72 animate-drift rounded-full bg-brand-200/40 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-16 bottom-0 h-64 w-64 animate-drift rounded-full bg-white/60 blur-3xl"
        style={{ animationDelay: "8s" }}
      />

      <Container className="relative">
        <Reveal>
          <div className="flex flex-col items-center gap-6 text-center">
            <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-brand-600 shadow-sm shadow-ink/5">
              <span
                aria-hidden="true"
                className="absolute inset-0 animate-pulse-soft rounded-2xl bg-brand-300/40"
              />
              <MapPinIcon className="relative h-7 w-7" />
            </div>
            <h2 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              {areaContent.heading}
            </h2>
            <p className="max-w-xl text-balance leading-relaxed text-ink-soft">
              {areaContent.description}
            </p>
            <Button as="a" href={bookingAnchor} size="lg">
              Book en rengøring
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
