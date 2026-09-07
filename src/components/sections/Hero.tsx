import { bookingAnchor, siteConfig } from "@/config/site";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { CarIcon, SparkleIcon } from "@/components/ui/icons";

export function Hero() {
  return (
    <section id="forside" className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 right-[-10%] h-96 w-96 rounded-full bg-brand-200/50 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 left-[-10%] h-80 w-80 rounded-full bg-brand-100/60 blur-3xl"
      />

      <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-14 px-5 sm:px-8 lg:grid-cols-2 lg:gap-10">
        <Reveal>
          <div className="flex flex-col items-start gap-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-4 py-1.5 text-sm font-medium text-brand-700">
              <SparkleIcon className="h-4 w-4" />
              Lokal bilrengøring i {siteConfig.serviceArea}
            </span>

            <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-ink sm:text-5xl lg:text-6xl">
              Giv din bil en{" "}
              <span className="text-brand-600">frisk start.</span>
            </h1>

            <p className="max-w-lg text-lg leading-relaxed text-ink-soft">
              Professionel indvendig bilrengøring – nemt, lokalt og uden
              besvær.
            </p>

            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Button as="a" href={bookingAnchor} size="lg">
                Book en rengøring
              </Button>
              <Button as="a" href="#priser" variant="secondary" size="lg">
                Se priser
              </Button>
            </div>
          </div>
        </Reveal>

        <Reveal delay={150}>
          <div className="relative">
            <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-gradient-to-tr from-brand-100 to-brand-50" />
            <div
              aria-hidden="true"
              className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-[1.75rem] border border-ink/5 bg-gradient-to-br from-white to-brand-50 shadow-2xl shadow-ink/10"
            >
              <div className="absolute h-40 w-40 animate-pulse-soft rounded-full bg-brand-300/40 blur-2xl" />

              <div className="relative flex h-28 w-28 items-center justify-center rounded-3xl bg-ink text-brand-300 shadow-xl shadow-ink/30 sm:h-36 sm:w-36">
                <CarIcon className="h-14 w-14 sm:h-16 sm:w-16" />
              </div>

              <SparkleIcon className="absolute left-[18%] top-[22%] h-6 w-6 animate-float text-brand-400" style={{ animationDelay: "0s" }} />
              <SparkleIcon className="absolute right-[20%] top-[30%] h-4 w-4 animate-float text-brand-500" style={{ animationDelay: "0.6s" }} />
              <SparkleIcon className="absolute bottom-[24%] left-[28%] h-5 w-5 animate-float text-brand-600" style={{ animationDelay: "1.2s" }} />
              <SparkleIcon className="absolute bottom-[20%] right-[24%] h-3 w-3 animate-float text-brand-400" style={{ animationDelay: "0.3s" }} />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
