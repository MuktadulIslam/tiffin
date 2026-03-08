import type { Metadata } from "next";
import Checkout from "@/components/checkout/Checkout";

export const metadata: Metadata = {
  title: "অর্ডার করুন | Checkout",
  description:
    "TifFin থেকে জীববিজ্ঞান বই অর্ডার করুন। সহজ পেমেন্ট — bKash, নগদ ও ক্যাশ অন ডেলিভারি সুবিধা। দ্রুত ডেলিভারি, নিরাপদ লেনদেন।",
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: "/checkout",
  },
};

export default function CheckoutPage() {
  return <Checkout />;
}
