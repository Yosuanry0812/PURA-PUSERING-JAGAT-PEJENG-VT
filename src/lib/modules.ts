import { z } from "zod";
import { safeHttps, videoUrl } from "./urls";
import { allowsReference, referencePhoto } from "./reference-media";
export type Field = {
  name: string;
  label: string;
  type?:
    "textarea" | "image" | "checkbox" | "number" | "select" | "email" | "url";
  required?: boolean;
  options?: string[];
  help?: string;
};
export type Module = {
  title: string;
  table: string;
  single?: boolean;
  folder: string;
  fields: Field[];
};
const f = (
  name: string,
  label: string,
  type?: Field["type"],
  required = false,
  options?: string[],
  help?: string,
): Field => ({ name, label, type, required, options, help });
const publication = [
  f("status", "Status", "select", true, ["draft", "published"]),
  f("sort_order", "Urutan", "number"),
];
const approval = f(
  "publication_approved",
  "Izin dokumentasi dan publikasi telah diperoleh",
  "checkbox",
);
const image = (name = "image_url", label = "Foto") => f(name, label, "image");
export const modules: Record<string, Module> = {
  beranda: {
    title: "Kelola Beranda",
    table: "home_content",
    single: true,
    folder: "hero",
    fields: [
      f("hero_title", "Judul hero", undefined, true),
      f("hero_subtitle", "Subjudul hero", "textarea", true),
      image("hero_image_url", "Foto hero"),
      f("hero_image_alt", "Alt text hero"),
      f("hero_cta", "Teks tombol tur", undefined, true),
      f("history_cta", "Teks tombol sejarah", undefined, true),
      f("intro_title", "Judul pengenalan", undefined, true),
      f("intro_description", "Pengenalan", "textarea", true),
      image("intro_image_url", "Foto pengenalan"),
      f("intro_image_alt", "Alt text pengenalan"),
      f("features_title", "Judul keunikan", undefined, true),
      ...["heritage", "architecture", "archaeology", "spiritual"].flatMap(
        (key, i) => [
          f(
            key + "_title",
            [
              "Sejarah: judul",
              "Arsitektur: judul",
              "Arkeologi: judul",
              "Spiritual: judul",
            ][i],
            undefined,
            true,
          ),
          f(key + "_description", "Deskripsi", "textarea", true),
        ],
      ),
      f("mandala_title", "Judul Tri Mandala", undefined, true),
      ...["nista", "madya", "utama"].map((k) =>
        f(k + "_description", "Deskripsi " + k + " mandala", "textarea", true),
      ),
      f("tour_title", "Judul pratinjau tur", undefined, true),
      f("tour_description", "Deskripsi tur", "textarea", true),
      image("tour_cover_url", "Cover pratinjau tur"),
      f("tour_cta", "Tombol pratinjau tur", undefined, true),
      f("gallery_title", "Judul galeri", undefined, true),
      f("conservation_title", "Judul pelestarian", undefined, true),
      f("conservation_description", "Narasi pelestarian", "textarea", true),
      f("is_published", "Terbitkan Beranda", "checkbox"),
    ],
  },
  sejarah: {
    title: "Kelola Sejarah",
    table: "history_sections",
    folder: "history",
    fields: [
      f("title", "Judul", undefined, true),
      f("slug", "Slug", undefined, true),
      f("summary", "Ringkasan", "textarea"),
      f("content", "Isi sejarah", "textarea", true),
      f("source_url", "URL sumber", "url"),
      f("source_note", "Catatan verifikasi sumber", "textarea"),
      image(),
      f("image_alt", "Alt text foto"),
      ...publication,
    ],
  },
  "objek-pura": {
    title: "Kelola Objek Pura",
    table: "temple_objects",
    folder: "objects",
    fields: [
      f("name", "Nama objek", undefined, true),
      f("mandala", "Mandala", "select", true, ["nista", "madya", "utama"]),
      f("description", "Deskripsi", "textarea", true),
      f("function_description", "Fungsi", "textarea"),
      f("cultural_value", "Nilai budaya", "textarea"),
      image(),
      f("image_alt", "Alt text foto"),
      approval,
      ...publication,
    ],
  },
  galeri: {
    title: "Kelola Galeri",
    table: "gallery_items",
    folder: "gallery",
    fields: [
      f("title", "Judul media", undefined, true),
      f("description", "Deskripsi", "textarea"),
      f("media_type", "Jenis media", "select", true, ["photo", "video"]),
      image("media_url", "Foto (untuk jenis photo)"),
      f("video_url", "URL video YouTube/Vimeo", "url"),
      image("thumbnail_url", "Thumbnail video"),
      f("image_alt", "Alt text foto"),
      f(
        "category",
        "Kategori",
        undefined,
        true,
        undefined,
        "Contoh: Nista Mandala, Madya Mandala, Utama Mandala, Dokumentasi Budaya.",
      ),
      f("temple_object_id", "Objek terkait", "select", false, []),
      f("is_featured", "Tampilkan di Beranda", "checkbox"),
      approval,
      ...publication,
    ],
  },
  "virtual-tour": {
    title: "Kelola Virtual Tour",
    table: "virtual_tour_settings",
    single: true,
    folder: "virtual-tour-cover",
    fields: [
      f("title", "Judul halaman", undefined, true),
      f("description", "Deskripsi", "textarea", true),
      f(
        "tour_url",
        "URL publish Pano2VR",
        "url",
        false,
        undefined,
        "HTTPS. Hostname harus tercantum pada TOUR_ALLOWED_HOSTS. Hotspot dan scene tetap dikelola di Pano2VR.",
      ),
      image("cover_image_url", "Cover Virtual Tour"),
      f("cover_image_alt", "Alt text cover"),
      f("is_published", "Publikasikan Virtual Tour", "checkbox"),
    ],
  },
  "tentang-kami": {
    title: "Kelola Tentang Kami",
    table: "about_content",
    single: true,
    folder: "about",
    fields: [
      f("title", "Judul", undefined, true),
      f("background", "Latar belakang", "textarea", true),
      f("purpose", "Tujuan pengembangan", "textarea", true),
      f("benefits", "Manfaat pelestarian", "textarea", true),
      image(),
      f("image_alt", "Alt text foto"),
      f("is_published", "Terbitkan halaman", "checkbox"),
    ],
  },
  pengaturan: {
    title: "Pengaturan Website",
    table: "site_settings",
    single: true,
    folder: "about",
    fields: [
      f("site_name", "Nama website", undefined, true),
      f("site_description", "Deskripsi website", "textarea", true),
      image("logo_url", "Logo"),
      image("favicon_url", "Favicon (PNG)"),
      image("background_image_url", "Foto latar website publik"),
      f("contact_email", "Email yang disetujui", "email"),
      f("contact_phone", "Nomor kontak yang disetujui"),
      f("location_text", "Lokasi umum", undefined, true),
      f("instagram_url", "Instagram", "url"),
      f("facebook_url", "Facebook", "url"),
      f("footer_description", "Deskripsi footer", "textarea", true),
      f("seo_title", "Judul SEO", undefined, true),
      f("seo_description", "Deskripsi SEO", "textarea", true),
    ],
  },
  kontributor: {
    title: "Kontributor",
    table: "contributors",
    folder: "about",
    fields: [
      f("name", "Nama", undefined, true),
      f("role", "Peran", undefined, true),
      f("description", "Deskripsi", "textarea"),
      image(),
      f("image_alt", "Alt text foto"),
      f("sort_order", "Urutan", "number"),
      f(
        "is_published",
        "Identitas telah diizinkan untuk ditampilkan",
        "checkbox",
      ),
    ],
  },
};
export const navigation = Object.entries(modules)
  .filter(([key]) => key !== "kontributor")
  .map(([key, m]) => ({ href: "/admin/" + key, label: m.title }));
export function moduleSchema(module: Module) {
  const shape: Record<string, z.ZodType> = {};
  for (const field of module.fields) {
    if (field.type === "checkbox") shape[field.name] = z.boolean();
    else if (field.type === "number")
      shape[field.name] = z.number().int().min(0).max(999999);
    else if (field.type === "select") {
      const allowed =
        field.name === "temple_object_id" ? undefined : field.options;
      shape[field.name] =
        field.name === "temple_object_id"
          ? z.union([z.literal(""), z.uuid()])
          : z
              .string()
              .refine(
                (v) => Boolean(allowed?.includes(v)),
                "Pilihan tidak valid.",
              );
    } else {
      let s = z
        .string()
        .trim()
        .max(field.type === "textarea" ? 20000 : 500);
      if (field.required) s = s.min(1, "Wajib diisi.");
      shape[field.name] = s
        .refine(
          (v) => !v || field.type !== "email" || z.email().safeParse(v).success,
          "Alamat email tidak valid.",
        )
        .refine(
          (v) => !v || field.type !== "url" || Boolean(safeHttps(v)),
          "URL wajib HTTPS tanpa kredensial.",
        )
        .refine(
          (v) =>
            !v ||
            field.type !== "image" ||
            /^[a-z-]+\/[0-9a-f-]{36}\.(jpg|png|webp)$/.test(v) ||
            Boolean(allowsReference(module.table) && referencePhoto(v)),
          "Gunakan hasil unggahan Storage atau foto referensi yang tersedia.",
        );
    }
  }
  return z.object(shape).superRefine((data, ctx) => {
    if (
      module.table === "history_sections" &&
      !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(String(data.slug))
    )
      ctx.addIssue({
        code: "custom",
        path: ["slug"],
        message: "Slug hanya huruf kecil, angka, dan tanda hubung.",
      });
    if (
      ["temple_objects", "gallery_items"].includes(module.table) &&
      data.status === "published" &&
      !data.publication_approved
    )
      ctx.addIssue({
        code: "custom",
        path: ["publication_approved"],
        message: "Izin publikasi wajib diperoleh sebelum menerbitkan.",
      });
    if (module.table === "gallery_items") {
      if (
        data.media_type === "video" &&
        data.thumbnail_url &&
        !data.image_alt
      ) {
        ctx.addIssue({
          code: "custom",
          path: ["image_alt"],
          message: "Alt text thumbnail video wajib diisi.",
        });
      }
      if (data.media_type === "photo" && !data.media_url)
        ctx.addIssue({
          code: "custom",
          path: ["media_url"],
          message: "Unggah foto terlebih dahulu.",
        });
      if (data.media_type === "photo" && !data.image_alt)
        ctx.addIssue({
          code: "custom",
          path: ["image_alt"],
          message: "Alt text foto wajib diisi.",
        });
      if (data.media_type === "video" && !videoUrl(String(data.video_url)))
        ctx.addIssue({
          code: "custom",
          path: ["video_url"],
          message: "Gunakan URL YouTube atau Vimeo yang telah disetujui.",
        });
    }
    for (const field of module.fields.filter((f) => f.type === "image")) {
      if (data[field.name]) {
        const alt =
          field.name === "hero_image_url"
            ? "hero_image_alt"
            : field.name === "intro_image_url"
              ? "intro_image_alt"
              : field.name === "cover_image_url"
                ? "cover_image_alt"
                : field.name === "image_url"
                  ? "image_alt"
                  : null;
        if (alt && !data[alt])
          ctx.addIssue({
            code: "custom",
            path: [alt],
            message: "Alt text foto wajib diisi.",
          });
      }
    }
  });
}
