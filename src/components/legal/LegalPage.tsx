import * as React from "react";
import Link from "next/link";
import { formatENINDate, LegalPlaceholder } from "@/src/content/site";
import { Nav } from "@/src/components/sections/Nav";
import { Footer } from "@/src/components/sections/Footer";
import { Container } from "@/src/components/ui/container";

export interface LegalSection {
  id: string;
  title: string;
  paragraphs: string[];
}

export interface LegalPageProps {
  title: string;
  lastUpdated: string;
  placeholders: Record<string, LegalPlaceholder>;
  sections: LegalSection[];
  crossLink?: {
    text: string;
    href: string;
    label: string;
  };
}

function renderPlaceholder(placeholder?: LegalPlaceholder) {
  if (placeholder && placeholder.isConfirmed && placeholder.value) {
    return <span className="font-semibold text-ink">{placeholder.value}</span>;
  }
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30">
      [To be confirmed]
    </span>
  );
}

function renderParagraphWithPlaceholders(
  text: string,
  placeholders: Record<string, LegalPlaceholder>
) {
  const tokens = text.split(/({{[\w]+}})/g);

  return (
    <>
      {tokens.map((token, idx) => {
        if (token.startsWith("{{") && token.endsWith("}}")) {
          const key = token.slice(2, -2);
          const placeholder = placeholders[key];
          return (
            <React.Fragment key={idx}>
              {renderPlaceholder(placeholder)}
            </React.Fragment>
          );
        }

        if (token.includes("[Privacy policy](/privacy)")) {
          const parts = token.split("[Privacy policy](/privacy)");
          return (
            <React.Fragment key={idx}>
              {parts[0]}
              <Link
                href="/privacy"
                className="text-accent underline font-semibold hover:text-ink transition-colors"
              >
                Privacy policy
              </Link>
              {parts[1]}
            </React.Fragment>
          );
        }

        if (token.includes("[Terms of service](/terms)")) {
          const parts = token.split("[Terms of service](/terms)");
          return (
            <React.Fragment key={idx}>
              {parts[0]}
              <Link
                href="/terms"
                className="text-accent underline font-semibold hover:text-ink transition-colors"
              >
                Terms of service
              </Link>
              {parts[1]}
            </React.Fragment>
          );
        }

        return token;
      })}
    </>
  );
}

export function LegalPage({
  title,
  lastUpdated,
  placeholders,
  sections,
  crossLink,
}: LegalPageProps) {
  const formattedDate = formatENINDate(lastUpdated);

  return (
    <>
      <Nav />
      <main id="main" className="flex-1 bg-canvas py-12 md:py-20">
        <Container size="default">
          <article className="max-w-[68ch] mx-auto space-y-10">
            {/* Header Block */}
            <header className="space-y-3 pb-8 border-b border-line">
              <h1 className="font-heading text-display-xl font-extrabold text-ink tracking-tight">
                {title}
              </h1>
              <div className="flex items-center justify-between text-xs font-mono text-ink-muted flex-wrap gap-2">
                <span>Last updated: {formattedDate}</span>
                {crossLink && (
                  <Link
                    href={crossLink.href}
                    className="text-accent underline font-semibold hover:text-ink transition-colors"
                  >
                    {crossLink.label} &rarr;
                  </Link>
                )}
              </div>
            </header>

            {/* Table of Contents */}
            <nav
              aria-label="Table of contents"
              className="p-6 rounded-2xl bg-inset border border-line space-y-3"
            >
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-ink-subtle">
                Table of contents
              </div>
              <ol className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                {sections.map((section) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className="text-ink-muted hover:text-accent transition-colors"
                    >
                      {section.title}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>

            {/* Sections */}
            <div className="space-y-12">
              {sections.map((section) => (
                <section
                  key={section.id}
                  id={section.id}
                  className="scroll-mt-28 space-y-3"
                >
                  <h2 className="font-heading text-xl font-bold text-ink tracking-tight">
                    {section.title}
                  </h2>
                  {section.paragraphs.map((p, pIdx) => (
                    <p
                      key={pIdx}
                      className="text-body-lg text-ink-muted leading-relaxed"
                    >
                      {renderParagraphWithPlaceholders(p, placeholders)}
                    </p>
                  ))}
                </section>
              ))}
            </div>
          </article>
        </Container>
      </main>
      <Footer />
    </>
  );
}
