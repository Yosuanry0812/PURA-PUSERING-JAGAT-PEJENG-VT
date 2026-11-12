import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL;
  if (!base) return [];
  return ["", "/sejarah", "/virtual-tour", "/galeri", "/tentang-kami"].map(
    (p) => ({
      url: base.replace(/\/$/, "") + p,
      changeFrequency: "weekly",
      priority: p ? 0.7 : 1,
    }),
  );
}
