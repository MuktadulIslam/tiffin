import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { QueryProvider } from "@/lib/QueryProvider";

export const metadata: Metadata = {
  title: {
    default: "TifFin — জীববিজ্ঞান বই | Biology Books Bangladesh",
    template: "%s | TifFin",
  },
  description:
    "TifFin — বাংলাদেশের সেরা জীববিজ্ঞান বইয়ের অনলাইন স্টোর। HSC, SSC, বিশ্ববিদ্যালয় ভর্তি পরীক্ষার জন্য সেরা Biology বই কম দামে অর্ডার করুন। দ্রুত ডেলিভারি, সহজ পেমেন্ট।",
  keywords: [
    "জীববিজ্ঞান বই",
    "biology book bangladesh",
    "HSC biology book",
    "SSC biology book",
    "জীববিজ্ঞান",
    "biology books online",
    "বই কিনুন",
    "TifFin",
    "ইবুক",
    "biology textbook",
    "বাংলাদেশ বই",
    "অনলাইন বই কেনা",
    "ভর্তি পরীক্ষা বই",
    "medical admission biology",
  ],
  authors: [{ name: "TifFin" }],
  creator: "TifFin",
  publisher: "TifFin",
  category: "education",
  metadataBase: new URL("https://tiffin.vercel.app"),
  alternates: {
    canonical: "/",
    languages: {
      "bn-BD": "/",
    },
  },
  openGraph: {
    type: "website",
    locale: "bn_BD",
    url: "https://tiffin.vercel.app",
    siteName: "TifFin — জীববিজ্ঞান বই",
    title: "TifFin — জীববিজ্ঞান বই | Biology Books Bangladesh",
    description:
      "বাংলাদেশের সেরা জীববিজ্ঞান বইয়ের অনলাইন স্টোর। HSC, SSC ও মেডিকেল ভর্তি পরীক্ষার জন্য সেরা বই কম দামে পান।",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "TifFin — জীববিজ্ঞান বই",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TifFin — জীববিজ্ঞান বই | Biology Books Bangladesh",
    description:
      "বাংলাদেশের সেরা জীববিজ্ঞান বইয়ের অনলাইন স্টোর। HSC, SSC ও মেডিকেল ভর্তি পরীক্ষার জন্য সেরা বই।",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "google-site-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700;900&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <meta name="geo.region" content="BD" />
        <meta name="geo.placename" content="Bangladesh" />
        <meta name="language" content="Bengali" />
      </head>
      <body style={{ fontFamily: "'Lato',Georgia,sans-serif" }}>
        <QueryProvider>
          <CartProvider>{children}</CartProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
