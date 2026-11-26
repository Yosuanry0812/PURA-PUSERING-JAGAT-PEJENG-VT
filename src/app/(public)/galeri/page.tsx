import { GALLERY_FOLDERS, readGallery } from "@/lib/gallery-files";
import { Galeri } from "@/components/public/galeri";
import { PageHero } from "@/components/public/ui";
export const metadata = {
  title: "Galeri Dokumentasi",
  alternates: { canonical: "/galeri" },
};
export default async function GalleryPage() {
  const items = await readGallery();
  return (
    <>
      <PageHero
        label="DOKUMENTASI BUDAYA"
        title="Galeri Pura Pusering Jagat"
        description="Arsip visual Pura Pusering Jagat Pejeng yang telah mendapat persetujuan publikasi."
      />
      <section className="container section">
        <Galeri items={items} folders={GALLERY_FOLDERS} />
      </section>
    </>
  );
}
