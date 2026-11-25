import Link from "next/link";
import { ArrowUpRight, Compass } from "lucide-react";
import { content, text } from "@/lib/content";
import { Media } from "@/components/public/ui";
import { referenceHome } from "@/lib/reference-content";

export const metadata = { alternates: { canonical: "/" } };

export default async function Home() {
  const home = await content("home_content");
  const h =
    home.rows[0] ?? (home.state !== "ready" ? referenceHome : undefined);
  const title = text(
    h,
    "hero_title",
    "Menjelajahi Warisan Suci Pura Pusering Jagat Pejeng",
  );
  const split = title.indexOf("Pura");
  const initialPhoto = home.state !== "ready";
  return (
    <section className="home-hero">
      <div className="container hero-grid">
        <div className="hero-copy">
          <h1>
            {split >= 0 ? (
              <>
                {title.slice(0, split)}
                <span className="title-gold">{title.slice(split)}</span>
              </>
            ) : (
              title
            )}
          </h1>
          <p>
            {text(
              h,
              "hero_subtitle",
              "Kenali sejarah, keunikan arsitektur, dan nilai budaya Pura Pusering Jagat Pejeng melalui pengalaman digital yang informatif dan interaktif.",
            )}
          </p>
          <div className="button-row">
            <Link className="button button-gold" href="/sejarah">
              {text(h, "history_cta", "Jelajahi Sejarah")}
              <ArrowUpRight size={17} />
            </Link>
            <Link className="button button-outline" href="/virtual-tour">
              {text(h, "hero_cta", "Jelajahi Virtual Tour")}
              <Compass size={17} />
            </Link>
          </div>
        </div>
        <figure className="hero-art">
          <Media
            path={
              h?.hero_image_url ||
              (initialPhoto ? "reference/main-gate.webp" : "")
            }
            alt={text(
              h,
              "hero_image_alt",
              "Gerbang utama Pura Pusering Jagat Pejeng",
            )}
            priority
          />
        </figure>
      </div>
    </section>
  );
}
