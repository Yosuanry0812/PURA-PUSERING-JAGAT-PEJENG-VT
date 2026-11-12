import { referenceAbout, referenceSource } from "@/lib/reference-content";
import { content, text } from "@/lib/content";
import { PageHero, Media, Eyebrow, Prose, Empty } from "@/components/public/ui";
export const metadata = {
  title: "Tentang Kami",
  alternates: { canonical: "/tentang-kami" },
};
export default async function About() {
  const [about, contributors] = await Promise.all([
    content("about_content"),
    content("contributors"),
  ]);
  const a =
    about.rows[0] ?? (about.state !== "ready" ? referenceAbout : undefined);
  return (
    <>
      <PageHero
        label="TENTANG RUANG DIGITAL INI"
        title={text(a, "title", "Tentang Pura Pusering Jagat Pejeng")}
        description="Sebuah inisiatif dokumentasi budaya untuk Pura Pusering Jagat Pejeng."
      />
      <section className="container section">
        {a ? (
          <>
            <div className="about-grid">
              <Media path={a.image_url} alt={text(a, "image_alt")} />
              <div>
                <Eyebrow>LATAR BELAKANG</Eyebrow>
                <h2>Budaya yang dikenal, warisan yang dijaga.</h2>
                <Prose value={text(a, "background")} />
                {a === referenceAbout && (
                  <a
                    className="source-link"
                    href={referenceSource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Rujukan narasi · {referenceSource.author} ↗
                  </a>
                )}
              </div>
            </div>
            <div className="about-values">
              {[
                ["purpose", "Tujuan pengembangan"],
                ["benefits", "Manfaat pelestarian"],
              ].map(([key, title]) => (
                <article key={key}>
                  <h2>{title}</h2>
                  <Prose value={text(a, key)} />
                </article>
              ))}
            </div>
          </>
        ) : (
          <div className="about-grid">
            {about.state !== "ready" && (
              <Media path="reference/main-gate.webp" />
            )}
            <Empty title="Informasi pengembangan sedang dipersiapkan" />
          </div>
        )}
        {contributors.rows.length > 0 && (
          <section className="contributors">
            <Eyebrow>DI BALIK DOKUMENTASI</Eyebrow>
            <h2>Pengembang & kontributor</h2>
            <div className="contributor-grid">
              {contributors.rows.map((c) => (
                <article key={c.id}>
                  {c.image_url && (
                    <Media path={c.image_url} alt={text(c, "image_alt")} />
                  )}
                  <h3>{text(c, "name")}</h3>
                  <span className="eyebrow">{text(c, "role")}</span>
                  <p>{text(c, "description")}</p>
                </article>
              ))}
            </div>
          </section>
        )}
      </section>
    </>
  );
}
