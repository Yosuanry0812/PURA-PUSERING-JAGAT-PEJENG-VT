import type { CSSProperties } from "react";
import { Compass, MousePointer2, Move, Maximize } from "lucide-react";
import { content, text } from "@/lib/content";
import Link from "next/link";
import { resolveTourUrl } from "@/lib/tour";
import { TourLaunch } from "@/components/virtual-tour/launch";
import { PageHero, Media } from "@/components/public/ui";
import { Reveal } from "@/components/public/reveal";
import { TourViewer } from "@/components/virtual-tour/viewer";

export const metadata = {
  title: "Virtual Tour 360 Pura Pusering Jagat",
  alternates: { canonical: "/virtual-tour" },
};

const steps = [
  {
    Icon: Move,
    title: "Geser untuk melihat",
    description: "Jelajahi pandangan ke berbagai arah.",
  },
  {
    Icon: MousePointer2,
    title: "Ikuti penanda",
    description: "Pilih titik navigasi yang tersedia dalam tur.",
  },
  {
    Icon: Maximize,
    title: "Nikmati layar penuh",
    description: "Gunakan layar penuh jika didukung perangkat.",
  },
];
const glimpse = [
  { path: "reference/split-gateway.webp", alt: "Gerbang terbelah pura" },
  { path: "reference/temple.webp", alt: "Halaman pura dengan pelinggih" },
  { path: "reference/shrine-umbrellas.webp", alt: "Pelinggih berpayung" },
];
// Tur 360° dipublikasikan di GitHub Pages; dipakai sebagai bawaan agar tombol langsung aktif.
const DEFAULT_TOUR_URL = "https://yosuanry0812.github.io/pura-pusering-jagat-360/";
const DEFAULT_TOUR_HOST = "yosuanry0812.github.io";
const delay = (i: number) => ({ "--d": i * 100 + "ms" }) as CSSProperties;

export default async function Tour() {
  const tour = await content("virtual_tour_settings");
  const t = tour.rows[0];
  const url = resolveTourUrl(
    t,
    process.env.VIRTUAL_TOUR_URL || DEFAULT_TOUR_URL,
    [process.env.TOUR_ALLOWED_HOSTS, DEFAULT_TOUR_HOST]
      .filter(Boolean)
      .join(","),
  );
  return (
    <>
      <PageHero
        label="PENGALAMAN VIRTUAL 360°"
        title={text(t, "title", "Virtual Tour Pura Pusering Jagat")}
        description={text(
          t,
          "description",
          "Kenali ruang dan warisan Pura Pusering Jagat Pejeng melalui pengalaman Virtual Tour 360.",
        )}
      />
      <Reveal className="container section tour-page">
        <div className="tv-stage" data-reveal="zoom">
          <Media
            path={t?.cover_image_url || "reference/main-gate.webp"}
            alt={text(t, "cover_image_alt")}
            priority
          />
          <div className="tv-panel">
            <span className="tv-compass" aria-hidden="true">
              <Compass size={34} strokeWidth={1.2} />
            </span>
            <span className={"tv-chip" + (url ? " is-live" : "")}>
              <i aria-hidden="true" />
              {url ? "JELAJAH 360°" : "SEGERA HADIR"}
            </span>
            <h2>
              {url
                ? "Mulai perjalanan Anda di Pura Pusering Jagat."
                : "Perjalanan virtual sedang dipersiapkan."}
            </h2>
            <p>
              {url
                ? "Jelajahi area pura melalui pengalaman 360°. Buka tur di tab baru atau gunakan penampil di halaman ini."
                : "Kenali suasana dan tata ruang pura melalui pengalaman 360°. Tur akan dapat dibuka dari halaman ini setelah tersedia."}
            </p>
            <div className="button-row tour-actions">
              <TourLaunch url={url || undefined} />
              <Link href="/sejarah" className="text-link">
                Jelajahi sejarah ↗
              </Link>
            </div>
          </div>
        </div>

        {url && (
          <div className="tour-embed" data-reveal="up">
            <TourViewer
              url={url}
              title={text(
                t,
                "title",
                "Virtual Tour Pura Pusering Jagat Pejeng",
              )}
            />
          </div>
        )}

        <section className="tv-block" aria-labelledby="tv-cara">
          <div className="tv-head" data-reveal="up">
            <h2 id="tv-cara">Cara menjelajah</h2>
            <p>Tiga langkah sederhana untuk menikmati tur 360°.</p>
          </div>
          <ol className="tv-steps">
            {steps.map(({ Icon, title, description }, i) => (
              <li key={title} data-reveal="up" style={delay(i)}>
                <span className="tv-step-no">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="tv-step-icon">
                  <Icon size={22} strokeWidth={1.4} aria-hidden="true" />
                </span>
                <h3>{title}</h3>
                <p>{description}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="tv-block" aria-labelledby="tv-suasana">
          <div className="tv-head" data-reveal="up">
            <h2 id="tv-suasana">Sekilas suasana pura</h2>
            <p>Gambaran area yang akan Anda temui sebelum menjelajah.</p>
          </div>
          <div className="tv-glimpse">
            {glimpse.map((g, i) => (
              <div key={g.path} data-reveal="up" style={delay(i)}>
                <Media path={g.path} alt={g.alt} />
              </div>
            ))}
          </div>
        </section>

        <div className="tv-end" data-reveal="up">
          <p className="respect-note">
            Hormati kesucian pura. Dokumentasi digital hanya menampilkan area
            yang mendapat izin.
          </p>
          <div className="tv-end-links">
            <Link href="/sejarah" className="text-link">
              Baca sejarah pura ↗
            </Link>
            <Link href="/galeri" className="text-link">
              Lihat galeri ↗
            </Link>
          </div>
        </div>
      </Reveal>
    </>
  );
}
