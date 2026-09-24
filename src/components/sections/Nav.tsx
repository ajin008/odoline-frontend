"use client";

import * as React from "react";
import Link from "next/link";
import { siteContent } from "@/src/content/site";
import { DemoButton } from "@/src/components/ui/DemoButton";
import { Container } from "@/src/components/ui/container";
import { ThemeToggle } from "@/src/components/ui/theme-toggle";
import { Menu, X } from "lucide-react";

export function Nav() {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const toggleButtonRef = React.useRef<HTMLButtonElement>(null);

  // Track scroll position for sticky background transition
  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle window resize — close mobile menu on desktop sizes
  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobileMenuOpen]);

  // Lock body scroll when mobile menu is active
  React.useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  // Handle Escape keypress to close menu & return focus
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
        toggleButtonRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMobileMenuOpen]);

  const closeMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const nav = siteContent.nav;

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-200 border-b ${
        isScrolled
          ? "bg-card/90 backdrop-blur-md border-line shadow-2xs py-3"
          : "bg-transparent border-transparent py-5"
      }`}
    >
      <Container size="default">
        <nav
          className="flex items-center justify-between gap-4"
          aria-label="Main Navigation"
        >
          {/* Wordmark Branding */}
          <Link
            href="/#top"
            className="font-heading text-xl font-extrabold tracking-tight text-ink hover:text-accent transition-colors"
          >
            {nav.wordmark}
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <ul className="flex items-center gap-6 text-sm font-medium">
              {nav.links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-ink-muted hover:text-ink transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-3 border-l border-line pl-6">
              <ThemeToggle />
              <Link
                href="/login"
                className="text-sm font-semibold text-ink-muted hover:text-ink transition-colors px-3 py-1.5 rounded-xl hover:bg-inset"
              >
                {nav.loginButton}
              </Link>
              <DemoButton variant="primary" size="sm" label={nav.button} />
            </div>
          </div>

          {/* Mobile Menu Controls */}
          <div className="flex items-center gap-3 md:hidden">
            <ThemeToggle />
            <button
              ref={toggleButtonRef}
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-line bg-card text-ink hover:bg-inset focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent cursor-pointer"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </nav>
      </Container>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div
          id="mobile-menu"
          className="fixed inset-x-0 top-[65px] bottom-0 z-50 flex flex-col bg-card/98 backdrop-blur-xl border-t border-line px-6 py-8 md:hidden overflow-y-auto"
        >
          <div className="flex flex-col space-y-6 flex-1">
            <ul className="space-y-4 text-base font-semibold">
              {nav.links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={closeMenu}
                    className="block py-2 text-ink hover:text-accent transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>

            <div className="pt-6 border-t border-line mt-auto space-y-3">
              <Link
                href="/login"
                onClick={closeMenu}
                className="flex w-full items-center justify-center py-2.5 px-4 text-sm font-semibold text-ink border border-line rounded-xl hover:bg-inset transition-colors"
              >
                {nav.loginButton}
              </Link>
              <DemoButton
                variant="primary"
                size="lg"
                label={nav.button}
                className="w-full justify-center"
                onClick={closeMenu}
              />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
