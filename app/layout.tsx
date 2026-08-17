import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: { default: "Attri Associates & Vastu Consultants", template: "%s | Attri Associates" },
  description: "Scientific Vastu, architecture, structural and interior design solutions for clients worldwide.",
  openGraph: { type: "website", locale: "en_IN", siteName: "Attri Associates & Vastu Consultants" },
  robots: { index: true, follow: true }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
