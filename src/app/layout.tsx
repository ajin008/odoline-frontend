import { Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { generalSans, clashGrotesk } from "./fonts";
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
      className={`${generalSans.variable} ${clashGrotesk.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
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
