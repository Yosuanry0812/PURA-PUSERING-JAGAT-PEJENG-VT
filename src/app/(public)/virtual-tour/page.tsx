import { Compass, MousePointer2, Move, Maximize } from "lucide-react";
import { content, text } from "@/lib/content";
import Link from "next/link";
import { resolveTourUrl } from "@/lib/tour";
import { TourLaunch } from "@/components/virtual-tour/launch";
import { PageHero, Media } from "@/components/public/ui";
import { TourViewer } from "@/components/virtual-tour/viewer";
export const metadata = {
  title: "Virtual Tour 360 Pura Pusering Jagat",
  alternates: { canonical: "/virtual-tour" },
};
export default async function Tour() {
  const tour = await content("virtual_tour_settings");
  const t = tour.rows[0];
  const url = resolveTourUrl(
    t,
    process.env.VIRTUAL_TOUR_URL ?? "",
    process.env.TOUR_ALLOWED_HOSTS ?? "",
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
      <section className="container section">
        <div className="tour-pending">
          <Media
            path={t?.cover_image_url || "reference/main-gate.webp"}
            alt={text(t, "cover_image_alt")}
          />
          <div>
            <span className="round-icon">
              <Compass size={38} strokeWidth={1} />
            </span>
            <span className="eyebrow">
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
          <div className="tour-embed">
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
        <div className="tour-guide">
          {[
            [
              Move,
              "Geser untuk melihat",
              "Jelajahi pandangan ke berbagai arah.",
            ],
            [
              MousePointer2,
              "Ikuti penanda",
              "Pilih titik navigasi yang tersedia dalam tur.",
            ],
            [
              Maximize,
              "Nikmati layar penuh",
              "Gunakan layar penuh jika didukung perangkat.",
            ],
          ].map(([Icon, title, description]) => {
            const I = Icon as typeof Move;
            return (
              <article key={String(title)}>
                <I size={24} strokeWidth={1} />
                <h3>{String(title)}</h3>
                <p>{String(description)}</p>
              </article>
            );
          })}
        </div>
        <p className="respect-note">
          Hormati kesucian pura. Dokumentasi digital hanya menampilkan area yang
          mendapat izin.
        </p>
      </section>
    </>
  );
}
