import { links } from "@/lib/navigation";
import Link from "next/link";
import Image from "next/image";
import { MapPin, ArrowUpRight, Mail, Phone } from "lucide-react";
import { Header } from "@/components/public/header";
import { Brand } from "@/components/public/brand";
import { content, text } from "@/lib/content";
import { mediaUrl, safeHttps } from "@/lib/urls";
import "../public-theme.css";
export const revalidate = 60;
export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await content("site_settings");
  const s = settings.rows[0];
  const background = mediaUrl(
    s?.background_image_url ??
      (settings.state !== "ready" ? "reference/split-gateway.webp" : ""),
  );
  const name = text(s, "site_name", "Pura Pusering Jagat");
  return (
    <div className="public-site">
      <div className="site-backdrop" aria-hidden="true">
        {background && (
          <Image
            src={background}
            alt=""
            fill
            priority
            sizes="100vw"
            unoptimized={!background.startsWith("/gambar/")}
          />
        )}
      </div>
      <Header name={name} />
      <main id="main">{children}</main>
      <footer className="site-footer">
        <div className="container footer-grid">
          <div>
            <Brand name={name} />
            <p>
              {text(
                s,
                "footer_description",
                "Ruang digital untuk mengenal dan menjaga warisan budaya Pura Pusering Jagat Pejeng.",
              )}
            </p>
            {mediaUrl(s?.logo_url) && (
              <Image
                src={mediaUrl(s?.logo_url)}
                alt="Logo resmi pura"
                width={72}
                height={72}
                unoptimized
              />
            )}
          </div>
          <div>
            <h2>Jelajahi</h2>
            {links.map(([url, label]) => (
              <Link key={url} href={url}>
                {label}
                <ArrowUpRight size={13} />
              </Link>
            ))}
          </div>
          <div>
            <h2>Temukan kami</h2>
            <p className="contact-line">
              <MapPin size={17} />
              {text(
                s,
                "location_text",
                "Desa Pejeng, Tampaksiring, Gianyar, Bali",
              )}
            </p>
            {s?.contact_email && (
              <a href={"mailto:" + text(s, "contact_email")}>
                <Mail size={16} />
                {text(s, "contact_email")}
              </a>
            )}
            {s?.contact_phone && (
              <a
                href={"tel:" + text(s, "contact_phone").replace(/[^+0-9]/g, "")}
              >
                <Phone size={16} />
                {text(s, "contact_phone")}
              </a>
            )}
            {["instagram_url", "facebook_url"].map(
              (k) =>
                safeHttps(text(s, k)) && (
                  <a
                    key={k}
                    href={text(s, k)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {k === "instagram_url" ? "Instagram" : "Facebook"}
                    <ArrowUpRight size={14} />
                  </a>
                ),
            )}
          </div>
        </div>
        <div className="container footer-bottom">
          <span>
            © {new Date().getFullYear()} {name}.
          </span>
          <span>Pejeng · Gianyar · Bali</span>
        </div>
      </footer>
    </div>
  );
}
