# Odoline Frontend — Project Architecture & Context Guide

This document provides a comprehensive technical overview of the **Odoline Frontend** codebase (`odoline-frontend`). It details the directory structure, application architecture, technology stack, dependencies, and development conventions. It is designed to serve as an authoritative context guide for developers and AI models working on this repository.

---

## 1. High-Level Architecture Overview

**Odoline Frontend** is a Progressive Web Application (PWA) built for automobile dealership management ("Showroom OS"). The application handles vehicle inventory management, lead tracking, customer booking agreements, settlement statements, staff attendance, sales analytics, and role-based permissions.

### Core Architectural Patterns
- **Framework & Rendering**: Built on **Next.js 16 (App Router)** with **React 19** and **TypeScript**. Uses client-side state fetching and caching with server-side page structure.
- **Feature-Driven Architecture**: Business domains are completely self-contained within `src/features/<feature-name>/`.
- **Role-Based Layout Segmentation**: Route groups `(auth)`, `(owner)`, and `(staff)` cleanly separate layout hierarchies, authentication guards, and navigation based on user roles.
- **Data Fetching & Server Caching**: Driven by **TanStack React Query (v5)**. API endpoints and query keys are strictly centralized.
- **Form Management**: Standardized using **React Hook Form** paired with **Zod** schema validation via `@hookform/resolvers/zod`.
- **PWA & Offline Functionality**: Service worker caching and offline PDF/image document generation managed via **Serwist** (`@serwist/next`).
- **Styling & UI Components**: Tailored using **Tailwind CSS v4** with a dark/light design system, custom typography ("Clash Grotesk" & "General Sans"), and **Lucide React** icon primitives.

---

## 2. Directory Structure

```
odoline-frontend/
├── docs/                           # Project documentation for developers & AI agents
│   └── PROJECT_ARCHITECTURE.md     # Architectural guide and context (this file)
├── public/                         # Static assets (brand icons, PWA icons, manifest assets)
├── src/
│   ├── app/                        # Next.js App Router (Routing layer only)
│   │   ├── (auth)/                 # Pre-auth routes (login, forgot-password)
│   │   ├── (owner)/                # Owner/Admin portal routes (dashboard, inventory, sales, team)
│   │   ├── (staff)/                # Staff portal routes (terminal, lead workflow, attendance)
│   │   ├── favicon.ico
│   │   ├── fonts.ts                # Font configuration
│   │   ├── globals.css             # Tailwind CSS & global theme tokens
│   │   ├── layout.tsx              # Root HTML wrapper & QueryProvider
│   │   ├── manifest.ts             # PWA Web Manifest generator
│   │   ├── metadata.ts             # Default app metadata & SEO configuration
│   │   ├── not-found.tsx           # Custom 404 error page
│   │   ├── page.tsx                # Root redirect / landing entrypoint
│   │   ├── register-sw.tsx         # PWA Service Worker registrar
│   │   └── sw.ts                   # Serwist Service Worker implementation
│   ├── components/                 # Cross-cutting UI components (Non-domain specific)
│   │   ├── providers.tsx           # React Query & Theme providers
│   │   └── ui/                     # Generic UI primitives (FormInput, DatePicker, CustomSelect, etc.)
│   ├── config/                     # Application configurations
│   │   └── brand.ts                # Pre-auth brand constants (e.g. login branding)
│   ├── features/                   # Self-contained business feature modules
│   │   ├── attendance/             # Staff check-in, check-out, and geolocation tracking
│   │   ├── auth/                   # Authentication logic, login forms, token storage
│   │   ├── booking/                # Vehicle booking workflow, agreements, settlements, PDFs
│   │   ├── cars/                   # Vehicle inventory, stock management, car photos/docs
│   │   ├── dashboard/              # Owner & Staff dashboard views, layouts, sidebars
│   │   ├── leads/                  # CRM lead pipeline, stage tracking, customer notes
│   │   ├── sales/                  # Financial reports, margin calculations, sales logs
│   │   ├── settings/               # Showroom configuration, profile, password management
│   │   └── team/                   # Staff management, user role assignments
│   ├── lib/                        # Core infrastructure & singleton utilities
│   │   ├── api-client.ts           # Centralized Axios instance with auth interceptors
│   │   ├── endpoints.ts            # Single source of truth for backend API route paths
│   │   ├── file-actions.ts         # PDF generation, blob downloading, and web share handlers
│   │   ├── formatters.ts           # Currency (Lakhs/Crores), date, and phone formatters
│   │   ├── query-client.ts         # TanStack React Query client initialization
│   │   └── query-keys.ts           # Centralized React Query key factory
│   └── utils/                      # Low-level helper functions
│       ├── currency.ts             # Currency parsing and formatting helpers
│       ├── env.ts                  # Environment variable access & validation
│       ├── error-handler.ts        # API error normalizer for toast alerts
│       └── phone.ts                # Phone number sanitization
├── AGENTS.md                       # Repository rules for AI agents
├── CLAUDE.md                       # Agent directive pointer
├── design-system.md                # UI & Design System specifications
├── next.config.ts                  # Next.js & S3 remote pattern settings
├── package.json                    # Project metadata & dependencies
├── serwist.config.mjs              # PWA service worker builder configuration
└── tsconfig.json                   # TypeScript compiler settings
```

---

## 3. Standard Feature Module Layout

Every domain in `src/features/<feature-name>/` follows a modular layout:

```
src/features/<feature-name>/
├── api/          # Axios network requests calling `endpoints.<feature>`
├── components/   # React components specific to this feature module
├── hooks/        # React Query hooks (`useQuery`, `useMutation`) using `queryKeys.<feature>`
├── schemas/      # Zod validation schemas for forms and request payloads
├── types/        # TypeScript interfaces and type definitions
└── utils/        # Feature-specific formatting or calculation helpers (optional)
```

---

## 4. Key Dependencies & Tech Stack

| Category | Package / Tool | Purpose |
|---|---|---|
| **Framework** | `next@16.2.10`, `react@19.2.4` | App Router, Server Components, Modern Client Hooks |
| **Language** | `typescript@^5` | Strict Static Typing across routes, APIs, and schemas |
| **Data Fetching** | `@tanstack/react-query@^5` | Server state cache, optimistic updates, query invalidation |
| **HTTP Client** | `axios@^1.18.1` | REST API communication, token header injection, error interceptors |
| **Forms & Validation** | `react-hook-form@^7`, `zod@^4`, `@hookform/resolvers` | Controlled form state, real-time validation, type safety |
| **UI & Styling** | `tailwindcss@^4`, `lucide-react`, `next-themes` | Utility-first styling, icons, dark/light theme switching |
| **Data Visualization** | `recharts@^3.10.1` | Analytics charts for sales, lead conversion, and inventory |
| **Maps & Location** | `leaflet`, `react-leaflet` | Staff check-in geolocation visualization |
| **PDF & Sharing** | `html2pdf.js`, `browser-image-compression` | In-browser PDF generation, mobile web sharing, image compression |
| **PWA Engine** | `@serwist/next`, `@serwist/cli`, `serwist` | Service worker compilation, offline caching strategies |
| **Toast Alerts** | `sonner` | Toast notifications for async actions and error feedback |

---

## 5. Guidelines & Conventions for AI Models

When extending or modifying code in this repository, ALWAYS adhere to the following rules:

### 1. API Route Centralization
- **NEVER** hardcode API URL strings inside components or custom hooks.
- **ALWAYS** add new API paths to [endpoints.ts](file:///Users/ajinkp/Desktop/Project/odoline-frontend/src/lib/endpoints.ts).
- **ALWAYS** add new query key definitions to [query-keys.ts](file:///Users/ajinkp/Desktop/Project/odoline-frontend/src/lib/query-keys.ts).

### 2. Data Fetching Pattern
- Perform network calls in `src/features/<feature>/api/<feature>-api.ts`.
- Wrap API calls in React Query hooks in `src/features/<feature>/hooks/use-<feature>-*.ts`.
- Components should only consume the custom hooks, never calling Axios directly.

### 3. Forms & Validation
- Define form validation schemas using Zod in `src/features/<feature>/schemas/`.
- Infer form types from the Zod schema (`type FormValues = z.infer<typeof schema>`).
- Wire forms using `useForm({ resolver: zodResolver(schema) })`.

### 4. UI & Styling
- Refer to [design-system.md](file:///Users/ajinkp/Desktop/Project/odoline-frontend/design-system.md) for color tokens (`bg-inset`, `bg-card`, `text-ink`, `border-line`, `text-accent`).
- Re-use shared components from `src/components/ui/` (`FormInput`, `CustomSelect`, `ConfirmModal`, `DocumentPreviewModal`, `DatePicker`).
- Use `lucide-react` icons.

### 5. Brand Naming
- Project name is **Odoline** (`odoline-frontend`).
- Pre-auth login branding constant is defined in [brand.ts](file:///Users/ajinkp/Desktop/Project/odoline-frontend/src/config/brand.ts).
