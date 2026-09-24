import type { Metadata } from "next";
import { siteContent } from "@/src/content/site";
import { LegalPage } from "@/src/components/legal/LegalPage";

const privacy = siteContent.legal.privacy;

export const metadata: Metadata = {
  title: "Privacy policy — Odoline",
  description:
    "Plain-language privacy policy for the Odoline marketing website.",
  alternates: {
    canonical: `${siteContent.siteConfig.domain}/privacy`,
  },
  robots: privacy.reviewed
    ? { index: true, follow: true }
    : { index: false, follow: false },
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy policy"
      lastUpdated={privacy.lastUpdated}
      placeholders={privacy.placeholders}
      sections={privacy.sections}
      crossLink={{
        text: "Terms of service",
        href: "/terms",
        label: "Terms of service",
      }}
    />
  );
}
