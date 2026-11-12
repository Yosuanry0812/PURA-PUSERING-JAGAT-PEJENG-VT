import Link from "next/link";
import {
  ArrowUpRight,
  Compass,
  Landmark,
  Flower2,
  ScrollText,
  MapPin,
} from "lucide-react";
import { content, text } from "@/lib/content";
import { Media, Eyebrow, ArrowLink, Empty } from "@/components/public/ui";
import { referenceHome, referenceSource } from "@/lib/reference-content";
import { Gallery } from "@/components/public/gallery";
export const metadata = { alternates: { canonical: "/" } };
export default async function Home() {
  const [home, settings, photos, objects] = await Promise.all([
    content("home_content"),
    content("site_settings"),
    content("gallery_items", { limit: 6, featured: true }),
    content("temple_objects", { limit: 6 }),
  ]);
  const h =
      home.rows[0] ?? (home.state !== "ready" ? referenceHome : undefined),
    s = settings.rows[0];
  const title = text(
    h,
    "hero_title",
    "Menjelajahi Warisan Suci Pura Pusering Jagat Pejeng",
  );
  const split = title.indexOf("Pura");
  const initialPhoto = home.state !== "ready";
  return (
    <>
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
            <figcaption>
              {text(h, "hero_image_alt", "Gerbang Pura Pusering Jagat Pejeng")}{" "}
              <a href="#sumber-foto">Sumber foto</a>
            </figcaption>
          </figure>
        </div>
      </section>
      {h && (
        <>
          <section className="section container intro-grid" id="pengenalan">
            <div className="intro-photo">
              <Media
                path={h?.intro_image_url}
                alt={text(h, "intro_image_alt")}
              />
              <span className="photo-note">PEJENG / BALI</span>
            </div>
            <div>
              <Eyebrow>MENGENAL PURA</Eyebrow>
              <h2>
                {text(h, "intro_title", "Sebuah ruang untuk mengenal warisan.")}
              </h2>
              {h ? (
                <p className="body-large">{text(h, "intro_description")}</p>
              ) : (
                <p className="body-large">
                  Narasi pengenalan akan hadir setelah melalui verifikasi sumber
                  dan persetujuan pengelola pura.
                </p>
              )}
              <p className="location-line">
                <MapPin size={16} />
                {text(
                  s,
                  "location_text",
                  "Desa Pejeng, Tampaksiring, Gianyar, Bali",
                )}
              </p>
              <ArrowLink href="/sejarah">Telusuri kisahnya</ArrowLink>
              {h === referenceHome && (
                <p className="content-attribution">
                  Rujukan narasi:{" "}
                  <a
                    href={referenceSource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {referenceSource.author}
                  </a>
                  .
                </p>
              )}
            </div>
          </section>
          <section className="section section-cream">
            <div className="container">
              <div className="section-heading">
                <div>
                  <Eyebrow>IDENTITAS & NILAI</Eyebrow>
                  <h2>
                    {text(h, "features_title", "Warisan dalam setiap makna")}
                  </h2>
                </div>
                <span className="section-index">01 — MENGENAL LEBIH DEKAT</span>
              </div>
              {h ? (
                <div className="feature-grid">
                  {[
                    ["heritage", ScrollText],
                    ["architecture", Landmark],
                    ["archaeology", Compass],
                    ["spiritual", Flower2],
                  ].map(([key, Icon], i) => {
                    void Icon;
                    return (
                      <article key={String(key)} className="feature-card">
                        <span className="card-number">0{i + 1}</span>
                        <h3>{text(h, String(key) + "_title")}</h3>
                        <p>{text(h, String(key) + "_description")}</p>
                      </article>
                    );
                  })}
                </div>
              ) : (
                <Empty title="Narasi budaya sedang dikurasi" />
              )}
            </div>
          </section>
          <section className="section container">
            <div className="section-heading">
              <div>
                <Eyebrow>TATA RUANG PURA</Eyebrow>
                <h2>{text(h, "mandala_title", "Mengenal Tri Mandala")}</h2>
              </div>
              <span className="section-index">02 — RUANG & KEHARMONISAN</span>
            </div>
            <div className="mandala-grid">
              {["nista", "madya", "utama"].map((k, i) => (
                <article className="mandala-card" key={k}>
                  <span className="mandala-number">0{i + 1}</span>

                  <h3>{k.charAt(0).toUpperCase() + k.slice(1)} Mandala</h3>
                  {h && <p>{text(h, k + "_description")}</p>}
                </article>
              ))}
            </div>
            {objects.rows.length > 0 && (
              <div className="object-grid">
                {objects.rows.map((o) => (
                  <article className="object-card" key={o.id}>
                    <Media path={o.image_url} alt={text(o, "image_alt")} />
                    <div>
                      <span className="eyebrow">
                        {text(o, "mandala")} MANDALA
                      </span>
                      <h3>{text(o, "name")}</h3>
                      <p>{text(o, "description")}</p>
                      {o.function_description && (
                        <p>
                          <strong>Fungsi:</strong>{" "}
                          {text(o, "function_description")}
                        </p>
                      )}
                      {o.cultural_value && (
                        <p>
                          <strong>Nilai budaya:</strong>{" "}
                          {text(o, "cultural_value")}
                        </p>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
          <section className="tour-preview">
            <div className="container tour-preview-grid">
              <div>
                <Eyebrow>PENGALAMAN DIGITAL</Eyebrow>
                <h2>
                  {text(
                    h,
                    "tour_title",
                    "Sudut pandang baru. Makna yang sama.",
                  )}
                </h2>
                <p>
                  {text(
                    h,
                    "tour_description",
                    "Pengalaman Virtual Tour 360 Pura Pusering Jagat Pejeng sedang dipersiapkan.",
                  )}
                </p>
                <Link href="/virtual-tour" className="button button-gold">
                  {text(h, "tour_cta", "Jelajahi Virtual Tour")}
                  <ArrowUpRight size={18} />
                </Link>
              </div>
              <div className="tour-preview-visual">
                <Media
                  path={h?.tour_cover_url}
                  alt="Cover pratinjau Virtual Tour"
                />
                <span className="tour-badge">
                  <Compass size={25} />
                  360°
                </span>
              </div>
            </div>
          </section>
          <section className="section container">
            <div className="section-heading">
              <div>
                <Eyebrow>ARSIP VISUAL</Eyebrow>
                <h2>{text(h, "gallery_title", "Cerita dalam bingkai")}</h2>
              </div>
              <ArrowLink href="/galeri">Lihat seluruh galeri</ArrowLink>
            </div>
            {photos.rows.length ? (
              <Gallery items={photos.rows} />
            ) : (
              <Empty
                title="Setiap dokumentasi memiliki ceritanya"
                body="Galeri pilihan akan hadir setelah dokumentasi terverifikasi dan mendapat izin publikasi."
              />
            )}
          </section>
          <section className="conservation">
            <div className="container">
              <Flower2 size={40} strokeWidth={1} />
              <Eyebrow>UNTUK GENERASI MENDATANG</Eyebrow>
              <h2>
                {text(
                  h,
                  "conservation_title",
                  "Mengenal adalah awal dari menjaga.",
                )}
              </h2>
              <p>
                {text(
                  h,
                  "conservation_description",
                  "Pelestarian budaya dimulai dari kepedulian. Ruang digital ini disiapkan untuk membantu dokumentasi warisan dengan tetap menghormati nilai kesucian pura.",
                )}
              </p>
              <ArrowLink href="/tentang-kami">
                Tentang ruang digital ini
              </ArrowLink>
            </div>
          </section>
        </>
      )}
    </>
  );
}
