import { trustPoints } from "@/config/site";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { CheckIcon } from "@/components/ui/icons";

export function TrustBar() {
  return (
    <section className="border-y border-ink/5 bg-white/70">
      <Container>
        <Reveal>
          <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 py-5">
            {trustPoints.map((point) => (
              <li
                key={point}
                className="flex items-center gap-2 text-sm font-medium text-ink-soft"
              >
                <CheckIcon className="h-4 w-4 flex-shrink-0 text-brand-500" />
                {point}
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </section>
  );
}
