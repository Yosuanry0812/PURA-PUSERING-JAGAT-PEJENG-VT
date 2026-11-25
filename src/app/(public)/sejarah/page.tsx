import type { CSSProperties } from "react";
import { CalendarDays, Flower2, Hand, Shirt, VolumeX } from "lucide-react";
import { content, text } from "@/lib/content";
import { PageHero, Media, Prose } from "@/components/public/ui";
import { Reveal } from "@/components/public/reveal";
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
// Jeda animasi bertahap (ms) antar elemen sejenis.
const delay = (i: number) => ({ "--d": i * 90 + "ms" }) as CSSProperties;

export default async function History() {
  const data = await content("history_sections", { limit: 200 });
  const notes = data.rows;
  const toc = notes.length
    ? [
        ...historySections,
        { id: "catatan-tambahan", label: "Catatan tambahan" },
      ]
    : historySections;

  return (
    <>
      <PageHero {...historyHero} />
      <Reveal className="container section history-page">
        <div className="history-cover" data-reveal="zoom">
          <Media
            path={historyCover.path}
            alt={historyCover.alt}
            priority
            className="history-cover-media"
          />
        </div>

        <nav
          className="history-toc"
          aria-label="Bagian sejarah"
          data-reveal="up"
        >
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
            <div data-reveal="up">
              <h2 id="titik-tengah-h">{historyIntro.title}</h2>
            </div>
            <p
              className="body-large hx-quote"
              data-reveal="up"
              style={delay(1)}
            >
              {historyIntro.lead}
            </p>
            {historyIntro.paragraphs.map((p, i) => (
              <p
                className="hx-text"
                key={p.slice(0, 24)}
                data-reveal="up"
                style={delay(i + 2)}
              >
                {p}
              </p>
            ))}
          </div>
          <aside className="hx-intro-side" aria-label="Fakta singkat">
            <div className="hx-byline" data-reveal="right">
              <span>{historyIntro.bylineLabel}</span>
              <strong>{historyIntro.byline}</strong>
            </div>
            <dl className="hx-facts">
              {historyFacts.map((f, i) => (
                <div key={f.label} data-reveal="up" style={delay(i + 1)}>
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
          <div className="hx-head" data-reveal="up">
            <h2 id="tiga-pusaka-h">{historyRelicsIntro.title}</h2>
            <p className="body-large hx-lead">{historyRelicsIntro.body}</p>
          </div>
          <div className="hx-relics">
            {historyRelics.map((r, i) => (
              <article className="hx-relic" key={r.slug} data-reveal="up">
                <Media path={r.image} alt={r.alt} />
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
          <div className="hx-ancient">
            <div className="hx-ancient-text" data-reveal="up">
              <h2 id="jejak-bali-kuno-h">{historyAncient.title}</h2>
              <p className="body-large">{historyAncient.body}</p>
            </div>
            <Media
              path={historyAncient.image}
              alt={historyAncient.alt}
              className="hx-ancient-photo"
            />
          </div>
          <ol className="hx-timeline">
            {historyTimeline.map((t, i) => (
              <li key={t.era} data-reveal="up" style={delay(i)}>
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
          <div className="hx-head" data-reveal="up">
            <h2 id="tri-mandala-h">{historyMandala.title}</h2>
            <p className="body-large hx-lead">{historyMandala.body}</p>
          </div>
          <ol className="hx-mandala">
            {historyMandala.levels.map((l, i) => (
              <li key={l.name} data-reveal="up" style={delay(i)}>
                <span className="hx-number">{num(i)}</span>
                <h3>{l.name}</h3>
                <p className="hx-subtitle">{l.place}</p>
                <p className="hx-text">{l.body}</p>
              </li>
            ))}
          </ol>
          <div className="hx-gates">
            {historyMandala.photos.map((p, i) => (
              <div key={p.image} data-reveal="up" style={delay(i)}>
                <Media path={p.image} alt={p.alt} />
              </div>
            ))}
          </div>
          <p className="hx-text hx-closing" data-reveal="up">
            {historyMandala.closing}
          </p>
        </section>

        <section
          id="berkunjung"
          className="hx-block hx-visit"
          aria-labelledby="berkunjung-h"
        >
          <div className="hx-visit-photo" data-reveal="left">
            <Media path={historyVisit.image} alt={historyVisit.alt} />
          </div>
          <div>
            <div className="hx-head" data-reveal="up">
              <h2 id="berkunjung-h">{historyVisit.title}</h2>
              <p className="body-large hx-lead">{historyVisit.body}</p>
            </div>
            <ul className="hx-etiquette">
              {historyVisit.items.map((it, i) => {
                const Icon = icons[it.icon];
                return (
                  <li key={it.title} data-reveal="up" style={delay(i % 3)}>
                    <Icon size={20} strokeWidth={1.5} aria-hidden="true" />
                    <div>
                      <h3>{it.title}</h3>
                      <p>{it.body}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
            <p className="hx-callout" data-reveal="up">
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
            <div className="hx-head" data-reveal="up">
              <h2 id="catatan-tambahan-h">Catatan tambahan</h2>
            </div>
            {notes.map((r, i) => (
              <article
                id={text(r, "slug")}
                className={"history-section " + (i % 2 ? "reverse" : "")}
                key={r.id}
                data-reveal="up"
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
      </Reveal>
    </>
  );
}
