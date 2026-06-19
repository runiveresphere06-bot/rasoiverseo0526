import type { Metadata } from "next";

export const metadata: Metadata = {
  other: {
    "bitmedia-site-verification": "fb9147ba56a65f5d363c2142c923ac6e",
  },
};

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
