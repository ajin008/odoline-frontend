# Odoline Web — Landing Page Plan (brain doc)

> Source of truth for the Odoline marketing landing page (`odoline-web`).
> Attach this file (+ `doc/landing-content.md`) when starting a session.
> Every Claude Code prompt for this project points to a slice in section 8.
> Update slice status and the As-built log (section 11) after each slice is verified.

---

## 1. What this is

The public marketing page for **Odoline**, a subscription dealership management
system for Indian pre-owned car showrooms. It explains who Odoline is for, what
it does, and what it costs, and turns visitors into demo requests.

- **Audience:** owners and partners of used-car showrooms (volume, multi-branch,
  premium). Mostly on phones. Many prefer WhatsApp to forms.
- **Goal of the page:** a dealer understands Odoline in 5 seconds, trusts it in
  2 minutes, and books a demo (WhatsApp or email).
- **Business context:** see `Odoline — Business Model` doc. Price ₹30,000/year
  - GST, max 20 customers, personal onboarding.

---

## 2. Key decisions

| Decision            | Choice                                                         | Why                                                                                                                                                                                                                                            |
| ------------------- | -------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Where it lives      | Separate project `odoline-web` (not inside `odoline-frontend`) | The app's root layout registers a Serwist service worker and PWA manifest, and `/` redirects to `/login`. A marketing page must not be cached by a SW or show "install app" prompts. Different domain too (`odoline.app` vs tenant subdomains) |
| Type of site        | Static marketing site                                          | No backend, auth, database, React Query or API calls                                                                                                                                                                                           |
| Visual identity     | Mirrors the app's design system (tokens + fonts)               | Landing page and product must feel like one brand                                                                                                                                                                                              |
| Copy location       | All text in `src/content/site.ts`                              | Change wording without touching components; placeholders in one place                                                                                                                                                                          |
| Demo call to action | WhatsApp by default, email as a switch                         | Indian dealers message before they fill forms                                                                                                                                                                                                  |
| Undecided content   | Hidden behind config flags                                     | Nothing half-decided can appear on the live page by accident                                                                                                                                                                                   |
| Hosting             | TBD (Vercel from own account, or Cloudflare Pages)             | Vercel Hobby is non-commercial; check terms before launch                                                                                                                                                                                      |

---

## 3. Tech stack

- Next.js 16 (App Router), React 19, TypeScript strict
- Tailwind CSS v4 (CSS-first, `@theme` in `globals.css`, no `tailwind.config`)
- `lucide-react` icons, `next-themes` for dark mode
- `next/font/local` for fonts
- Nothing else without asking first

Match the versions used in `odoline-frontend`.

---

## 4. Design system

### Fonts (from `odoline-frontend/public/fonts/`)

| Use                       | Font                | Weights available                   |
| ------------------------- | ------------------- | ----------------------------------- |
| Headings, display, prices | **Cabinet Grotesk** | Medium 500, Bold 700, Extrabold 800 |
| Body, UI, buttons         | **Satoshi**         | Regular 400, Medium 500, Bold 700   |

- Copy only the `.woff2` files into `odoline-web/src/fonts/` and load them with
  `next/font/local`. `.eot`, `.ttf`, `.woff` are not needed for modern browsers.
- Both are Fontshare (Indian Type Foundry) fonts. Check the licence files before launch.
- Note: `odoline-frontend/docs/PROJECT_ARCHITECTURE.md` says "Clash Grotesk & General
  Sans". The actual files are Cabinet Grotesk and Satoshi. Fix that doc.

### Colour tokens

Reuse the app's token **names and values** from `doc/app-theme-reference.css`
(copied from `odoline-frontend/src/app/globals.css`), light + dark:
`bg-inset`, `bg-card`, `text-ink`, `border-line`, `text-accent`, and the rest defined there.

- Never rename or change an app token.
- Marketing-only tokens may be ADDED (e.g. hero surface, band surface).
- Components never use raw hex values.

### Direction

- Premium, calm, trustworthy — a tool for business owners, not a flashy startup.
- The landing page is a more spacious, larger-type version of the app's identity.
- Avoid generic SaaS clichés: purple gradients, floating blobs, glassmorphism.
- Signature motif: **every car's journey as one continuous line** (odometer /
  timeline). Used in the Journey section, echoed lightly in Onboarding. Not everywhere.

---

## 5. Architecture and conventions

```
odoline-web/
├── CLAUDE.md                     # project rules for Claude Code (Slice 0)
├── doc/
│   ├── landingpageplan.md        # this file
│   ├── landing-content.md        # all page copy (human-readable)
│   ├── app-design-system.md      # copy of odoline-frontend/design-system.md
│   ├── app-theme-reference.css   # copy of odoline-frontend/src/app/globals.css
│   └── app-fonts-reference.ts    # copy of odoline-frontend/src/app/fonts.ts
└── src/
    ├── app/
    │   ├── layout.tsx            # fonts, theme, metadata, skip link
    │   ├── page.tsx              # renders sections in order
    │   ├── globals.css           # Tailwind v4 + tokens
    │   ├── privacy/ terms/       # placeholder legal pages (Slice 7)
    │   ├── not-found.tsx
    │   ├── opengraph-image.tsx, robots.ts, sitemap.ts
    ├── content/
    │   └── site.ts               # ALL copy + siteConfig + flags (typed)
    ├── components/
    │   ├── sections/             # one component per page section
    │   └── ui/                   # Button, Container, Section, SectionHeading, DemoButton
    └── fonts/                    # Cabinet Grotesk + Satoshi .woff2
```

### Rules

1. All text comes from `site.ts`. Components never hardcode copy.
2. Colours only through tokens. No hex in components.
3. Server components by default; `"use client"` only for interaction
   (mobile menu, theme toggle, scroll reveal).
4. Mobile-first. Must work at 360px, 768px, 1280px.
5. Indian formatting: `₹30,000`, never `₹30000` or `Rs.`.
6. Accessibility: landmarks, exactly one `h1`, visible focus, contrast ≥ 4.5:1,
   respect `prefers-reduced-motion`, works without JavaScript where possible.
7. No service worker, PWA manifest, auth, analytics or tracking scripts
   (analytics is a later decision).
8. Never invent testimonials, statistics or customer names.

---

## 6. Page structure

| #   | Section                | Component      | Anchor id     | `site.ts` key  | Slice |
| --- | ---------------------- | -------------- | ------------- | -------------- | ----- |
| 1   | Navigation             | `Nav`          | —             | `nav`          | 1     |
| 2   | Hero                   | `Hero`         | `top`         | `hero`         | 1     |
| 3   | The problem            | `Problem`      | `problem`     | `problem`      | 2     |
| 4   | Car's journey          | `Journey`      | `journey`     | `journey`      | 2     |
| 5   | Features               | `Features`     | `features`    | `features`     | 3     |
| 6   | Built for partnerships | `Partnerships` | `partners`    | `partnerships` | 3     |
| 7   | Who it's for           | `Audiences`    | `who-its-for` | `audiences`    | 4     |
| 8   | Proof                  | `Proof`        | `proof`       | `proof`        | 4     |
| 9   | Pricing                | `Pricing`      | `pricing`     | `pricing`      | 5     |
| 10  | How we get you started | `Onboarding`   | `onboarding`  | `onboarding`   | 5     |
| 11  | FAQ                    | `Faq`          | `faq`         | `faq`          | 6     |
| 12  | Final call to action   | `FinalCta`     | `final-cta`   | `finalCta`     | 6     |
| 13  | Footer                 | `Footer`       | —             | `footer`       | 1     |

Order follows how a dealer decides: _Is this for me? → Do they understand my
problem? → How does it work? → Can I trust it? → What does it cost? → What next?_

---

## 7. Content and config flags

Undecided items are hidden by flags in `site.ts` until the decision is made.

| Flag                                                      | Default      | Controls                                                         |
| --------------------------------------------------------- | ------------ | ---------------------------------------------------------------- |
| `proof.published`                                         | `false`      | Testimonial block (needs Jabir's permission + real quote)        |
| `pricing.monthly`                                         | `null`       | Monthly price line (`{ price }`)                                 |
| `pricing.foundingOffer`                                   | `null`       | Founding offer box (`{ discountPercent, years, placesLeft }`)    |
| `faq[].published`                                         | per item     | Which FAQ answers are live                                       |
| `siteConfig.demoCta`                                      | `"whatsapp"` | What every "Book a demo" button does (`"whatsapp"` or `"email"`) |
| `siteConfig.whatsappNumber` / `email` / `city` / `domain` | placeholders | Contact details, canonical URL                                   |

Default WhatsApp message: _"Hi, I'd like a demo of Odoline for my showroom."_

---

## 8. Slices

Each slice = one Claude Code prompt. Verify before moving on.

### Setup (by hand, before Slice 0)

```bash
cd ~/Desktop/Project
npx create-next-app@latest odoline-web --ts --tailwind --app --eslint --src-dir --import-alias "@/*"
cd odoline-web
mkdir -p doc src/fonts

cp ../odoline-frontend/design-system.md     doc/app-design-system.md
cp ../odoline-frontend/src/app/globals.css  doc/app-theme-reference.css
cp ../odoline-frontend/src/app/fonts.ts     doc/app-fonts-reference.ts

cp ../odoline-frontend/public/fonts/Cabinet-Grotesk/*.woff2 src/fonts/
cp ../odoline-frontend/public/fonts/Satoshi/*.woff2         src/fonts/
```

Then: put this file and `landing-content.md` in `doc/`, confirm versions in
`package.json` match the app, create a private GitHub repo `odoline-web`, push.

- [ ] Setup done

### Slice 0 — Foundation

**Goal:** project rules, theme, fonts, content file, layout, UI primitives. No sections.

**Scope**

- `CLAUDE.md` with the rules in section 5 and design notes in section 4.
- `globals.css`: Tailwind v4 `@theme`, app tokens (light + dark), marketing additions.
- Fonts via `next/font/local`: Cabinet Grotesk (500/700/800), Satoshi (400/500/700).
  Marketing type scale (bigger display sizes than the app).
- `site.ts`: all copy from `landing-content.md`, `siteConfig`, flags from section 7,
  `buildWhatsAppLink(message)` helper.
- Root layout: `lang="en-IN"`, metadata, skip link, `<main id="main">`, theme provider.
- UI primitives: `Button` (primary/secondary/ghost, `<a>` when `href`, external
  link handling), `Container`, `Section`, `SectionHeading`.

**Acceptance**

- `npm run build` passes, no type or lint errors.
- Token names match `app-theme-reference.css` exactly.
- Headings render in Cabinet Grotesk, body in Satoshi.
- `site.ts` contains every piece of copy from `landing-content.md`.
- System dark mode switches colours via tokens.

- [ ] Slice 0 verified

### Slice 1 — Shell (Nav, Hero, Footer)

**Goal:** the page looks real at first glance.

**Scope**

- **Nav:** wordmark, anchor links (Features, Pricing, FAQ), "Book a demo", theme
  toggle; sticky with background after scroll; accessible mobile menu
  (`aria-expanded`, `aria-controls`, Escape closes, focus returns).
- **Hero:** tagline, the single `h1`, subtext, two CTAs (demo → `#final-cta` for
  now; WhatsApp → new tab), trust line, stylised timeline-card mock built in
  HTML/CSS (marked as placeholder for a real screenshot; no real customer data).
- **Footer:** wordmark + tagline, contact placeholders, `/privacy`, `/terms`, ©.

**Acceptance**

- Correct at 360 / 768 / 1280px, light + dark.
- Mobile menu fully usable by keyboard.
- WhatsApp link opens `wa.me` with the prefilled message.
- Exactly one `h1`; all text from `site.ts`.

- [ ] Slice 1 verified

### Slice 2 — Story (Problem, Journey)

**Goal:** the dealer recognises their problem and sees the Odoline idea.

**Scope**

- **Problem:** "Sound familiar?", five pain points, emphasised closing line. Quiet tone.
- **Journey:** 9 stages as one continuous line (Purchase → Documents →
  Refurbishment → Pricing → In stock → Enquiry → Booking → Delivery → RC transfer).
  Horizontal on desktop, vertical on mobile, semantic `<ol>`. Optional scroll
  reveal, off under reduced motion, content visible without JS.

**Acceptance**

- No horizontal overflow at 360px.
- Reduced motion: everything visible immediately.
- Screen reader order = stage order.

- [ ] Slice 2 verified

### Slice 3 — Product (Features, Partnerships)

**Goal:** show what Odoline does and its main differentiator.

**Scope**

- **Features:** six cards (Stock and intake, No missing papers, Leads and
  follow-ups, Bookings and delivery, Staff attendance, Owner dashboards);
  1 / 2 / 3 columns; capability strip below.
- **Partnerships:** contrasting band; copy left; right side shows 4 owner cards
  (1 "Primary owner", 3 "Partner · view only") with placeholder initials.

**Acceptance**

- Grid balanced at every width.
- Band contrast OK in both themes.

- [ ] Slice 3 verified

### Slice 4 — Trust (Audiences, Proof)

**Goal:** "this is for someone like me" and "real showrooms use it".

**Scope**

- **Audiences:** three items (High-volume, Multi-branch with "Coming soon" badge,
  Premium and luxury), visually distinct from Features cards.
- **Proof:** heading + paragraph always; testimonial only when `proof.published`.

**Acceptance**

- `proof.published = false` → no testimonial or placeholder text visible.
- `proof.published = true` → quote block renders correctly.

- [ ] Slice 4 verified

### Slice 5 — Offer (Pricing, Onboarding)

**Goal:** a clear price and a clear path to starting.

**Scope**

- **Pricing:** one plan card (₹30,000 / year, "+ 18% GST", six inclusions, demo
  button); extra-branch line (₹10,000/year, 10 more staff, "coming soon");
  optional monthly line and founding offer box driven by flags.
- **Onboarding:** four steps (Book a demo → We set you up → We train your team →
  You start selling) + "small number of showrooms" line; timeline motif echoed.

**Acceptance**

- Flags `null` → optional parts hidden; set → they render.
- Price readable at 360px.

- [ ] Slice 5 verified

### Slice 6 — Close (FAQ, Final CTA)

**Goal:** answer objections and convert.

**Scope**

- **FAQ:** native `<details>/<summary>`; only `published` items render.
  Published: data safety, phones, partners' access, "stop paying".
  Unpublished: cancellation, data migration, free trial.
- **FinalCta:** heading, paragraph, both CTAs.
- **DemoButton:** one shared component used by Nav, Hero, Pricing, FinalCta,
  driven by `siteConfig.demoCta`.

**Acceptance**

- FAQ works with JavaScript disabled.
- Every demo button behaves identically.
- Full page renders top to bottom in section 6 order.

- [ ] Slice 6 verified

### Slice 7 — Polish

**Goal:** production quality. No copy or design direction changes.

**Scope**

- Responsive audit: 360, 390, 768, 1024, 1280, 1536px.
- Accessibility pass (headings, landmarks, focus, contrast, aria, reduced motion).
- SEO: title, description (150–160 chars), canonical, Open Graph + Twitter,
  generated OG image, `robots.ts`, `sitemap.ts`, JSON-LD (`SoftwareApplication`
  with ₹30,000/year INR offer; `FAQPage` from published items only).
- Performance: minimal client JS, `next/image`, no layout shift.
- `/privacy` and `/terms`: heading + visible placeholder notice, `noindex`.
  No legal text written by AI.
- Custom 404.

**Acceptance**

- Lighthouse mobile ≥ 95 in all four categories.
- No console errors or hydration warnings.

- [ ] Slice 7 verified

### Slice 8 — Ship (by hand)

- [ ] Real values in `siteConfig` (WhatsApp, email, city, domain)
- [ ] Domain bought (after availability + trademark check)
- [ ] Hosting chosen and deployed from own account
- [ ] DNS connected, HTTPS working
- [ ] Tested on a real phone (WhatsApp link, dark mode, mobile data speed)
- [ ] Privacy policy and terms supplied (lawyer-reviewed) before taking customer data

---

## 9. Open decisions (placeholders on the page)

| Decision                                         | Affects           | Flag / placeholder      |
| ------------------------------------------------ | ----------------- | ----------------------- |
| Monthly price                                    | Pricing           | `pricing.monthly`       |
| Founding offer (yes/no, discount, years, places) | Pricing           | `pricing.foundingOffer` |
| Expiry behaviour (grace + read-only vs lockout)  | FAQ "stop paying" | FAQ wording             |
| Cancellation policy                              | FAQ               | `faq[].published`       |
| Setup fee / data migration                       | FAQ, Onboarding   | `faq[].published`       |
| Free trial or demo only                          | FAQ               | `faq[].published`       |
| Jabir's testimonial + permission                 | Proof             | `proof.published`       |
| WhatsApp number, email, city, domain             | CTAs, Footer, SEO | `siteConfig`            |
| Hosting provider                                 | Deploy            | —                       |
| Analytics (if any)                               | All               | not added yet           |

---

## 10. Gotchas

- **No service worker here.** The app uses Serwist; this site must not. A cached
  marketing page would show stale prices.
- **Fonts doc mismatch.** The app's architecture doc names the wrong fonts
  (see section 4). Trust the files in `public/fonts/`.
- **Tailwind v4 is CSS-first.** Theme lives in `globals.css` (`@theme`); there is
  no `tailwind.config.ts`. Don't let generated code create one.
- **Token drift.** If the app's `globals.css` or `design-system.md` changes,
  re-copy them into `doc/` and update this site's tokens.
- **Commercial hosting.** Vercel Hobby is for non-commercial use. Check terms.
- **Honesty.** No invented numbers, quotes, logos or "trusted by" claims.
  Multi-branch is marked "coming soon" until it exists.

---

## 11. As-built log

Record anything that differs from this plan after each slice.

| Date | Slice | What changed from the plan | Why |
| ---- | ----- | -------------------------- | --- |
|      |       |                            |     |

---

## 12. How to start a session

1. Attach this file and `doc/landing-content.md`.
2. Say: "Continuing odoline-web. Here's the landing page plan. Next is Slice N."
3. Paste that slice's prompt. Verify against its acceptance criteria.
4. Tick the slice, update the As-built log.
