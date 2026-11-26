import type { CSSProperties } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { referenceAbout, referenceSource } from "@/lib/reference-content";
import { content, text } from "@/lib/content";
import {
  aboutHero,
  aboutLogos,
  aboutPlace,
  aboutStory,
  aboutTeam,
  aboutThanks,
} from "@/lib/about-content";
import { PageHero, Media, Prose, Empty, Eyebrow } from "@/components/public/ui";
import { Reveal } from "@/components/public/reveal";
import "./tentang.css";

export const metadata = {
  title: "Tentang Kami",
  description:
    "Tentang situs dokumentasi Pura Pusering Jagat Pejeng: latar belakang, tim penyusun, dan ucapan terima kasih.",
  alternates: { canonical: "/tentang-kami" },
};

const delay = (i: number) => ({ "--d": i * 90 + "ms" }) as CSSProperties;

export default async function About() {
  const [about, contributors] = await Promise.all([
    content("about_content"),
    content("contributors"),
  ]);
  const a =
    about.rows[0] ?? (about.state !== "ready" ? referenceAbout : undefined);
  const team =
    contributors.rows.length > 0
      ? contributors.rows.map((c) => ({
          key: String(c.id),
          name: text(c, "name"),
          role: text(c, "role"),
        }))
      : aboutTeam.members.map((m) => ({ key: m.name, ...m }));

  return (
    <>
      <PageHero
        label={aboutHero.label}
        title={aboutHero.title}
        description={aboutHero.description}
      />
      <Reveal className="container section about-page">
        <section className="ab-story" aria-label="Latar belakang">
          <div className="ab-photo" data-reveal="zoom">
            <Media
              path={a?.image_url ?? aboutStory.photoPath}
              alt={a ? text(a, "image_alt") : aboutStory.photoAlt}
              priority
            />
          </div>
          <div className="ab-text" data-reveal="up" style={delay(1)}>
            <Eyebrow>{aboutStory.eyebrow}</Eyebrow>
            <h2>{aboutStory.title}</h2>
            {a ? (
              <>
                <Prose value={text(a, "background")} />
                <Prose value={text(a, "purpose")} />
                <Prose value={text(a, "benefits")} />
                {a === referenceAbout && (
                  <a
                    className="source-link"
                    href={referenceSource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Rujukan narasi · {referenceSource.author}
                    <ArrowUpRight size={15} aria-hidden="true" />
                  </a>
                )}
              </>
            ) : (
              <Empty title="Informasi pengembangan sedang dipersiapkan" />
            )}
          </div>
        </section>

        <section className="ab-credits" aria-labelledby="ab-place-h">
          <header data-reveal="up">
            <h2 id="ab-place-h">{aboutPlace.name}</h2>
            <p>{aboutPlace.address}</p>
          </header>

          <div className="ab-panel" data-reveal="up" style={delay(1)}>
            <div className="ab-group">
              <h3>{aboutTeam.title}</h3>
              {team.length > 0 ? (
                <>
                  <ul className="ab-names">
                    {team.map((m) => (
                      <li key={m.key}>
                        <strong>{m.name}</strong>
                        {m.role && <span>{m.role}</span>}
                      </li>
                    ))}
                  </ul>
                  <div className="ab-logo">
                    <Image
                      src={aboutTeam.logo.src}
                      alt={aboutTeam.logo.alt}
                      width={aboutTeam.logo.width}
                      height={aboutTeam.logo.height}
                      sizes="220px"
                    />
                  </div>
                </>
              ) : (
                <p className="ab-empty">{aboutTeam.empty}</p>
              )}
            </div>
            <div className="ab-group">
              <h3>{aboutThanks.title}</h3>
              <ul className="ab-names">
                {aboutThanks.people.map((p) => (
                  <li key={p.name}>
                    <span>{p.role}</span>
                    <strong>{p.name}</strong>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {aboutLogos.length > 0 && (
            <div className="ab-logos" data-reveal="up" style={delay(2)}>
              {aboutLogos.map((l) => (
                <Media key={l.path} path={l.path} alt={l.alt} />
              ))}
            </div>
          )}
        </section>
      </Reveal>
    </>
  );
}
