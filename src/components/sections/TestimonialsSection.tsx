import { testimonials } from "@/config/testimonials";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Badge } from "@/components/ui/Badge";
import { StarRating } from "@/components/ui/StarRating";
import { Reveal } from "@/components/ui/Reveal";

export function TestimonialsSection() {
  const hasPlaceholders = testimonials.some((t) => t.isPlaceholder);

  return (
    <section className="py-20 sm:py-28">
      <Container className="flex flex-col items-center gap-10">
        <Reveal>
          <SectionHeading eyebrow="Anmeldelser" title="Hvad kunderne siger" />
        </Reveal>

        {hasPlaceholders && (
          <Reveal>
            <Badge tone="outline">Eksempelanmeldelser – ikke rigtige kunder endnu</Badge>
          </Reveal>
        )}

        <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Reveal key={testimonial.name} delay={index * 100}>
              <figure className="relative flex h-full flex-col gap-4 rounded-2xl border border-ink/10 bg-white p-7">
                {testimonial.isPlaceholder && (
                  <span className="absolute right-5 top-5 text-[11px] font-semibold uppercase tracking-wide text-ink-soft/60">
                    Eksempel
                  </span>
                )}
                <StarRating rating={testimonial.rating} />
                <blockquote className="flex-1 text-sm leading-relaxed text-ink-soft">
                  &ldquo;{testimonial.text}&rdquo;
                </blockquote>
                <figcaption className="text-sm font-semibold text-ink">
                  {testimonial.name}
                  <span className="font-normal text-ink-soft"> · {testimonial.location}</span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
