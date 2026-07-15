import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Cars4",
  description: "Cars4",
  icons: {
    icon: [{ url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  appleWebApp: {
    title: "Cars4",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  themeColor: "#163d8c",
  width: "device-width",
  initialScale: 1,
};
