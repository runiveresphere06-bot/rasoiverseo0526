import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import { Providers } from "@/components/providers/Providers";
import { BRAND } from "@/lib/constants";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: BRAND.metaTitle,
  description: BRAND.metaDescription,
  metadataBase: new URL(BRAND.url),
  openGraph: {
    title: BRAND.metaTitle,
    description: BRAND.metaDescription,
    url: BRAND.url,
    siteName: BRAND.name,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable} h-full`}>
      <body className="min-h-full bg-background font-sans text-text antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
