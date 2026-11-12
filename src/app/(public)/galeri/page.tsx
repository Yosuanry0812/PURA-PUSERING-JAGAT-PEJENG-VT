import Link from "next/link";
import { content, galleryCategories } from "@/lib/content";
import { Gallery } from "@/components/public/gallery";
import { PageHero, Empty } from "@/components/public/ui";
export const metadata = {
  title: "Galeri Dokumentasi",
  alternates: { canonical: "/galeri" },
};
export default async function GalleryPage({
  searchParams,
}: {
  searchParams: Promise<{ kategori?: string; page?: string }>;
}) {
  const p = await searchParams;
  const page = Math.max(1, Math.min(10000, Number(p.page) || 1));
  const [data, categories] = await Promise.all([
    content("gallery_items", { page, limit: 18, category: p.kategori }),
    galleryCategories(),
  ]);
  const url = (n: number) =>
    "/galeri?" +
    new URLSearchParams({
      ...(p.kategori ? { kategori: p.kategori } : {}),
      page: String(n),
    });
  return (
    <>
      <PageHero
        label="DOKUMENTASI BUDAYA"
        title="Galeri Pura Pusering Jagat"
        description="Arsip visual Pura Pusering Jagat Pejeng yang telah mendapat persetujuan publikasi."
      />
      <section className="container section">
        {categories.length > 0 && (
          <nav className="filter-row" aria-label="Kategori galeri">
            <Link
              href="/galeri"
              aria-current={!p.kategori ? "page" : undefined}
            >
              Semua dokumentasi
            </Link>
            {categories.map((c) => (
              <Link
                key={c}
                href={"/galeri?" + new URLSearchParams({ kategori: c })}
                aria-current={p.kategori === c ? "page" : undefined}
              >
                {c}
              </Link>
            ))}
          </nav>
        )}
        {data.rows.length ? (
          <Gallery items={data.rows} />
        ) : (
          <Empty
            title={
              p.kategori
                ? "Belum ada media pada kategori ini"
                : "Dokumentasi yang layak dijaga"
            }
            body={
              data.state === "error"
                ? "Galeri belum dapat dimuat. Silakan coba kembali."
                : "Foto dan video akan hadir setelah melalui verifikasi dan persetujuan publikasi."
            }
          />
        )}
        <nav className="pagination" aria-label="Halaman galeri">
          {page > 1 && <Link href={url(page - 1)}>← Sebelumnya</Link>}
          {page * 18 < data.count && (
            <Link href={url(page + 1)}>Selanjutnya →</Link>
          )}
        </nav>
      </section>
    </>
  );
}
