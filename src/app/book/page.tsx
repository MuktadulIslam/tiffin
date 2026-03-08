import type { Metadata } from "next";
import BooksList from "@/components/book/BooksList";

export const metadata: Metadata = {
  title: "সকল জীববিজ্ঞান বই | All Biology Books",
  description:
    "TifFin-এর সম্পূর্ণ জীববিজ্ঞান বইয়ের তালিকা দেখুন। HSC জীববিজ্ঞান, SSC জীববিজ্ঞান, মেডিকেল ভর্তি পরীক্ষার Biology বই — সেরা মানের বই সাশ্রয়ী মূল্যে পান। দ্রুত ডেলিভারি, bKash ও নগদে পেমেন্ট সুবিধা।",
  keywords: [
    "জীববিজ্ঞান বই তালিকা",
    "HSC biology book list",
    "SSC biology book",
    "biology book price bd",
    "মেডিকেল ভর্তি বই",
    "জীববিজ্ঞান বই কিনুন",
    "biology textbook online",
  ],
  alternates: {
    canonical: "/book",
  },
  openGraph: {
    title: "সকল জীববিজ্ঞান বই | TifFin",
    description:
      "HSC, SSC ও মেডিকেল ভর্তি পরীক্ষার জন্য সেরা জীববিজ্ঞান বইয়ের সংগ্রহ। এখনই অর্ডার করুন।",
    url: "/book",
    type: "website",
  },
};

export default function BooksPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "সকল জীববিজ্ঞান বই",
    description:
      "TifFin-এর সম্পূর্ণ জীববিজ্ঞান বইয়ের সংগ্রহ। HSC, SSC ও মেডিকেল ভর্তি পরীক্ষার জন্য সেরা Biology বই।",
    url: "https://tiffin.vercel.app/book",
    inLanguage: "bn-BD",
    isPartOf: {
      "@type": "WebSite",
      name: "TifFin",
      url: "https://tiffin.vercel.app",
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "হোম",
          item: "https://tiffin.vercel.app",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "সকল বই",
          item: "https://tiffin.vercel.app/book",
        },
      ],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BooksList />
    </>
  );
}
