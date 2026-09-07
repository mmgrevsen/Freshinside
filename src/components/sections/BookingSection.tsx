import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { BookingForm } from "@/components/sections/BookingForm";

export function BookingSection() {
  return (
    <section id="booking" className="bg-paper-muted py-20 sm:py-28">
      <Container className="flex flex-col items-center gap-12">
        <Reveal>
          <SectionHeading
            eyebrow="Booking"
            title="Book din rengøring"
            description="Udfyld formularen, så vender FreshInside tilbage for at bekræfte tid og sted."
          />
        </Reveal>

        <Reveal className="w-full max-w-2xl rounded-3xl border border-ink/10 bg-white p-6 shadow-sm shadow-ink/5 sm:p-10">
          <BookingForm />
        </Reveal>
      </Container>
    </section>
  );
}
