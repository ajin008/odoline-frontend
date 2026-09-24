import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { siteContent, buildWhatsAppLink } from "@/src/content/site";
import { Container } from "@/src/components/ui/container";

export function Footer() {
  const footer = siteContent.footer;

  return (
    <footer className="w-full bg-canvas pb-10 pt-16 text-ink md:pt-20">
      <Container size="default">
        <div className="grid gap-12 border-b border-line pb-12 md:grid-cols-12">
          <div className="md:col-span-6">
            <Link
              href="/#top"
              className="inline-flex items-center gap-3 rounded-lg font-heading text-2xl font-extrabold tracking-tight text-ink"
            >
              <Image
                src="/icons/icon-192.png"
                alt=""
                width={36}
                height={36}
                className="size-9 rounded-lg"
              />
              {footer.wordmark}
            </Link>
            <p className="mt-4 max-w-xs text-[15px] leading-relaxed text-ink-muted">
              {footer.tagline}
            </p>
          </div>

          <div className="md:col-span-3">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-subtle">
              {footer.contactHeading}
            </h2>
            <ul className="mt-5 space-y-3 text-[15px]">
              <li>
                <a
                  href={`mailto:${footer.contact.email}`}
                  className="rounded-sm text-ink-muted transition-colors hover:text-ink"
                >
                  {footer.contact.email}
                </a>
              </li>
              <li>
                <a
                  href={buildWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-sm text-ink-muted transition-colors hover:text-ink"
                >
                  {footer.contact.whatsapp}
                </a>
              </li>
              <li className="text-ink-muted">{footer.contact.location}</li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-subtle">
              {footer.legalHeading}
            </h2>
            <ul className="mt-5 space-y-3 text-[15px]">
              {footer.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="rounded-sm text-ink-muted transition-colors hover:text-ink"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-2 pt-8 text-xs text-ink-subtle sm:flex-row sm:items-center sm:justify-between">
          <span>{footer.copyright}</span>
          <span className="font-mono uppercase tracking-[0.14em]">{siteContent.hero.tagline}</span>
        </div>
      </Container>
    </footer>
  );
}
