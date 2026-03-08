import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { QueryProvider } from "@/lib/QueryProvider";

export const metadata: Metadata = {
  title: "TifFin — Biology Books",
  description: "Premium biology textbooks delivered to your door",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ fontFamily: "'Lato',Georgia,sans-serif" }}>
        <QueryProvider>
          <CartProvider>{children}</CartProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
