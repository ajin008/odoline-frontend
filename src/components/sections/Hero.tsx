import * as React from "react";
import { siteContent, buildWhatsAppLink } from "@/src/content/site";
import { Button } from "@/src/components/ui/button";
import { DemoButton } from "@/src/components/ui/DemoButton";
import { Container } from "@/src/components/ui/container";
import { HeroDashboard } from "@/src/components/sections/HeroDashboard";
import { Check } from "lucide-react";

export function Hero() {
  const hero = siteContent.hero;
  const whatsappUrl = buildWhatsAppLink();
  const trustItems = hero.trustLine.split(" · ");

  return (
    <section
      id="top"
      className="relative scroll-mt-24 overflow-hidden bg-canvas pt-14 pb-20 md:pt-24 md:pb-28"
    >
      {/* Faint odometer scale behind the headline */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[34rem] bg-[linear-gradient(to_right,var(--border-clean)_1px,transparent_1px)] bg-[size:48px_100%] [mask-image:radial-gradient(ellipse_60%_70%_at_50%_0%,black,transparent)]"
      />

      <Container size="default" className="relative">
        <div className="mx-auto max-w-4xl text-center">
          <div className="rise-in inline-flex items-center gap-3 rounded-full border border-line bg-card py-1.5 pl-2 pr-4 font-mono text-[10px] uppercase tracking-[0.08em] text-ink-muted shadow-bento sm:text-[11px] sm:tracking-[0.16em]">
            <span className="grid size-6 place-items-center rounded-full bg-accent-light">
              <span className="size-1.5 rounded-full bg-accent" />
            </span>
            {hero.tagline}
          </div>

          {/* The page's only h1 */}
          <h1 className="rise-in mt-8 font-heading text-[clamp(2.6rem,6.6vw,5.75rem)] font-extrabold leading-[0.98] tracking-[-0.045em] text-ink text-balance [animation-delay:80ms] md:mt-10">
            {hero.headline}{" "}
            <span className="block">
              <span className="bg-highlight px-[0.06em] text-highlight-ink [box-decoration-break:clone]">
                {hero.headlineMuted}
              </span>
            </span>
          </h1>

          <p className="rise-in mx-auto mt-7 max-w-2xl text-body-lg leading-relaxed text-ink-muted text-pretty [animation-delay:160ms] md:mt-8 md:text-body-xl">
            {hero.subtext}
          </p>

          <div className="rise-in mt-10 flex flex-col items-stretch justify-center gap-3 [animation-delay:220ms] sm:flex-row sm:items-center">
            <DemoButton variant="primary" size="lg" label={hero.primaryButton} />
            <Button href={whatsappUrl} external variant="secondary" size="lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/icons/whatsappIcon.png" alt="" className="h-5 w-5 shrink-0 object-contain" />
              <span>{hero.secondaryButton}</span>
            </Button>
          </div>

          <ul className="rise-in mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-ink-muted [animation-delay:260ms]">
            {trustItems.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <Check className="size-4 text-accent" strokeWidth={2.5} />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="rise-in mt-16 [animation-delay:340ms] md:mt-20">
          <HeroDashboard />
        </div>
      </Container>
    </section>
  );
}
