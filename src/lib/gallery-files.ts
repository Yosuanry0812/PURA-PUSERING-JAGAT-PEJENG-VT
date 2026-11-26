import "server-only";
import { readdir } from "node:fs/promises";
import path from "node:path";

// Folder di public/galeri/<slug>/ = satu tab pada halaman /galeri.
export const GALLERY_FOLDERS = [
  { slug: "nista-mandala", label: "Nista Mandala" },
  { slug: "madya-mandala", label: "Madya Mandala" },
  { slug: "utama-mandala", label: "Utama Mandala" },
  { slug: "sejarah", label: "Sejarah" },
] as const;

export type GalleryItem = {
  id: string;
  category: string;
  type: "image" | "video";
  src: string;
  title: string;
};

const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif"]);
const VIDEO_EXT = new Set([".mp4", ".webm", ".m4v"]);

export function titleFromFile(file: string) {
  const base = file
    .slice(0, file.length - path.extname(file).length)
    .replace(/^\d+[\s._-]+/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!base) return file;
  // Nama huruf kecil semua → Kapital Tiap Kata; nama yang sudah diberi huruf besar dibiarkan.
  return base === base.toLowerCase()
    ? base.replace(
        /(^|\s)(\p{L})/gu,
        (_, s: string, c: string) => s + c.toUpperCase(),
      )
    : base;
}

export async function readGallery(
  root = path.join(process.cwd(), "public", "galeri"),
): Promise<GalleryItem[]> {
  const items: GalleryItem[] = [];
  for (const folder of GALLERY_FOLDERS) {
    let files: string[] = [];
    try {
      files = await readdir(
        path.join(/* turbopackIgnore: true */ root, folder.slug),
      );
    } catch {
      continue;
    }
    files.sort((a, b) =>
      a.localeCompare(b, "id", { numeric: true, sensitivity: "base" }),
    );
    for (const file of files) {
      if (file.startsWith(".")) continue;
      const ext = path.extname(file).toLowerCase();
      const type = IMAGE_EXT.has(ext)
        ? "image"
        : VIDEO_EXT.has(ext)
          ? "video"
          : null;
      if (!type) continue;
      items.push({
        id: folder.slug + "/" + file,
        category: folder.slug,
        type,
        src: "/galeri/" + folder.slug + "/" + encodeURIComponent(file),
        title: titleFromFile(file),
      });
    }
  }
  return items;
}
