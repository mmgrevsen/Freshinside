import { areaContent, bookingAnchor } from "@/config/site";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { MapPinIcon } from "@/components/ui/icons";

export function AreaSection() {
  return (
    <section className="bg-brand-50 py-20 sm:py-28">
      <Container>
        <Reveal>
          <div className="flex flex-col items-center gap-6 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-brand-600 shadow-sm shadow-ink/5">
              <MapPinIcon className="h-7 w-7" />
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
