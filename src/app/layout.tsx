import type { Metadata } from "next";
import { satoshi, cabinetGrotesk } from "./fonts";
import { siteContent } from "@/src/content/site";
import { Providers } from "@/src/components/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: siteContent.metadata.title,
  description: siteContent.metadata.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-IN"
      suppressHydrationWarning
      className={`${satoshi.variable} ${cabinetGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-canvas text-ink">
        <Providers>
          {/* Accessibility Skip-to-content link */}
          <a
            href="#main"
            className="sr-only-focusable fixed top-4 left-4 z-50 rounded-lg bg-accent px-4 py-2 font-medium text-inverse shadow-lg focus:not-sr-only"
          >
            Skip to content
          </a>

          {children}
        </Providers>
      </body>
    </html>
  );
}
