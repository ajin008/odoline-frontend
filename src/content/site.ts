export interface SiteConfig {
  name: string;
  domain: string;
  email: string;
  whatsappNumber: string;
  city: string;
  demoCta: "whatsapp" | "email";
}

export interface Flags {
  proofPublished: boolean;
  pricingMonthly: { amount: number } | null;
  pricingFoundingOffer: {
    discountPercent: number;
    years: number;
    placesLeft: number;
  } | null;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface FeatureItem {
  title: string;
  description: string;
  icon: string;
}

export interface AudienceItem {
  title: string;
  description: string;
  badge?: string;
}

export interface OnboardingStep {
  number: number;
  title: string;
  description: string;
}

export interface FaqItem {
  question: string;
  answer: string;
  published: boolean;
}

export interface HeroMockStage {
  label: string;
  status: "completed" | "current" | "pending";
  date: string;
}

export interface HeroDashboard {
  caption: string;
  showroom: string;
  role: string;
  nav: string[];
  navFooter: string[];
  greeting: string;
  title: string;
  search: string;
  ranges: string[];
  activeRange: number;
  kpis: { label: string; value: string; note: string }[];
  chart: {
    title: string;
    legend: [string, string];
    highlight: number;
    months: { label: string; enquiries: number; bookings: number }[];
  };
  donut: {
    title: string;
    totalLabel: string;
    segments: { label: string; value: number }[];
  };
  activity: {
    title: string;
    rows: {
      car: string;
      reg: string;
      event: string;
      time: string;
      status: "booked" | "delivered" | "pending";
    }[];
    statusLabels: { booked: string; delivered: string; pending: string };
  };
  journey: {
    title: string;
    car: string;
    stages: HeroMockStage[];
  };
}

export interface LegalPlaceholder {
  isConfirmed: boolean;
  value: string;
}

export interface PrivacySection {
  id: string;
  title: string;
  paragraphs: string[];
}

export type LegalSection = PrivacySection;

export interface LegalPrivacyContent {
  lastUpdated: string;
  reviewed: boolean;
  placeholders: {
    legalEntityName: LegalPlaceholder;
    address: LegalPlaceholder;
    retentionPeriod: LegalPlaceholder;
    grievanceContact: LegalPlaceholder;
  };
  sections: PrivacySection[];
}

export interface LegalTermsContent {
  lastUpdated: string;
  reviewed: boolean;
  placeholders: {
    legalEntityName: LegalPlaceholder;
    jurisdictionCity: LegalPlaceholder;
  };
  sections: LegalSection[];
}

export interface SectionLabels {
  problem: string;
  journey: string;
  features: string;
  partnerships: string;
  audiences: string;
  proof: string;
  pricing: string;
  onboarding: string;
  faq: string;
}

export interface SiteContent {
  siteConfig: SiteConfig;
  sectionLabels: SectionLabels;
  flags: Flags;
  metadata: {
    title: string;
    description: string;
  };
  whatsappMessage: string;
  nav: {
    wordmark: string;
    links: NavLink[];
    button: string;
    loginButton: string;
  };
  hero: {
    tagline: string;
    headline: string;
    headlineMuted: string;
    subtext: string;
    primaryButton: string;
    secondaryButton: string;
    trustLine: string;
    dashboard: HeroDashboard;
  };
  problem: {
    heading: string;
    intro: string;
    painPoints: string[];
    closingLine: string;
  };
  journey: {
    heading: string;
    stages: string[];
    paragraph: string;
  };
  features: {
    heading: string;
    paragraph: string;
    items: FeatureItem[];
    capabilityStrip: string[];
  };
  partnerships: {
    heading: string;
    paragraph: string;
    highlight: string;
    points: string[];
    visualLabels: {
      title: string;
      primary: string;
      partner: string;
      fullAccess: string;
      viewOnly: string;
    };
  };
  audiences: {
    heading: string;
    items: AudienceItem[];
  };
  proof: {
    heading: string;
    showroomName: string | null;
    paragraphNamed: string;
    paragraphNeutral: string;
    testimonial: {
      quote: string;
      name: string;
      role: string;
      showroom: string;
    };
  };
  pricing: {
    heading: string;
    description: string;
    planName: string;
    inclusionsLabel: string;
    footnote: string;
    plan: {
      amount: number;
      currency: string;
      period: string;
      taxNote: string;
    };
    inclusions: string[];
    buttonText: string;
    extraBranch: {
      title: string;
      amount: number;
      period: string;
      staffIncluded: number;
      staffLabel: string;
      badgeText: string;
    };
    foundingOfferTemplate: string;
    monthlyTemplate: string;
  };
  onboarding: {
    heading: string;
    steps: OnboardingStep[];
    closingLine: string;
  };
  faq: {
    heading: string;
    intro: string;
    items: FaqItem[];
  };
  finalCta: {
    eyebrow: string;
    heading: string;
    paragraph: string;
    primaryButton: string;
    secondaryButton: string;
  };
  footer: {
    wordmark: string;
    tagline: string;
    contactHeading: string;
    legalHeading: string;
    contact: {
      email: string;
      whatsapp: string;
      location: string;
    };
    links: NavLink[];
    copyright: string;
  };
  legal: {
    privacy: LegalPrivacyContent;
    terms: LegalTermsContent;
  };
}

export const siteContent: SiteContent = {
  siteConfig: {
    name: "Odoline",
    domain: "https://odoline.app",
    email: "contact@odoline.app",
    whatsappNumber: "916235235097",
    city: "Kerala",
    demoCta: "whatsapp",
  },

  sectionLabels: {
    problem: "The problem",
    journey: "The journey",
    features: "What's inside",
    partnerships: "Partners",
    audiences: "Who it's for",
    proof: "Origin",
    pricing: "Pricing",
    onboarding: "Getting started",
    faq: "Questions",
  },

  flags: {
    proofPublished: false,
    pricingMonthly: null,
    pricingFoundingOffer: null,
  },

  metadata: {
    title: "Odoline — Dealership software for pre-owned car showrooms",
    description:
      "Odoline runs your used-car showroom from one screen: stock, documents, leads, bookings, staff attendance and owner dashboards. ₹30,000/year, no per-user fees.",
  },

  whatsappMessage: "Hi, I'd like a demo of Odoline for my showroom.",

  nav: {
    wordmark: "Odoline",
    links: [
      { label: "Features", href: "/#features" },
      { label: "Pricing", href: "/#pricing" },
      { label: "FAQ", href: "/#faq" },
    ],
    button: "Book a demo",
    loginButton: "Log in",
  },

  hero: {
    tagline: "Every car. Every mile. One timeline.",
    headline: "Run your used‑car showroom",
    headlineMuted: "from one screen.",
    subtext:
      "Odoline tracks every car from purchase to RC transfer, keeps your sales team on top of every enquiry, and shows you exactly where your money is. Built in India, for Indian pre-owned car dealers.",
    primaryButton: "Book a free demo",
    secondaryButton: "Chat on WhatsApp",
    trustLine:
      "₹30,000/year · No per-user fees · Every partner gets their own login",
    dashboard: {
      caption: "Illustration of the Odoline owner dashboard with sample data",
      showroom: "Your Showroom",
      role: "Owner",
      nav: ["Dashboard", "Stock", "Enquiries", "Bookings", "Documents", "Staff", "Reports"],
      navFooter: ["Settings", "Help"],
      greeting: "Good morning",
      title: "Showroom overview",
      search: "Search cars, buyers, reg. no.",
      ranges: ["Today", "Week", "Month"],
      activeRange: 2,
      kpis: [
        { label: "Cars in stock", value: "42", note: "6 in refurbishment" },
        { label: "Open enquiries", value: "18", note: "5 follow-ups today" },
        { label: "Bookings", value: "9", note: "This month" },
        { label: "RC transfers due", value: "3", note: "Needs attention" },
      ],
      chart: {
        title: "Enquiries vs bookings",
        legend: ["Enquiries", "Bookings"],
        highlight: 2,
        months: [
          { label: "May", enquiries: 48, bookings: 14 },
          { label: "Jun", enquiries: 41, bookings: 12 },
          { label: "Jul", enquiries: 62, bookings: 19 },
          { label: "Aug", enquiries: 55, bookings: 16 },
          { label: "Sep", enquiries: 38, bookings: 9 },
        ],
      },
      donut: {
        title: "Stock by stage",
        totalLabel: "cars",
        segments: [
          { label: "Ready for sale", value: 26 },
          { label: "Refurbishment", value: 10 },
          { label: "Booked", value: 6 },
        ],
      },
      activity: {
        title: "Recent activity",
        rows: [
          { car: "Hyundai Creta SX (2021)", reg: "KL 00 AB 0000", event: "Booking confirmed", time: "10:42", status: "booked" },
          { car: "Maruti Swift VXi (2020)", reg: "KL 00 CD 0000", event: "Delivered to buyer", time: "09:15", status: "delivered" },
          { car: "Toyota Innova 2.5 G (2018)", reg: "KL 00 EF 0000", event: "NOC awaited", time: "Yesterday", status: "pending" },
        ],
        statusLabels: { booked: "Booked", delivered: "Delivered", pending: "Docs pending" },
      },
      journey: {
        title: "Car journey",
        car: "Creta SX · KL 00 AB 0000",
        stages: [
          { label: "Purchase", status: "completed", date: "12 May" },
          { label: "Documents", status: "completed", date: "14 May" },
          { label: "Refurbishment", status: "completed", date: "18 May" },
          { label: "In Stock", status: "completed", date: "20 May" },
          { label: "Booking", status: "current", date: "24 May" },
          { label: "Delivery", status: "pending", date: "Est. 28 May" },
        ],
      },
    },
  },

  problem: {
    heading: "Sound familiar?",
    intro:
      "Most pre-owned showrooms run on memory, paper registers and a dozen WhatsApp groups. It works — until it doesn't.",
    painPoints: [
      "A buyer asks about a car and nobody knows if the NOC has come in yet.",
      "A hot lead goes cold because no one called back on Tuesday.",
      "A car is delivered, and the RC transfer is forgotten for three months.",
      'Your partner asks "what\'s our margin this month?" and the answer is a notebook.',
      "Staff attendance is a register someone else signs.",
    ],
    closingLine:
      "Your showroom runs on memory, paper, and WhatsApp. Odoline gives it one system.",
  },

  journey: {
    heading: "Every car's full story, in one place",
    stages: [
      "Purchase",
      "Documents",
      "Refurbishment",
      "Pricing",
      "In stock",
      "Enquiry",
      "Booking",
      "Delivery",
      "RC transfer",
    ],
    paragraph:
      "From the day you buy a car to the day its RC is in the new owner's name, every step is recorded: who did it, when, and what it cost. Open any sold car and see its complete history in one view.",
  },

  features: {
    heading: "Everything your showroom runs on",
    paragraph:
      "Six simple modules to control stock, paperwork, sales, staff, and profit.",
    items: [
      {
        title: "Stock and intake",
        description:
          "Record every car you buy, with seller details, refurbishment costs, and your margin. Always know what's in the yard and what each car really cost.",
        icon: "car",
      },
      {
        title: "No missing papers",
        description:
          "Track RC, NOC, insurance, pollution certificate, and seller KYC for every car. A car can't be delivered until its required documents are in.",
        icon: "file-check",
      },
      {
        title: "Leads and follow-ups",
        description:
          "Every enquiry is assigned to a salesperson with a follow-up date. Nothing slips, and you can see who is converting.",
        icon: "users",
      },
      {
        title: "Bookings and delivery",
        description:
          "Prebook a car the moment a deal is won, so two salespeople can never sell the same car. Generate branded booking documents with amounts in lakhs and in words.",
        icon: "receipt",
      },
      {
        title: "Staff attendance",
        description:
          "Staff clock in from their phone, only when they're at the showroom. See who's present, late, or absent at a glance.",
        icon: "map-pin",
      },
      {
        title: "Owner dashboards",
        description:
          "Enquiries, bookings, deliveries, and staff performance by day, week, or month. Your whole business in one screen.",
        icon: "bar-chart-3",
      },
    ],
    capabilityStrip: [
      "Works on phone and computer",
      "Install it like an app",
      "Light and dark mode",
      "Daily backups",
      "Your data in its own private database",
    ],
  },

  partnerships: {
    heading: "Built for showrooms run by partners",
    paragraph:
      "Most showrooms have more than one owner. With other software, partners share one login, or one partner sees everything while the others ask.",
    highlight:
      "With Odoline, every partner gets their own login, up to 4 per showroom.",
    points: [
      "The primary owner runs the account and makes the changes.",
      "Partners see everything (stock, costs, margins, sales) without the risk of accidental edits.",
      "Every action is recorded with who did it.",
    ],
    visualLabels: {
      title: "Showroom access",
      primary: "Primary owner",
      partner: "Partner",
      fullAccess: "Full access",
      viewOnly: "View only",
    },
  },

  audiences: {
    heading: "Made for serious pre-owned car dealers",
    items: [
      {
        title: "High-volume showrooms",
        description:
          "Cars arriving from other states and enquiries all day. Odoline keeps every car, lead and paper in order.",
      },
      {
        title: "Multi-branch groups",
        description:
          "See every branch from one owner dashboard, with stock and staff tracked where they are.",
        badge: "Coming soon",
      },
      {
        title: "Premium and luxury showrooms",
        description:
          "Fewer cars, bigger deals. Nothing gets forgotten, and every document you hand a buyer looks the part.",
      },
    ],
  },

  proof: {
    heading: "Built inside a working showroom",
    showroomName: null,
    paragraphNamed:
      "Odoline wasn't designed in an office. It was built with ODOLINE Pre-Owned Cars, Malappuram, Kerala, handling their real cars, real buyers, and real paperwork every day.",
    paragraphNeutral:
      "Odoline wasn't designed in an office. It was built with a real pre-owned car showroom in Kerala, handling their real cars, real buyers, and real paperwork every day.",
    testimonial: {
      quote: "Placeholder testimonial quote in owner's own words.",
      name: "Showroom Owner",
      role: "Owner",
      showroom: "ODOLINE Pre-Owned Cars, Malappuram",
    },
  },

  pricing: {
    heading: "Simple pricing. No per-user fees.",
    description:
      "One plan for the whole showroom. Every feature, every partner login, and personal onboarding included.",
    planName: "Showroom plan",
    inclusionsLabel: "What's included",
    footnote: "Starts with a free 30-minute demo.",
    plan: {
      amount: 30000,
      currency: "INR",
      period: "/ year",
      taxNote: "+ 18% GST",
    },
    inclusions: [
      "1 showroom",
      "Up to 4 owner logins",
      "Up to 10 staff",
      "Every feature included",
      "Personal onboarding and training",
      "Daily backups",
    ],
    buttonText: "Book a demo",
    extraBranch: {
      title: "Extra branch",
      amount: 10000,
      period: "/ year",
      staffIncluded: 10,
      staffLabel: "more staff included",
      badgeText: "Multi-branch support coming soon",
    },
    monthlyTemplate: "or {amount} / month",
    foundingOfferTemplate:
      "Founding showroom offer: the first showrooms get {discountPercent}% off, locked for {years} years. {placesLeft} places left.",
  },

  onboarding: {
    heading: "Up and running in days, not months",
    steps: [
      {
        number: 1,
        title: "Book a demo.",
        description:
          "A 30-minute walkthrough with your own showroom in mind.",
      },
      {
        number: 2,
        title: "We set you up.",
        description: "Your showroom name, logo, and staff, ready to go.",
      },
      {
        number: 3,
        title: "We train your team.",
        description:
          "In person or on a call, until everyone is comfortable.",
      },
      {
        number: 4,
        title: "You start selling.",
        description:
          "And you can reach us directly whenever you need help.",
      },
    ],
    closingLine:
      "We work with a small number of showrooms so every customer gets personal support.",
  },

  faq: {
    heading: "Frequently asked questions",
    intro: "Something else on your mind? Ask us on WhatsApp and we'll get back to you.",
    items: [
      {
        question: "Is my data safe?",
        answer:
          "Each showroom has its own private database. Your data is never mixed with another dealer's. Documents are stored privately, and everything is backed up daily.",
        published: true,
      },
      {
        question: "Can my staff use it on their phones?",
        answer:
          "Yes. Odoline works in any phone browser and can be installed like an app.",
        published: true,
      },
      {
        question: "Can my partners see the accounts?",
        answer:
          "Yes. Up to 3 partners get their own read-only login, in addition to the primary owner.",
        published: true,
      },
      {
        question: "What happens if I stop paying?",
        answer:
          "Your data is never deleted. Your account is paused until you renew.",
        published: true,
      },
      {
        question: "Can I cancel?",
        answer:
          "Cancellation details will be provided prior to subscription confirmation.",
        published: false,
      },
      {
        question: "Do you help move our existing stock into Odoline?",
        answer:
          "Yes, data migration assistance is provided during onboarding.",
        published: false,
      },
      {
        question: "Is there a free trial?",
        answer:
          "We offer a live 30-minute demo using your showroom's structure.",
        published: false,
      },
    ],
  },

  finalCta: {
    eyebrow: "Book a demo",
    heading: "See your showroom on Odoline.",
    paragraph:
      "Book a free 30-minute demo. We'll show you exactly how it would work for your cars, your team, and your partners.",
    primaryButton: "Book a free demo",
    secondaryButton: "Chat on WhatsApp",
  },

  footer: {
    wordmark: "Odoline",
    tagline: "Every car, every mile, one timeline.",
    contactHeading: "Contact",
    legalHeading: "Legal",
    contact: {
      email: "contact@odoline.app",
      whatsapp: "+91 6235235097",
      location: "Kerala",
    },
    links: [
      { label: "Privacy policy", href: "/privacy" },
      { label: "Terms of service", href: "/terms" },
    ],
    copyright: "© 2026 Odoline",
  },

  legal: {
    privacy: {
      lastUpdated: "2026-09-24",
      reviewed: false,
      placeholders: {
        legalEntityName: { isConfirmed: false, value: "" },
        address: { isConfirmed: false, value: "" },
        retentionPeriod: { isConfirmed: false, value: "" },
        grievanceContact: { isConfirmed: false, value: "" },
      },
      sections: [
        {
          id: "who-we-are",
          title: "1. Who we are",
          paragraphs: [
            "Odoline is a subscription dealership management system built for pre-owned car showrooms. This marketing website is operated by {{legalEntityName}}, located at {{address}}.",
            "For any inquiries regarding this policy or our website, you can reach us by email at contact@odoline.app.",
          ],
        },
        {
          id: "scope",
          title: "2. What this policy covers",
          paragraphs: [
            "This privacy policy applies exclusively to this marketing website (odoline.app).",
            "It does not apply to the Odoline software application or the customer data stored within it, which are governed by separate subscription and dealership service agreements.",
          ],
        },
        {
          id: "collection",
          title: "3. What we collect when you visit",
          paragraphs: [
            "We do not collect personal information through forms or tracking cookies when you browse this website. We do not use third-party analytics software or tracking scripts.",
            "Our web hosting provider may automatically log standard technical server request data—such as your IP address, browser type, requested pages, and access timestamps—solely for network security and site operations.",
          ],
        },
        {
          id: "device-storage",
          title: "4. Stored on your device",
          paragraphs: [
            "We use your browser's local storage (under the key name 'theme') to save your preference for light or dark mode.",
            "This preference remains stored locally on your device, is never transmitted to our servers, and can be cleared at any time through your browser settings.",
          ],
        },
        {
          id: "contact-us",
          title: "5. When you contact us",
          paragraphs: [
            "When you contact us via WhatsApp or email, we receive your name, contact phone number or email address, and the content of your message.",
            "We use this information solely to respond to your inquiry and arrange a product demonstration. WhatsApp messaging is provided by Meta under Meta's own privacy policy.",
          ],
        },
        {
          id: "retention",
          title: "6. How long we keep it",
          paragraphs: [
            "We retain contact messages and inquiry details only for as long as necessary to complete your conversation and manage any resulting business relationship ({{retentionPeriod}}), after which the data is deleted.",
          ],
        },
        {
          id: "sharing",
          title: "7. Who we share it with",
          paragraphs: [
            "We do not sell, rent, or trade your personal information.",
            "We share data only with essential infrastructure providers required to run our site and email services, or when required by law.",
          ],
        },
        {
          id: "your-rights",
          title: "8. Your rights",
          paragraphs: [
            "Under applicable Indian law, including the Digital Personal Data Protection Act, 2023, you have the right to request access to, correction of, or deletion of your personal data, and to submit a grievance.",
            "To exercise these rights or raise a grievance, contact our grievance officer: {{grievanceContact}}.",
          ],
        },
        {
          id: "children",
          title: "9. Children",
          paragraphs: [
            "This website is designed for business operators and is not directed at or intended for children under the age of 18.",
          ],
        },
        {
          id: "changes",
          title: "10. Changes",
          paragraphs: [
            "We update this policy when our practices or legal requirements change. The date of the latest update is indicated at the top of this page.",
          ],
        },
        {
          id: "contact",
          title: "11. Contact",
          paragraphs: [
            "If you have questions about this privacy policy, please email us at contact@odoline.app.",
          ],
        },
      ],
    },
    terms: {
      lastUpdated: "2026-09-24",
      reviewed: false,
      placeholders: {
        legalEntityName: { isConfirmed: false, value: "" },
        jurisdictionCity: { isConfirmed: false, value: "" },
      },
      sections: [
        {
          id: "about-these-terms",
          title: "1. About these terms",
          paragraphs: [
            "These Terms of Service ('Terms') govern your access to and use of the Odoline marketing website located at odoline.app ('this site').",
            "By accessing or browsing this site, you agree to be bound by these Terms. If you do not agree with these Terms, please do not use this site.",
          ],
        },
        {
          id: "not-a-contract",
          title: "2. Not a contract for the software",
          paragraphs: [
            "This website is provided solely for information, marketing, and demonstration purposes. Visiting or using this site does not constitute an offer, agreement, or contract for the purchase or licensing of the Odoline software application.",
            "Purchasing, subscribing to, and using the Odoline software application is governed exclusively by a separate customer agreement executed during onboarding. Nothing on this website creates software subscription rights, service level agreements, refund rights, or binding product performance warranties.",
          ],
        },
        {
          id: "site-information",
          title: "3. Information on this site",
          paragraphs: [
            "We strive to ensure that the information on this website, including feature descriptions, screenshots, and product specifications, is accurate and up to date.",
            "However, product features, interfaces, and availability may evolve or change over time. Content on this site is provided for general information only and does not constitute a legally binding representation.",
          ],
        },
        {
          id: "pricing-terms",
          title: "4. Pricing",
          paragraphs: [
            "Pricing information displayed on this website is indicative and provided for general reference only.",
            "Final subscription pricing, payment schedules, tax treatments, and plan inclusions for the Odoline software application are established solely in your individual customer agreement.",
          ],
        },
        {
          id: "using-this-site",
          title: "5. Using this site",
          paragraphs: [
            "You agree to use this site only for lawful purposes and in accordance with these Terms. You must not attempt to compromise site security, perform automated scraping or data harvesting without permission, or disrupt site availability.",
            "You must not use our contact links, email addresses, or WhatsApp links to transmit spam, unsolicited commercial communications, or fraudulent inquiries.",
          ],
        },
        {
          id: "our-content",
          title: "6. Our content",
          paragraphs: [
            "All materials on this site—including text, graphics, logos, images, software code, and overall design—are owned by {{legalEntityName}} or its licensors and are protected by copyright, trademark, and intellectual property laws.",
            "You may not reproduce, distribute, modify, or create derivative works from any content on this site without our prior written permission.",
          ],
        },
        {
          id: "other-services",
          title: "7. Other services",
          paragraphs: [
            "This site may contain links to third-party services and channels, such as WhatsApp (provided by Meta). We do not control, endorse, or accept responsibility for third-party platforms or their policies.",
            "Your interaction with any third-party service is governed by that provider's own terms and privacy policy.",
          ],
        },
        {
          id: "no-warranties",
          title: "8. No warranties for the website",
          paragraphs: [
            "This website is provided on an 'as is' and 'as available' basis without warranties of any kind, whether express, implied, or statutory.",
            "We make no guarantees that this site will be uninterrupted, error-free, secure, or free from viruses or other malicious components.",
          ],
        },
        {
          id: "limitation",
          title: "9. Limitation of liability",
          paragraphs: [
            "To the extent permitted by applicable law, we are not liable for any losses or damages arising from your use of or inability to use this marketing website.",
          ],
        },
        {
          id: "privacy-terms",
          title: "10. Privacy",
          paragraphs: [
            "Our collection and handling of personal data through this website is governed by our [Privacy policy](/privacy).",
          ],
        },
        {
          id: "governing-law",
          title: "11. Governing law and jurisdiction",
          paragraphs: [
            "These Terms are governed by and construed in accordance with the laws of India.",
            "Any disputes, claims, or proceedings arising out of or in connection with your use of this website shall be subject to the exclusive jurisdiction of the courts located in {{jurisdictionCity}}.",
          ],
        },
        {
          id: "changes-terms",
          title: "12. Changes to these terms",
          paragraphs: [
            "We reserve the right to modify these Terms at any time. Any changes will be posted on this page with an updated 'Last updated' date.",
            "Your continued use of this site after updated Terms are published constitutes your acceptance of the changes.",
          ],
        },
        {
          id: "contact-terms",
          title: "13. Contact",
          paragraphs: [
            "If you have questions or concerns about these Terms of Service, please email us at contact@odoline.app.",
          ],
        },
      ],
    },
  },
};

export function buildWhatsAppLink(customMessage?: string): string {
  const text = customMessage || siteContent.whatsappMessage;
  const rawNumber = siteContent.siteConfig.whatsappNumber.replace(
    /[^0-9]/g,
    ""
  );
  return `https://wa.me/${rawNumber}?text=${encodeURIComponent(text)}`;
}

export function buildEmailLink(customSubject?: string, customBody?: string): string {
  const email = siteContent.siteConfig.email;
  const subject = encodeURIComponent(customSubject || "Odoline demo request");
  const body = encodeURIComponent(customBody || siteContent.whatsappMessage);
  return `mailto:${email}?subject=${subject}&body=${body}`;
}

export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(amount);
}

export function formatENINDate(isoDateString: string): string {
  const date = new Date(isoDateString);
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}
