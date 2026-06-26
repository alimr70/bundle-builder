import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { BundleProvider } from "@/features/bundle-builder/context/bundle-context";
import "./globals.css";

const gilroy = localFont({
  src: [
    { path: "./fonts/Gilroy/Gilroy-Regular.ttf", weight: "400", style: "normal" },
    { path: "./fonts/Gilroy/Gilroy-Medium.ttf", weight: "500", style: "normal" },
    { path: "./fonts/Gilroy/Gilroy-Bold.ttf", weight: "600", style: "normal" },
    { path: "./fonts/Gilroy/Gilroy-Bold.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-gilroy",
  display: "swap",
});

const ttNormsPro = localFont({
  src: "./fonts/tt-norms-pro/Variable/TTNormsProVariable.ttf",
  variable: "--font-tt-norms",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Bundle Builder | Wyze Security System",
    template: "%s | Wyze Security System",
  },
  description:
    "Build your personalized Wyze security system with cameras, sensors, and protection.",
  applicationName: "Wyze Bundle Builder",
  keywords: [
    "Wyze",
    "security system",
    "bundle builder",
    "home security",
    "cameras",
    "sensors",
    "smart home",
  ],
  authors: [{ name: "Wyze" }],
  creator: "Wyze",
  openGraph: {
    title: "Bundle Builder | Wyze Security System",
    description:
      "Build your personalized Wyze security system with cameras, sensors, and protection.",
    type: "website",
    locale: "en_US",
    siteName: "Wyze Security System",
  },
  twitter: {
    card: "summary",
    title: "Bundle Builder | Wyze Security System",
    description:
      "Build your personalized Wyze security system with cameras, sensors, and protection.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#edf4ff",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${gilroy.variable} ${ttNormsPro.variable} h-full antialiased`}>
      <body className="min-h-full">
        <BundleProvider>{children}</BundleProvider>
      </body>
    </html>
  );
}
