import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  other: {
    "bitmedia-site-verification": "fb9147ba56a65f5d363c2142c923ac6e",
    "google-site-verification": "WiAM92TRtOeSUKAX8s4BUkqbwHKfEFwIMx6zn7vPbsw",
  },
};

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
