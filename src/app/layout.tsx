import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { content, text } from "@/lib/content";
import { mediaUrl, safeHttps } from "@/lib/urls";
const serif = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});
const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});
export async function generateMetadata(): Promise<Metadata> {
  const s = (await content("site_settings")).rows[0];
  const base = process.env.NEXT_PUBLIC_SITE_URL;
  const title = text(s, "seo_title", "Pura Pusering Jagat Pejeng");
  const description = text(
    s,
    "seo_description",
    "Mengenal warisan budaya Pura Pusering Jagat Pejeng melalui sejarah, dokumentasi, dan Virtual Tour 360.",
  );
  const icon = mediaUrl(s?.favicon_url);
  return {
    metadataBase: base && safeHttps(base) ? new URL(base) : undefined,
    title: { default: title, template: "%s | Pura Pusering Jagat Pejeng" },
    description,
    openGraph: {
      title,
      description,
      locale: "id_ID",
      type: "website",
      siteName: text(s, "site_name", "Pura Pusering Jagat Pejeng"),
    },
    ...(icon ? { icons: { icon } } : {}),
  };
}
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={serif.variable + " " + sans.variable}>
      <body>
        <a className="skip-link" href="#main">
          Langsung ke konten
        </a>
        {children}
      </body>
    </html>
  );
}
