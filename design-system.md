# Cars4 Design System

This document provides the source of truth for all UI components. Please adhere to these standards to ensure the application maintains its high-fidelity, professional SaaS aesthetic.

---

## 1. Typography & Font Stack

We use local font assets for maximum performance and brand consistency.

- **Headings (`font-heading`):** "Clash Grotesk". Use for titles, h1, h2.
  - Weights: Semibold, Bold.
- **Body/UI (`font-sans`):** "General Sans". Use for body text, form labels, buttons.
  - Weights: Regular, Medium, Semibold.
- **Monospace:** Use standard system monospace for terminal logs, timestamps, and status codes.

---

## 2. Global Theme & Color Palette

All colors are mapped to CSS variables in the root theme.

- **Canvas:** `--color-canvas` (#f3f4f6)
- **Card/Surface:** `--color-card` (#ffffff)
- **Accent (Blue):** `--color-accent` (#2c7aff)
- **Text Ink:**
  - Primary: `--color-ink` (#111827)
  - Muted: `--color-ink-muted` (#4b5563)
  - Subtle: `--color-ink-subtle` (#9ca3af)
- **System States** (error text, toasts, status indicators only — never buttons/nav):
  - Danger: `--color-danger` (#dc2626), tint `--color-danger-light`
  - Success: `--color-success` (#16a34a), tint `--color-success-light`
  - Warning: `--color-warning` (#d97706), tint `--color-warning-light`

### Toasts (Sonner)

Toasts follow the same card language as the rest of the app: `--color-card`
background, `shadow-bento`, and a `rounded-xl` radius. Default/neutral toasts use ink text on card
background; `success`/`warning`/`error` use the matching state color's tint
as background with the solid color as border; `info`/action toasts use the
blue accent. Action buttons inside a toast use `--color-accent` filled,
matching the primary button style.

---

## 3. Structural Layouts

### Mobile (Native App Shell)

- **Layout:** Crisp container cards.
- **Card:** `w-full bg-card border border-line rounded-xl shadow-bento px-5 py-5`

### Desktop (Professional Multi-Panel Grid)

- **Layout:** Structured grid layout with main workspace + side utility panel.
- **Card:** `bg-card border border-line rounded-xl shadow-bento p-5`

---

## 4. UI Component Pattern Matrix

| Element               | Class Pattern                                                                                                       |
| :-------------------- | :------------------------------------------------------------------------------------------------------------------ |
| **Buttons (Mobile)**  | `rounded-xl bg-accent py-3 text-sm font-bold text-inverse`                                                          |
| **Buttons (Desktop)** | `rounded-lg bg-accent px-4 py-2.5 text-sm font-bold text-inverse`                                                   |
| **Inputs**            | `rounded-lg border border-line bg-inset px-3.5 py-2.5 text-sm focus:border-accent`                                  |
| **Badges**            | `text-[10px] font-mono uppercase tracking-wider bg-accent-light/50 border border-accent/10 px-2 py-0.5 rounded-md`   |

---

## 5. Global Utilities

- **Grid Pattern:** Use the `<BackgroundPattern />` component globally for all auth/terminal screens.
- **Shadows:** Use `shadow-bento` for all floating containers.
- **Animations:** Keep transitions subtle (`transition-all`, `active:scale-[0.98]`).
