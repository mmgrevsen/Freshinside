import { Hero } from "@/components/sections/Hero";
import { TrustBar } from "@/components/sections/TrustBar";
import { PricingSection } from "@/components/sections/PricingSection";
// Quizzen "Hvilken pakke passer til mig?" er slået fra, fordi der kun
// er ÉN pakke – så er der ikke noget at vælge imellem. Får du flere
// pakker igen (src/config/pricing.ts), fjerner du bare de to skråstreger
// her og på <PackageQuiz /> længere nede.
// import { PackageQuiz } from "@/components/sections/PackageQuiz";
import { HowItWorksSection } from "@/components/sections/HowItWorksSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { AreaSection } from "@/components/sections/AreaSection";
import { FAQSection } from "@/components/sections/FAQSection";
import { BookingSection } from "@/components/sections/BookingSection";
import { ContactSection } from "@/components/sections/ContactSection";

// Før & efter-sektionen er midlertidigt slået fra, indtil der er rigtige
// billeder. Komponenten ligger stadig i src/components/sections/ og kan
// sættes tilbage ind herunder, når billederne er klar:
import { BeforeAfterSection } from "@/components/sections/BeforeAfterSection";
// import { TestimonialsSection } from "@/components/sections/TestimonialsSection";

export default function Home() {
  return (
    <>
      <Hero />
      <TrustBar />
      <PricingSection />
      {/* <PackageQuiz /> */}
      <HowItWorksSection />
      <BeforeAfterSection />
      <AboutSection />
      <AreaSection />
      <FAQSection />
      <BookingSection />
      <ContactSection />
    </>
  );
}
