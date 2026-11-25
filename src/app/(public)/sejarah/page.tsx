import { CalendarDays, Flower2, Hand, Shirt, VolumeX } from "lucide-react";
import { content, text } from "@/lib/content";
import { PageHero, Media, Eyebrow, Prose } from "@/components/public/ui";
import { referenceSource } from "@/lib/reference-content";
import {
  historyAncient,
  historyCover,
  historyFacts,
  historyHero,
  historyIntro,
  historyMandala,
  historyRelics,
  historyRelicsIntro,
  historySections,
  historySources,
  historyTimeline,
  historyVisit,
} from "@/lib/history-content";
import { safeHttps } from "@/lib/urls";

export const metadata = {
  title: "Sejarah Pura Pusering Jagat",
  description:
    "Sejarah Pura Pusering Jagat Pejeng: makna pusat dunia, tiga pusaka di Utama Mandala, jejak Bali Kuno, Tri Mandala, dan etika berkunjung.",
  alternates: { canonical: "/sejarah" },
};

const icons = {
  shirt: Shirt,
  flower: Flower2,
  hand: Hand,
  quiet: VolumeX,
  calendar: CalendarDays,
};
const num = (i: number) => String(i + 1).padStart(2, "0");

export default async function History() {
  const data = await content("history_sections", { limit: 200 });
  const notes = data.rows;
  const toc = notes.length
    ? [
        ...historySections.slice(0, -1),
        { id: "catatan-tambahan", label: "Catatan tambahan" },
        historySections[historySections.length - 1],
      ]
    : historySections;

  return (
    <>
      <PageHero {...historyHero} />
      <div className="container section history-page">
        <figure className="history-cover">
          <Media
            path={historyCover.path}
            alt={historyCover.alt}
            priority
            className="history-cover-media"
          />
          <figcaption>{historyCover.caption}</figcaption>
        </figure>

        <nav className="history-toc" aria-label="Bagian sejarah">
          {toc.map((s, i) => (
            <a href={"#" + s.id} key={s.id}>
              <span>{num(i)}</span>
              {s.label}
            </a>
          ))}
        </nav>

        <section
          id="titik-tengah"
          className="hx-block hx-intro"
          aria-labelledby="titik-tengah-h"
        >
          <div className="hx-intro-text">
            <Eyebrow>BAGIAN 01</Eyebrow>
            <h2 id="titik-tengah-h">{historyIntro.title}</h2>
            <p className="body-large">{historyIntro.lead}</p>
            {historyIntro.paragraphs.map((p) => (
              <p className="hx-text" key={p.slice(0, 24)}>
                {p}
              </p>
            ))}
          </div>
          <aside className="hx-intro-side" aria-label="Fakta singkat">
            <div className="hx-byline">
              <span>{historyIntro.bylineLabel}</span>
              <strong>{historyIntro.byline}</strong>
              <small>{historyIntro.editor}</small>
            </div>
            <dl className="hx-facts">
              {historyFacts.map((f) => (
                <div key={f.label}>
                  <dt>{f.label}</dt>
                  <dd>{f.value}</dd>
                  <dd className="hx-fact-note">{f.note}</dd>
                </div>
              ))}
            </dl>
          </aside>
        </section>

        <section
          id="tiga-pusaka"
          className="hx-block"
          aria-labelledby="tiga-pusaka-h"
        >
          <Eyebrow>BAGIAN 02</Eyebrow>
          <h2 id="tiga-pusaka-h">{historyRelicsIntro.title}</h2>
          <p className="body-large hx-lead">{historyRelicsIntro.body}</p>
          <div className="hx-relics">
            {historyRelics.map((r, i) => (
              <article className="hx-relic" key={r.slug}>
                <figure>
                  <Media path={r.image} alt={r.alt} />
                  <figcaption>{r.caption}</figcaption>
                </figure>
                <div>
                  <span className="hx-number">{num(i)}</span>
                  <h3>{r.title}</h3>
                  <p className="hx-subtitle">{r.subtitle}</p>
                  <p className="hx-text">{r.body}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section
          id="jejak-bali-kuno"
          className="hx-block"
          aria-labelledby="jejak-bali-kuno-h"
        >
          <Eyebrow>BAGIAN 03</Eyebrow>
          <h2 id="jejak-bali-kuno-h">{historyAncient.title}</h2>
          <div className="hx-ancient">
            <figure>
              <Media path={historyAncient.image} alt={historyAncient.alt} />
              <figcaption>{historyAncient.caption}</figcaption>
            </figure>
            <p className="body-large">{historyAncient.body}</p>
          </div>
          <ol className="hx-timeline">
            {historyTimeline.map((t) => (
              <li key={t.era}>
                <span className="hx-era">{t.era}</span>
                <h3>{t.title}</h3>
                <p className="hx-text">{t.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section
          id="tri-mandala"
          className="hx-block"
          aria-labelledby="tri-mandala-h"
        >
          <Eyebrow>BAGIAN 04</Eyebrow>
          <h2 id="tri-mandala-h">{historyMandala.title}</h2>
          <p className="body-large hx-lead">{historyMandala.body}</p>
          <ol className="hx-mandala">
            {historyMandala.levels.map((l, i) => (
              <li key={l.name}>
                <span className="hx-number">{num(i)}</span>
                <h3>{l.name}</h3>
                <p className="hx-subtitle">{l.place}</p>
                <p className="hx-text">{l.body}</p>
              </li>
            ))}
          </ol>
          <div className="hx-gates">
            {historyMandala.photos.map((p) => (
              <figure key={p.image}>
                <Media path={p.image} alt={p.alt} />
                <figcaption>{p.caption}</figcaption>
              </figure>
            ))}
          </div>
          <p className="hx-text hx-closing">{historyMandala.closing}</p>
        </section>

        <section
          id="berkunjung"
          className="hx-block hx-visit"
          aria-labelledby="berkunjung-h"
        >
          <figure className="hx-visit-photo">
            <Media path={historyVisit.image} alt={historyVisit.alt} />
          </figure>
          <div>
            <Eyebrow>BAGIAN 05</Eyebrow>
            <h2 id="berkunjung-h">{historyVisit.title}</h2>
            <p className="body-large hx-lead">{historyVisit.body}</p>
            <ul className="hx-etiquette">
              {historyVisit.items.map((it) => {
                const Icon = icons[it.icon];
                return (
                  <li key={it.title}>
                    <Icon size={20} strokeWidth={1.5} aria-hidden="true" />
                    <div>
                      <h3>{it.title}</h3>
                      <p>{it.body}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
            <p className="hx-callout">
              <strong>{historyVisit.closingTitle}</strong>{" "}
              {historyVisit.closing}
            </p>
          </div>
        </section>

        {notes.length > 0 && (
          <section
            id="catatan-tambahan"
            className="hx-block"
            aria-labelledby="catatan-tambahan-h"
          >
            <Eyebrow>CATATAN TAMBAHAN</Eyebrow>
            <h2 id="catatan-tambahan-h">Catatan tambahan</h2>
            {notes.map((r, i) => (
              <article
                id={text(r, "slug")}
                className={"history-section " + (i % 2 ? "reverse" : "")}
                key={r.id}
              >
                {r.image_url && (
                  <Media path={r.image_url} alt={text(r, "image_alt")} />
                )}
                <div>
                  <h3>{text(r, "title")}</h3>
                  {r.summary && (
                    <p className="body-large">{text(r, "summary")}</p>
                  )}
                  <Prose value={text(r, "content")} />
                  {safeHttps(text(r, "source_url")) && (
                    <a
                      className="source-link"
                      href={text(r, "source_url")}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Baca sumber rujukan ↗
                    </a>
                  )}
                </div>
              </article>
            ))}
          </section>
        )}

        <section
          id="sumber"
          className="hx-block hx-sources"
          aria-labelledby="sumber-h"
        >
          <Eyebrow>SUMBER</Eyebrow>
          <h2 id="sumber-h">{historySources.title}</h2>
          <p className="hx-text">{historySources.body}</p>
          <ul className="hx-references">
            {historySources.references.map((r) => (
              <li key={r.url}>
                <a href={r.url} target="_blank" rel="noopener noreferrer">
                  {r.label} ↗
                </a>
              </li>
            ))}
          </ul>
          <p className="hx-source-links">
            <a
              className="source-link"
              href={referenceSource.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Baca artikel rujukan lengkap ↗
            </a>
            <a className="source-link" href="#sumber-foto">
              Sumber foto
            </a>
          </p>
        </section>
      </div>
    </>
  );
}
