import type { Metadata } from "next";
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
  title: "Bundle Builder | Wyze Security System",
  description:
    "Build your personalized Wyze security system with cameras, sensors, and protection.",
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
