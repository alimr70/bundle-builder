import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { BundleProvider } from "@/features/bundle-builder/context/bundle-context";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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
    <html lang="en" className={`${manrope.variable} h-full antialiased`}>
      <body className="min-h-full">
        <BundleProvider>{children}</BundleProvider>
      </body>
    </html>
  );
}
