import { content, text } from "@/lib/content";
import { PageHero, Media, Empty, Eyebrow, Prose } from "@/components/public/ui";
import { referenceHistory, referenceSource } from "@/lib/reference-content";
import { safeHttps } from "@/lib/urls";
export const metadata = {
  title: "Sejarah Pura Pusering Jagat",
  alternates: { canonical: "/sejarah" },
};
export default async function History() {
  const data = await content("history_sections", { limit: 200 });
  const sections = data.rows.length
    ? data.rows
    : data.state !== "ready"
      ? referenceHistory
      : [];
  return (
    <>
      <PageHero
        label="JEJAK SEJARAH"
        title="Sejarah Pura Pusering Jagat"
        description="Telusuri makna Pusering Jagat, jejak Bali Kuno, serta peninggalan dan tradisi yang hidup di Pejeng."
      />
      <div className="container section">
        {!sections.length ? (
          <div className="history-empty">
            {data.state !== "ready" && (
              <Media path="reference/split-gateway.webp" />
            )}
            <Empty
              title="Kisah sedang disusun dengan cermat"
              body={
                data.state === "error"
                  ? "Konten belum dapat dimuat. Silakan coba kembali beberapa saat lagi."
                  : "Narasi sejarah akan diterbitkan setelah sumber diperiksa dan disetujui."
              }
            />
          </div>
        ) : (
          <>
            {sections === referenceHistory && (
              <aside
                className="history-reference"
                aria-label="Sumber narasi sejarah"
              >
                <p>
                  Disarikan dari artikel{" "}
                  <strong>{referenceSource.author}</strong>, dengan narasumber
                  Jero Mangku Pura Puser Ing Jagat sebagaimana dicantumkan dalam
                  artikel. Narasi disusun ulang untuk pengenalan budaya;
                  perkiraan waktu dan kepercayaan setempat disampaikan sesuai
                  konteksnya.
                </p>
                <a
                  className="source-link"
                  href={referenceSource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Baca artikel rujukan lengkap ↗
                </a>
              </aside>
            )}
            <nav className="history-toc" aria-label="Bagian sejarah">
              {sections.map((r, i) => (
                <a href={"#" + text(r, "slug")} key={r.id}>
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  {text(r, "title")}
                </a>
              ))}
            </nav>
            {sections.map((r, i) => (
              <article
                id={text(r, "slug")}
                className={"history-section " + (i % 2 ? "reverse" : "")}
                key={r.id}
              >
                {r.image_url && (
                  <Media path={r.image_url} alt={text(r, "image_alt")} />
                )}
                <div>
                  <Eyebrow>BAGIAN {String(i + 1).padStart(2, "0")}</Eyebrow>
                  <h2>{text(r, "title")}</h2>
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
          </>
        )}
      </div>
    </>
  );
}
