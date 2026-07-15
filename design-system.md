# Design System - Cars4 DMS (Internal SaaS Tool)

## Platform Priority

Primary: Mobile (phone screen 390px)
Staff use phones at showroom floor
Owner checks stock on phone always

Secondary: Tablet
Owner might use iPad at desk

Tertiary: Desktop
Developer reference only

Design mobile first — all components designed for 390px width first, then scale up.

---

## Design Philosophy

"Two colors. Four greys. Color only for status. Everything else is type and space."

The entire app runs on #ffffff and #272727.
Color appears only in status badges — never in buttons, navigation, or structural elements.
Hierarchy is achieved through weight, size, and opacity — not color.

---

## Colors

### Core Palette — Four values only

```
White       #ffffff    Canvas, cards, inputs
Off-white   #edeef0    Secondary backgrounds, hover states
Mid grey    #777778    Secondary text, placeholders, icons
Near black  #272727    Primary text, buttons, borders, active states
```

### Full token map

```css
:root {
  /* Backgrounds */
  --bg-primary: #ffffff; /* Main canvas */
  --bg-secondary: #edeef0; /* Secondary areas, sidebar */
  --bg-hover: #edeef0; /* Hover state for interactive items */

  /* Text */
  --text-primary: #272727; /* Headings, labels, values */
  --text-secondary: #777778; /* Supporting text, captions */
  --text-muted: #777778; /* Placeholders, disabled, metadata */
  --text-inverse: #ffffff; /* Text on dark backgrounds */

  /* Borders */
  --border: #edeef0; /* Default border */
  --border-dark: #272727; /* Active/focused border */

  /* Interactive */
  --interactive-bg: #000000; /* Button bg, active tab bg */
  --interactive-text: #ffffff; /* Text on interactive-bg */
  --interactive-hover: #3d3d3d; /* Button hover — slightly lighter than #000000 */
  --interactive-outline: #272727; /* Focus rings, outlined buttons */

  /* System states — used ONLY for status badges */
  --danger: #c45a4a;
  --danger-light: rgba(196, 90, 74, 0.1);
  --success: #2b7a4b;
  --success-light: rgba(43, 122, 75, 0.1);
  --warning: #d4a14b;
  --warning-light: rgba(212, 161, 75, 0.1);
  --info: #3b82f6;
  --info-light: rgba(59, 130, 246, 0.1);
}
```

---

## Status Badge Colors

Status badges are the ONLY place color appears in the app.
Everything else is monochrome.

```css
:root {
  /* Draft */
  --status-draft-text: #777778;
  --status-draft-bg: #edeef0;
  --status-draft-border: #edeef0;

  /* Purchasing */
  --status-purchasing-text: #92540a;
  --status-purchasing-bg: #fef3c7;
  --status-purchasing-border: #d4a14b;

  /* In Refurbishment */
  --status-refurb-text: #1e40af;
  --status-refurb-bg: #dbeafe;
  --status-refurb-border: #3b82f6;

  /* Refurb Complete */
  --status-refurb-complete-text: #14532d;
  --status-refurb-complete-bg: #dcfce7;
  --status-refurb-complete-border: #2b7a4b;

  /* In Stock */
  --status-stock-text: #14532d;
  --status-stock-bg: #dcfce7;
  --status-stock-border: #2b7a4b;

  /* Booked */
  --status-booked-text: #5b21b6;
  --status-booked-bg: #ede9fe;
  --status-booked-border: #7c3aed;

  /* Delivered */
  --status-delivered-text: #777778;
  --status-delivered-bg: #edeef0;
  --status-delivered-border: #edeef0;

  /* Closed */
  --status-closed-text: #777778;
  --status-closed-bg: #edeef0;
  --status-closed-border: #edeef0;
}
```

---

## Document Status Colors

```css
:root {
  /* Hard — required, blocks progress */
  --doc-hard-text: #c45a4a;
  --doc-hard-bg: rgba(196, 90, 74, 0.08);
  --doc-hard-border: #c45a4a;

  /* Soft — optional */
  --doc-soft-text: #777778;
  --doc-soft-bg: #edeef0;
  --doc-soft-border: #edeef0;

  /* Uploaded */
  --doc-uploaded-text: #14532d;
  --doc-uploaded-bg: #dcfce7;
  --doc-uploaded-border: #2b7a4b;

  /* Pending */
  --doc-pending-text: #92540a;
  --doc-pending-bg: #fef3c7;
  --doc-pending-border: #d4a14b;
}
```

---

## Typography

### Font Stack

```
--font-heading: 'Clash Grotesk', -apple-system, sans-serif;
--font-body:    'General Sans',  -apple-system, sans-serif;
```

### Font Weights

```
Clash Grotesk
  600  Semibold   Headings, navigation labels
  700  Bold       Hero text, page titles

General Sans
  400  Regular    Body text, input values
  500  Medium     Labels, subheadings, captions
  600  Semibold   Button text, active nav, emphasis
```

### Type Scale

```css
:root {
  --text-3xl: 48px; /* Hero — Clash Grotesk 700, lh 1.05 */
  --text-2xl: 36px; /* Section title — Clash Grotesk 600, lh 1.1 */
  --text-xl: 28px; /* Page heading — Clash Grotesk 600, lh 1.2 */
  --text-lg: 20px; /* Subheading — Clash Grotesk 600, lh 1.3 */
  --text-base: 16px; /* Body — General Sans 400, lh 1.6 */
  --text-sm: 14px; /* Secondary — General Sans 400, lh 1.5 */
  --text-xs: 12px; /* Label — General Sans 500, lh 1.4 */
  --text-2xs: 11px; /* Metadata — General Sans 500, lh 1.3 */
}
```

### Letter Spacing

```css
:root {
  --tracking-tight: -0.02em; /* Headings */
  --tracking-normal: 0em; /* Body */
  --tracking-wide: 0.03em; /* Labels, uppercase */
}
```

---

## Spacing (8px Grid)

```css
:root {
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-7: 32px;
  --space-8: 40px;
  --space-9: 48px;
  --space-10: 56px;
  --space-11: 64px;
  --space-12: 80px;
}
```

---

## Border Radius

```css
:root {
  --radius-sm: 4px; /* Badges, tags */
  --radius-md: 8px; /* Inputs, buttons */
  --radius-lg: 12px; /* Cards, modals */
  --radius-xl: 16px; /* Large containers */
  --radius-full: 9999px; /* Pills, avatars */
}
```

---

## Shadows

Shadows are rare — use borders instead.
Shadows only for elevated modals and dropdown menus.

```css
:root {
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.04);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.08);
}
```

---

## Components

---

### Buttons

**Primary (dark fill)**

```
background:    --interactive-bg      (#000000)
color:         --interactive-text    (#ffffff)
font:          General Sans 600, --text-sm
padding:       --space-3 --space-6   (12px 24px)
border-radius: --radius-md           (8px)
border:        none

hover:         background #3d3d3d, translateY(-1px)
active:        translateY(0)
disabled:      opacity 0.4, cursor not-allowed
focus:         outline 2px solid #272727, offset 2px
```

**Secondary (outlined)**

```
background:    transparent
color:         --text-primary        (#272727)
font:          General Sans 500, --text-sm
padding:       --space-3 --space-6
border-radius: --radius-md
border:        1.5px solid --border  (#edeef0)

hover:         border-color #272727, background --bg-secondary
focus:         outline 2px solid #272727, offset 2px
```

**Ghost**

```
background:    transparent
color:         --text-secondary      (#777778)
font:          General Sans 500, --text-sm
padding:       --space-2 --space-4   (8px 16px)
border-radius: --radius-sm
border:        none

hover:         color #272727, background #edeef0
```

**Danger**

```
background:    --danger              (#C45A4A)
color:         #ffffff
font:          General Sans 600, --text-sm
padding:       --space-3 --space-6
border-radius: --radius-md
border:        none

hover:         opacity 0.88
```

---

### Input Fields

```
Label
  font:           General Sans 500, --text-xs
  color:          --text-secondary
  letter-spacing: --tracking-wide
  text-transform: uppercase
  margin-bottom:  --space-2

Input
  font:           General Sans 400, --text-base
  color:          --text-primary
  background:     --bg-secondary     (#edeef0)
  border:         1.5px solid transparent
  border-radius:  --radius-md
  padding:        --space-3 --space-4

States
  Default:    border transparent, bg #edeef0
  Focus:      border #272727, bg #ffffff
              box-shadow: 0 0 0 3px rgba(39,39,39,0.08)
  Error:      border --danger, bg #ffffff
              box-shadow: 0 0 0 3px --danger-light
  Disabled:   opacity 0.45, cursor not-allowed
  Placeholder: color --text-muted (#777778)
```

---

### Cards

```
background:    --bg-primary     (#ffffff)
border:        1.5px solid --border  (#edeef0)
border-radius: --radius-lg      (12px)
padding:       --space-6        (24px)
shadow:        none             (border only)

Interactive hover
  border-color:  #272727
  shadow:        --shadow-sm
  cursor:        pointer
```

---

### Status Badge

```
display:       inline-flex
align-items:   center
gap:           --space-1       (4px)
padding:       2px --space-2   (2px 8px)
border-radius: --radius-full
border:        1px solid [status]-border
background:    [status]-bg
color:         [status]-text
font:          General Sans 500, --text-xs
letter-spacing: --tracking-wide

Optional dot
  width:       5px
  height:      5px
  border-radius: 50%
  background:  [status]-border
```

**Labels**

```
draft              → "Draft"
purchasing         → "Purchasing"
in_refurbishment   → "In Refurbishment"
refurb_complete    → "Ready for Stock"
in_stock           → "In Stock"
booked             → "Booked"
delivered          → "Delivered"
closed             → "Closed"
```

---

### Navigation (Bottom Nav — Mobile)

```
Container
  position:    fixed, bottom 0
  width:       100%
  background:  --bg-primary
  border-top:  1.5px solid --border
  display:     flex
  padding-bottom: env(safe-area-inset-bottom)

Nav item
  flex:         1
  display:      flex, column, center
  gap:          --space-1
  padding:      --space-2

Icon (22px)
  inactive:    color --text-muted    (#777778)
  active:      color --text-primary  (#272727)

Label (--text-2xs, General Sans 500)
  inactive:    color --text-muted
  active:      color --text-primary, weight 600

Active indicator
  small dot or bold weight
  NO colored pill or colored icon
  Pure dark on white
```

---

### Tab Navigation

Used in purchase onboarding 3-tab flow.

```
Container
  display:      flex
  border-bottom: 1.5px solid --border

Tab item
  flex:         1
  padding:      --space-3 --space-4
  font:         General Sans 500, --text-sm
  text-align:   center
  position:     relative

  inactive:     color --text-muted
  active:       color --text-primary, weight 600

Active indicator
  position:     absolute, bottom -1.5px
  height:       2px
  background:   --text-primary  (#272727)
  width:        100%

Locked tab
  color:        --text-muted
  opacity:      0.4
  cursor:       not-allowed

Completed tab
  color:        --text-secondary
  Show ✓ checkmark in --text-secondary
```

---

### Progress Bar

```
Track
  height:       3px
  background:   --bg-secondary  (#edeef0)
  border-radius: --radius-full

Fill
  background:   --text-primary  (#272727)
  border-radius: --radius-full
  transition:   width 0.3s ease

Label
  font:         General Sans 500, --text-xs
  color:        --text-secondary
  margin-bottom: --space-1
```

---

### Car Card

```
Structure
  Container: interactive card
  ├── Left:   thumbnail 48×48, radius-md
  │           grey placeholder bg #edeef0
  ├── Center:
  │   ├── Car name  — General Sans 600, --text-sm, #272727
  │   ├── Reg num   — General Sans 400, --text-xs, #777778
  │   └── Status badge
  └── Right:
      ├── Selling price — General Sans 600, --text-sm, #272727
      └── Chevron icon  — #777778

padding:       --space-4
border-bottom: 1.5px solid --border
last-child:    no border
```

---

## Layout Rules

### Mobile App Shell

```
Header
  height:       56px
  background:   --bg-primary
  border-bottom: 1.5px solid --border
  padding:      0 --space-4
  display:      flex, center, space-between

Content
  padding-top:    56px
  padding-bottom: 80px
  padding-x:      --space-4
  overflow-y:     scroll

Bottom nav
  height:       64px + safe-area-inset-bottom
  fixed bottom
```

### Login — Split Screen (Desktop)

```
Mobile (<768px)
  Single column, full height
  Form only, no visual panel

Desktop (md+)
  Grid: 3fr 2fr
  Left:  brand/visual panel, bg #272727, text white
  Right: form panel, bg #ffffff
```

### Centered Card

```
Container: flex, center both axes, min-height 100vh
Card:      max-width 480px, padding --space-8
           bg #ffffff, border 1.5px solid #edeef0
           border-radius --radius-lg
```

---

## Responsive Breakpoints

```
sm:  640px   Mobile landscape
md:  768px   Tablet — split screen activates
lg:  1024px  Desktop
xl:  1280px  Large desktop
```

---

## CSS Variables — Complete Copy-Paste

```css
:root {
  /* Fonts */
  --font-heading: "Clash Grotesk", -apple-system, sans-serif;
  --font-body: "General Sans", -apple-system, sans-serif;

  /* Core palette */
  --bg-primary: #ffffff;
  --bg-secondary: #edeef0;
  --bg-hover: #edeef0;

  --text-primary: #272727;
  --text-secondary: #777778;
  --text-muted: #777778;
  --text-inverse: #ffffff;

  --border: #edeef0;
  --border-dark: #272727;

  --interactive-bg: #000000;
  --interactive-text: #ffffff;
  --interactive-hover: #3d3d3d;

  /* System states — status badges only */
  --danger: #c45a4a;
  --danger-light: rgba(196, 90, 74, 0.1);
  --success: #2b7a4b;
  --success-light: rgba(43, 122, 75, 0.1);
  --warning: #d4a14b;
  --warning-light: rgba(212, 161, 75, 0.1);
  --info: #3b82f6;
  --info-light: rgba(59, 130, 246, 0.1);

  /* Status badges */
  --status-draft-text: #777778;
  --status-draft-bg: #edeef0;
  --status-draft-border: #edeef0;

  --status-purchasing-text: #92540a;
  --status-purchasing-bg: #fef3c7;
  --status-purchasing-border: #d4a14b;

  --status-refurb-text: #1e40af;
  --status-refurb-bg: #dbeafe;
  --status-refurb-border: #3b82f6;

  --status-refurb-complete-text: #14532d;
  --status-refurb-complete-bg: #dcfce7;
  --status-refurb-complete-border: #2b7a4b;

  --status-stock-text: #14532d;
  --status-stock-bg: #dcfce7;
  --status-stock-border: #2b7a4b;

  --status-booked-text: #5b21b6;
  --status-booked-bg: #ede9fe;
  --status-booked-border: #7c3aed;

  --status-delivered-text: #777778;
  --status-delivered-bg: #edeef0;
  --status-delivered-border: #edeef0;

  --status-closed-text: #777778;
  --status-closed-bg: #edeef0;
  --status-closed-border: #edeef0;

  /* Document status */
  --doc-hard-text: #c45a4a;
  --doc-hard-bg: rgba(196, 90, 74, 0.08);
  --doc-hard-border: #c45a4a;

  --doc-soft-text: #777778;
  --doc-soft-bg: #edeef0;
  --doc-soft-border: #edeef0;

  --doc-uploaded-text: #14532d;
  --doc-uploaded-bg: #dcfce7;
  --doc-uploaded-border: #2b7a4b;

  --doc-pending-text: #92540a;
  --doc-pending-bg: #fef3c7;
  --doc-pending-border: #d4a14b;

  /* Spacing */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-7: 32px;
  --space-8: 40px;
  --space-9: 48px;
  --space-10: 56px;
  --space-11: 64px;
  --space-12: 80px;

  /* Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.04);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.08);

  /* Letter spacing */
  --tracking-tight: -0.02em;
  --tracking-normal: 0em;
  --tracking-wide: 0.03em;
}
```

---

## Quick Reference

| Element       | Font          | Weight | Size | Color   |
| ------------- | ------------- | ------ | ---- | ------- |
| Page Title    | Clash Grotesk | 700    | 28px | #272727 |
| Section Title | Clash Grotesk | 600    | 20px | #272727 |
| Body Text     | General Sans  | 400    | 16px | #777778 |
| Labels        | General Sans  | 500    | 12px | #777778 |
| Button Text   | General Sans  | 600    | 14px | #ffffff |
| Input Text    | General Sans  | 400    | 16px | #272727 |
| Metadata      | General Sans  | 500    | 11px | #777778 |

## Status Badge Quick Reference

| Status           | Label            | Text    | Background | Border  |
| ---------------- | ---------------- | ------- | ---------- | ------- |
| draft            | Draft            | #777778 | #edeef0    | #edeef0 |
| purchasing       | Purchasing       | #92540a | #fef3c7    | #D4A14B |
| in_refurbishment | In Refurbishment | #1e40af | #dbeafe    | #3b82f6 |
| refurb_complete  | Ready for Stock  | #14532d | #dcfce7    | #2B7A4B |
| in_stock         | In Stock         | #14532d | #dcfce7    | #2B7A4B |
| booked           | Booked           | #5b21b6 | #ede9fe    | #7c3aed |
| delivered        | Delivered        | #777778 | #edeef0    | #edeef0 |
| closed           | Closed           | #777778 | #edeef0    | #edeef0 |

---

## Rules — one-liners to remember

```
Never use color for buttons             Dark fill (#000000) only
Never use color for navigation          Black active, grey inactive
Never use color for cards or borders    #edeef0 always
Color is only for status badges         And doc status indicators
Focus rings are dark                    0 0 0 3px rgba(39,39,39,0.08)
Input hover/focus background            #ffffff on focus, #edeef0 default
Progress bars are dark                  #272727 fill on #edeef0 track
Shadow is rare                          Border first, shadow only for modals
```
