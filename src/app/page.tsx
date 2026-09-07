import { Hero } from "@/components/sections/Hero";
import { PricingSection } from "@/components/sections/PricingSection";
import { HowItWorksSection } from "@/components/sections/HowItWorksSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { AreaSection } from "@/components/sections/AreaSection";
import { BookingSection } from "@/components/sections/BookingSection";
import { FAQSection } from "@/components/sections/FAQSection";
import { ContactSection } from "@/components/sections/ContactSection";

// Før & efter-sektionen og anmeldelses-sektionen er midlertidigt slået fra,
// indtil der er rigtige billeder/anmeldelser. Komponenterne ligger stadig i
// src/components/sections/ og kan sættes tilbage ind herunder, når de er klar:
// import { BeforeAfterSection } from "@/components/sections/BeforeAfterSection";
// import { TestimonialsSection } from "@/components/sections/TestimonialsSection";

export default function Home() {
  return (
    <>
      <Hero />
      <PricingSection />
      <HowItWorksSection />
      <AboutSection />
      <AreaSection />
      <BookingSection />
      <FAQSection />
      <ContactSection />
    </>
  );
}
