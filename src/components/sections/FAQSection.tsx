"use client";

import { useState } from "react";
import { faqItems } from "@/config/faq";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ChevronDownIcon } from "@/components/ui/icons";

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-paper-muted py-20 sm:py-28">
      <Container className="flex flex-col items-center gap-12">
        <Reveal>
          <SectionHeading eyebrow="FAQ" title="Ofte stillede spørgsmål" />
        </Reveal>

        <div className="w-full max-w-2xl divide-y divide-ink/10 rounded-2xl border border-ink/10 bg-white">
          {faqItems.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={item.question}>
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${index}`}
                >
                  <span className="font-medium text-ink">{item.question}</span>
                  <ChevronDownIcon
                    className={`h-5 w-5 flex-shrink-0 text-ink-soft transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  id={`faq-panel-${index}`}
                  role="region"
                  className={`grid transition-all duration-300 ease-out ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-5 text-sm leading-relaxed text-ink-soft">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
