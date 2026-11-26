import "server-only";
import { readdir } from "node:fs/promises";
import path from "node:path";
import { GALLERY_INFO, fileKey } from "./gallery-info";

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
  /** Video berlatar bluescreen (folder sejarah): latarnya dihapus di browser. */
  chroma: boolean;
  src: string;
  title: string;
  /** Penjelasan singkat objek; kosong bila belum ada di gallery-info. */
  description: string;
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
    // Berkas terdaftar mengikuti urutan tabel; sisanya urut nama di belakangnya.
    const info = GALLERY_INFO[folder.slug] ?? [];
    const rank = (file: string) => {
      const i = info.findIndex((row) => row[0] === fileKey(file));
      return i < 0 ? info.length : i;
    };
    files.sort(
      (a, b) =>
        rank(a) - rank(b) ||
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
      const known = info.find((row) => row[0] === fileKey(file));
      items.push({
        id: folder.slug + "/" + file,
        category: folder.slug,
        type,
        chroma: type === "video" && folder.slug === "sejarah",
        src: "/galeri/" + folder.slug + "/" + encodeURIComponent(file),
        title: known ? known[1] : titleFromFile(file),
        description: known ? known[2] : "",
      });
    }
  }
  return items;
}
