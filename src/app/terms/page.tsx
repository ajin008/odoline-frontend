import type { Metadata } from "next";
import { siteContent } from "@/src/content/site";
import { LegalPage } from "@/src/components/legal/LegalPage";

const terms = siteContent.legal.terms;

export const metadata: Metadata = {
  title: "Terms of service — Odoline",
  description: "Terms of service for the Odoline marketing website.",
  alternates: {
    canonical: `${siteContent.siteConfig.domain}/terms`,
  },
  robots: terms.reviewed
    ? { index: true, follow: true }
    : { index: false, follow: false },
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of service"
      lastUpdated={terms.lastUpdated}
      placeholders={terms.placeholders}
      sections={terms.sections}
      crossLink={{
        text: "Privacy policy",
        href: "/privacy",
        label: "Privacy policy",
      }}
    />
  );
}
