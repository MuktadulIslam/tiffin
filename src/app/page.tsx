import type { Metadata } from "next";
import Home from "@/components/home/Home";

export const metadata: Metadata = {
  title: "TifFin — জীববিজ্ঞান বই | Biology Books Bangladesh",
  description:
    "TifFin-এ স্বাগতম! বাংলাদেশের সেরা জীববিজ্ঞান বইয়ের অনলাইন স্টোর। HSC, SSC ও মেডিকেল ভর্তি পরীক্ষার জন্য সেরা Biology বই এখন সাশ্রয়ী মূল্যে অর্ডার করুন। দ্রুত ডেলিভারি ও সহজ পেমেন্ট সুবিধা।",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "TifFin — জীববিজ্ঞান বই | Biology Books Bangladesh",
    description:
      "বাংলাদেশের সেরা জীববিজ্ঞান বইয়ের অনলাইন স্টোর। HSC, SSC ও মেডিকেল ভর্তি পরীক্ষার জন্য সেরা বই কম দামে পান।",
    url: "/",
    type: "website",
  },
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "TifFin",
    alternateName: "TifFin জীববিজ্ঞান বই",
    url: "https://tiffin.vercel.app",
    description:
      "বাংলাদেশের সেরা জীববিজ্ঞান বইয়ের অনলাইন স্টোর। HSC, SSC ও মেডিকেল ভর্তি পরীক্ষার জন্য সেরা Biology বই।",
    inLanguage: "bn-BD",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://tiffin.vercel.app/book?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
    publisher: {
      "@type": "Organization",
      name: "TifFin",
      url: "https://tiffin.vercel.app",
      logo: {
        "@type": "ImageObject",
        url: "https://tiffin.vercel.app/logo.png",
      },
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer service",
        availableLanguage: ["Bengali", "English"],
        areaServed: "BD",
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Home />
    </>
  );
}
