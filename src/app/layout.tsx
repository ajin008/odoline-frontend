import { Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { generalSans, clashGrotesk } from "./fonts";
import "./globals.css";
import RegisterServiceWorker from "./register-sw";

export { metadata, viewport } from "./metadata";

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
        {children}
        <Toaster position="top-right" theme="system" richColors={false} closeButton />
      </body>
    </html>
  );
}
