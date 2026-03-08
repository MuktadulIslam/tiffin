import type { Metadata } from "next";
import BookDetail from "@/components/book/BookDetail";

interface Props {
  params: Promise<{ id: string }>;
}

async function fetchBook(id: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"}/api/books/${id}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.book ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const book = await fetchBook(id);

  if (!book) {
    return {
      title: "বই পাওয়া যায়নি | TifFin",
      description: "এই বইটি পাওয়া যাচ্ছে না। TifFin-এর সকল জীববিজ্ঞান বই দেখুন।",
    };
  }

  const discount = Math.round((1 - book.price / book.originalPrice) * 100);
  const authors = Array.isArray(book.author) ? book.author.join(", ") : book.author;

  return {
    title: `${book.title} — ${authors}`,
    description: `${book.title} — ${authors} রচিত জীববিজ্ঞান বই। ${book.description?.slice(0, 120) ?? ""} মাত্র ৳${book.price} টাকায় পান (${discount}% ছাড়)। TifFin থেকে অর্ডার করুন।`,
    keywords: [
      book.title,
      ...(book.topics ?? []),
      `${authors} biology book`,
      "জীববিজ্ঞান বই",
      "biology book bangladesh",
      "TifFin",
    ],
    alternates: {
      canonical: `/book/${id}`,
    },
    openGraph: {
      title: `${book.title} | TifFin`,
      description: `${authors} রচিত "${book.title}" — মাত্র ৳${book.price} টাকায় পান। ${discount}% ছাড়!`,
      url: `/book/${id}`,
      type: "website",
      images: book.cover
        ? [
            {
              url: book.cover,
              width: 800,
              height: 600,
              alt: book.title,
            },
          ]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: `${book.title} | TifFin`,
      description: `${authors} রচিত "${book.title}" — মাত্র ৳${book.price} টাকায় পান।`,
      images: book.cover ? [book.cover] : [],
    },
  };
}

export default async function BookPage({ params }: Props) {
  const { id } = await params;
  const book = await fetchBook(id);

  const jsonLd = book
    ? {
        "@context": "https://schema.org",
        "@type": "Book",
        name: book.title,
        author: (Array.isArray(book.author) ? book.author : [book.author]).map(
          (a: string) => ({ "@type": "Person", name: a })
        ),
        description: book.description,
        image: book.cover,
        inLanguage: "bn-BD",
        numberOfPages: book.pages,
        publisher: book.publisher
          ? { "@type": "Organization", name: book.publisher }
          : undefined,
        isbn: book.isbn,
        offers: {
          "@type": "Offer",
          priceCurrency: "BDT",
          price: book.price,
          availability: "https://schema.org/InStock",
          seller: {
            "@type": "Organization",
            name: "TifFin",
          },
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
            {
              "@type": "ListItem",
              position: 3,
              name: book.title,
              item: `https://tiffin.vercel.app/book/${id}`,
            },
          ],
        },
      }
    : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <BookDetail id={id} />
    </>
  );
}
