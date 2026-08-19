import { Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { satoshi, cabinetGrotesk } from "./fonts";
import "./globals.css";
import RegisterServiceWorker from "./register-sw";

export { metadata, viewport } from "./metadata";
import { Providers } from "../components/providers";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${satoshi.variable} ${cabinetGrotesk.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <RegisterServiceWorker />
        <Providers>
          {children}
          <Toaster
            position="top-right"
            theme="system"
            richColors={false}
            closeButton
          />
        </Providers>
      </body>
    </html>
  );
}
