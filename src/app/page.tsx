import { Nav } from "@/src/components/sections/Nav";
import { Hero } from "@/src/components/sections/Hero";
import { Problem } from "@/src/components/sections/Problem";
import { Journey } from "@/src/components/sections/Journey";
import { Features } from "@/src/components/sections/Features";
import { Partnerships } from "@/src/components/sections/Partnerships";
import { Audiences } from "@/src/components/sections/Audiences";
import { Proof } from "@/src/components/sections/Proof";
import { Pricing } from "@/src/components/sections/Pricing";
import { Onboarding } from "@/src/components/sections/Onboarding";
import { Faq } from "@/src/components/sections/Faq";
import { FinalCta } from "@/src/components/sections/FinalCta";
import { Footer } from "@/src/components/sections/Footer";

/**
 * Odoline Web — Marketing Landing Page Entrypoint
 *
 * Planned section order (Plan Section 6):
 * 1.  Navigation             <Nav />          (site.ts key: nav) [Slice 1]
 * 2.  Hero                   <Hero />         (anchor: #top, site.ts key: hero) [Slice 1]
 * 3.  The problem            <Problem />      (anchor: #problem, site.ts key: problem) [Slice 2]
 * 4.  Car's journey          <Journey />      (anchor: #journey, site.ts key: journey) [Slice 2]
 * 5.  Features               <Features />     (anchor: #features, site.ts key: features) [Slice 3]
 * 6.  Built for partnerships <Partnerships /> (anchor: #partners, site.ts key: partnerships) [Slice 3]
 * 7.  Who it's for           <Audiences />    (anchor: #who-its-for, site.ts key: audiences) [Slice 4]
 * 8.  Proof                  <Proof />        (anchor: #proof, site.ts key: proof) [Slice 4]
 * 9.  Pricing                <Pricing />      (anchor: #pricing, site.ts key: pricing) [Slice 5]
 * 10. How we get you started <Onboarding />   (anchor: #onboarding, site.ts key: onboarding) [Slice 5]
 * 11. FAQ                    <Faq />          (anchor: #faq, site.ts key: faq) [Slice 6]
 * 12. Final call to action   <FinalCta />     (anchor: #final-cta, site.ts key: finalCta) [Slice 6]
 * 13. Footer                 <Footer />       (site.ts key: footer) [Slice 1]
 */

export default function Home() {
  return (
    <>
      <Nav />
      <main id="main" className="flex-1">
        <Hero />
        <Problem />
        <Journey />
        <Features />
        <Partnerships />
        <Audiences />
        <Proof />
        <Pricing />
        <Onboarding />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
