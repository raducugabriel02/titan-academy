import type { Metadata, Viewport } from "next";
import { Anton, Barlow, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import PwaRegister from "@/components/pwa-register";

const anton = Anton({
  weight: "400",
  variable: "--font-anton",
  subsets: ["latin", "latin-ext"],
});

const barlow = Barlow({
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  variable: "--font-barlow",
  subsets: ["latin", "latin-ext"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Titan Academy",
  description: "Arsenalul tău digital pentru performanță maximă.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Titan Academy",
  },
  // Iconițele vin din convențiile de fișiere: app/favicon.ico, app/icon.svg, app/apple-icon.png
};

export const viewport: Viewport = {
  themeColor: "#f97316",
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ro"
      className={`${anton.variable} ${barlow.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <PwaRegister />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
