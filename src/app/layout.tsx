import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/next"


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CGPA Calculator Online",
  description:
    "Calculate your CGPA and GPA instantly with our free online calculator. Perfect for university students, supports all grading systems, grade point average calculator with semester tracking, academic progress monitoring.",
  keywords:
    "CGPA calculator, GPA calculator, grade point average calculator, university calculator, college calculator, academic calculator, student calculator, semester GPA calculator, cumulative GPA, grade calculator online, free CGPA calculator, university grade calculator, academic grade tracker, student grade tracker, GPA tracker, CGPA tracker, online grade calculator, university GPA calculator, college GPA calculator, academic performance calculator, grade point calculator, student academic calculator, free online calculator, education calculator, academic tool, student tool, university tool, grade management, academic progress tracker, semester calculator, course grade calculator, credit hour calculator, weighted GPA calculator, unweighted GPA calculator, transcript calculator, academic record calculator, graduation calculator, degree calculator",
  authors: [{ name: "Sohan - CGPA Calculator Developer" }],
  creator: "Sohan",
  publisher: "CGPA Calculator",
  robots: "index, follow",
  openGraph: {
    title: "Free CGPA Calculator Online - Calculate Your GPA Instantly",
    description:
      "Free online CGPA and GPA calculator for university students. Track your academic progress with our easy-to-use grade point average calculator.",
    type: "website",
    url: "https://cgpa-calculator7.vercel.app",
    siteName: "CGPA Calculator",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free CGPA Calculator Online - GPA Calculator for Students",
    description:
      "Calculate your CGPA and GPA instantly with our free online calculator. Perfect for university students worldwide.",
    creator: "@sohan99",
  },
  alternates: {
    canonical: "https://cgpa-calculator7.vercel.app",
  },
  category: "Education",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "CGPA Calculator",
    description:
      "Free online CGPA and GPA calculator for university students. Calculate your cumulative grade point average with our easy-to-use academic tool.",
    url: "https://cgpa-calculator7.vercel.app",
    applicationCategory: "EducationalApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    creator: {
      "@type": "Person",
      name: "Sohan",
      url: "https://github.com/sohan-99",
    },
    keywords:
      "CGPA calculator, GPA calculator, grade point average, university calculator, academic calculator, student tool",
    audience: {
      "@type": "Audience",
      audienceType: "Students",
    },
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
