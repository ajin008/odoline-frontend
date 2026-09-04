// Static brand config for PRE-AUTH pages (e.g. login) where the DB config
// isn't reachable yet. To rebrand the login page, change values HERE (one place),
// then rebuild/redeploy. (In-app branding stays DB-driven via owner settings.)
export const BRAND = {
  companyName: "CARS 4 PRE OWNED CARS", // ← the showroom name shown on login
  logoPath: "/icons/icon-512.png", // ← login logo (from public/)
  tagline: "Showroom OS", // optional; use if the login shows one
} as const;
