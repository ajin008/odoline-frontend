import * as React from "react";
import Link from "next/link";
import { siteContent } from "@/src/content/site";
import { Container } from "@/src/components/ui/container";
import { Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  const footer = siteContent.footer;

  return (
    <footer className="w-full bg-footer border-t border-footer-line text-footer-ink py-12 md:py-16">
      <Container size="default">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start justify-between border-b border-footer-line pb-10">
          {/* Column 1: Wordmark & Tagline */}
          <div className="md:col-span-6 space-y-3">
            <Link
              href="/#top"
              className="font-heading text-2xl font-extrabold tracking-tight text-footer-ink hover:text-accent transition-colors"
            >
              {footer.wordmark}
            </Link>
            <p className="text-sm text-footer-muted max-w-sm leading-relaxed">
              {footer.tagline}
            </p>
          </div>

          {/* Column 2: Contact Details */}
          <div className="md:col-span-6 space-y-3">
            <div className="text-xs font-mono font-semibold uppercase tracking-wider text-footer-muted">
              Contact &amp; Location
            </div>
            <div className="space-y-2 text-xs font-mono text-footer-muted">
              <a
                href={`mailto:${footer.contact.email}`}
                className="flex items-center gap-2 hover:text-footer-ink transition-colors"
              >
                <Mail className="h-3.5 w-3.5 text-accent shrink-0" />
                <span>{footer.contact.email}</span>
              </a>
              <a
                href="https://wa.me/916235235097"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-footer-ink transition-colors"
              >
                <Phone className="h-3.5 w-3.5 text-accent shrink-0" />
                <span>{footer.contact.whatsapp}</span>
              </a>
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-accent shrink-0" />
                <span>{footer.contact.location}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Legal Links */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-footer-muted">
          <div>{footer.copyright}</div>

          <div className="flex items-center gap-6">
            {footer.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-footer-ink transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}
