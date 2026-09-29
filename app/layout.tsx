import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import LocaleProvider from "@/components/LocaleProvider";
import LanguageToggle from "@/components/LanguageToggle";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BRAND } from "@/lib/data";
import { AuthProvider } from "@/lib/auth";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  formatDetection: { telephone: false, date: false, email: false, address: false },
  title: `${BRAND.name} — Collaborative Project Management`,
  description: BRAND.tagline,
  openGraph: {
    title: `${BRAND.name} — Collaborative Project Management`,
    description: BRAND.tagline,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${plusJakarta.className} bg-[var(--background)] text-[var(--foreground)] antialiased`}
      >
        <LocaleProvider>
          <AuthProvider>
            <Navbar />
            <LanguageToggle />
            {children}
            <Footer />
          </AuthProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
