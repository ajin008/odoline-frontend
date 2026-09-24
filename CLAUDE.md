# Odoline Web — Rules & Conventions for AI & Developers

This repository (`odoline-web`) is the public marketing landing page for **Odoline**.

---

## Core Rules & Architecture

1. **Content Centralization**: All text and copy MUST come from `src/content/site.ts`. Components must NEVER hardcode copy text.
2. **Color Tokens Only**: Use Tailwind token utility classes (`bg-canvas`, `bg-card`, `bg-inset`, `text-ink`, `text-ink-muted`, `text-ink-subtle`, `text-accent`, `border-line`, `bg-band`, etc.). Components must NEVER use raw hex values.
3. **Server Components First**: Use React Server Components by default. Include `"use client"` ONLY when state or browser interactivity is required (mobile menu toggle, theme switcher, scroll reveal).
4. **Mobile-First Responsive Layout**: Ensure clean layout and responsiveness at 360px, 768px, and 1280px+. Prevent horizontal overflow.
5. **Indian Currency Formatting**: Always format Indian Rupee prices as `₹30,000` (comma separated with `₹`), never `₹30000` or `Rs.`.
6. **Accessibility Standard**:
   - Proper HTML5 landmark elements (`<header>`, `<main>`, `<section>`, `<footer>`, `<nav>`).
   - Exactly one `h1` element per page.
   - Visible focus indicators on all interactive elements.
   - Contrast ratio ≥ 4.5:1.
   - Respect `prefers-reduced-motion` settings.
   - Core page content must be readable without JavaScript.
7. **No Service Worker / PWA**: This is a pure static marketing landing page. Do NOT register service workers, PWA manifests, or offline caches.
8. **Factual Integrity**: Never invent testimonials, statistics, customer names, or numbers. Use flags for unpublished or placeholder content.

---

## Design System & Visual Identity

- **Fonts**:
  - Headings, Display, & Prices: **Cabinet Grotesk** (Medium 500, Bold 700, Extrabold 800)
  - Body, UI, & Buttons: **Satoshi** (Regular 400, Medium 500, Bold 700)
- **Visual Direction**: Premium, calm, trustworthy SaaS tool for car dealership owners. Avoid generic SaaS clichés (purple gradients, floating blobs, glassmorphism).
- **Signature Motif**: Every car's journey as one continuous line (odometer / timeline).
