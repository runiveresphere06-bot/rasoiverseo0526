import type { Metadata } from "next";

export const metadata: Metadata = {
  other: {
    "bitmedia-site-verification": "cdec7837f4e46599dbc2d6e003ab4b90",
  },
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
