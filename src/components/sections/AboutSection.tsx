import { aboutContent } from "@/config/site";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

export function AboutSection() {
  return (
    <section id="om-os" className="py-20 sm:py-28">
      <Container className="flex flex-col items-center gap-8">
        <Reveal className="w-full max-w-2xl">
          <div className="flex flex-col items-center gap-6 rounded-3xl bg-ink px-8 py-14 text-center text-white sm:px-14">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              {aboutContent.heading}
            </h2>
            <div className="flex flex-col gap-4">
              {aboutContent.paragraphs.map((paragraph) => (
                <p key={paragraph} className="text-balance leading-relaxed text-white/75">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
