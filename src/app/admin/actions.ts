"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { configured } from "@/lib/supabase/config";
import { serverClient } from "@/lib/supabase/server";
import { modules, moduleSchema } from "@/lib/modules";
import { validTour } from "@/lib/urls";
import { MAX_UPLOAD, imageExtension } from "@/lib/uploads";
import { z } from "zod";
import sharp from "sharp";
import { galleryPayload } from "@/lib/content-payload";
export type ActionState = {
  ok: boolean;
  message: string;
  id?: string;
  errors?: Record<string, string[] | undefined>;
};
export async function login(
  _previous: ActionState,
  form: FormData,
): Promise<ActionState> {
  if (!configured())
    return {
      ok: false,
      message:
        "Supabase belum dikonfigurasi. Ikuti panduan setup sebelum login.",
    };
  const check = z
    .object({ email: z.email().max(254), password: z.string().min(1).max(200) })
    .safeParse({ email: form.get("email"), password: form.get("password") });
  if (!check.success)
    return { ok: false, message: "Isi email dan kata sandi yang valid." };
  const client = await serverClient();
  const { error } = await client.auth.signInWithPassword(check.data);
  if (error)
    return {
      ok: false,
      message:
        "Login gagal. Periksa kredensial atau coba kembali beberapa saat lagi.",
    };
  const {
    data: { user },
  } = await client.auth.getUser();
  const { data: admin } = await client
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user?.id ?? "")
    .eq("is_active", true)
    .single();
  if (!admin) {
    await client.auth.signOut();
    return {
      ok: false,
      message: "Akun ini tidak memiliki akses administrator aktif.",
    };
  }
  redirect("/admin/dashboard");
}
export async function logout(
  _previous: ActionState,
  _form: FormData,
): Promise<ActionState> {
  void _previous;
  void _form;
  if (configured()) {
    const c = await serverClient();
    const { error } = await c.auth.signOut();
    if (error)
      return {
        ok: false,
        message: "Logout belum berhasil. Periksa koneksi dan coba kembali.",
      };
  }
  redirect("/admin/login");
}
function refresh() {
  revalidatePath("/", "layout");
}
export async function saveContent(
  key: string,
  id: string | undefined,
  input: unknown,
): Promise<ActionState> {
  const { client } = await requireAdmin();
  const m = modules[key];
  if (!m) return { ok: false, message: "Modul tidak valid." };
  const checked = moduleSchema(m).safeParse(input);
  if (!checked.success)
    return {
      ok: false,
      message: "Periksa kembali isian formulir.",
      errors: z.flattenError(checked.error).fieldErrors,
    };
  const data = checked.data;
  if (
    m.table === "virtual_tour_settings" &&
    data.tour_url &&
    !validTour(
      String(data.tour_url),
      (process.env.TOUR_ALLOWED_HOSTS ?? "")
        .split(",")
        .map((h) => h.trim().toLowerCase())
        .filter(Boolean),
    )
  )
    return {
      ok: false,
      message: "Hostname URL belum disetujui pada TOUR_ALLOWED_HOSTS.",
    };
  if (
    m.table === "virtual_tour_settings" &&
    data.is_published &&
    !data.tour_url
  )
    return {
      ok: false,
      message: "URL Virtual Tour wajib diisi sebelum publikasi.",
    };
  if (!m.single && id && !z.uuid().safeParse(id).success)
    return { ok: false, message: "ID tidak valid." };
  const payload = m.table === "gallery_items" ? galleryPayload(data) : data;
  const query = m.single
    ? client.from(m.table).upsert({ ...payload, id: 1 })
    : id
      ? client.from(m.table).update(payload).eq("id", id)
      : client.from(m.table).insert(payload);
  const { data: saved, error } = await query.select("id").single();
  if (error)
    return {
      ok: false,
      message:
        error.code === "23505"
          ? "Slug sudah digunakan. Pilih slug lain."
          : "Penyimpanan gagal. Periksa izin publikasi, koneksi, dan sesi admin.",
    };
  refresh();
  return {
    ok: true,
    message: "Perubahan tersimpan di Supabase.",
    id: String(saved.id),
  };
}
export async function deleteContent(
  key: string,
  id: string,
): Promise<ActionState> {
  const { client } = await requireAdmin();
  const m = modules[key];
  if (!m || m.single || !z.uuid().safeParse(id).success)
    return { ok: false, message: "Permintaan tidak valid." };
  const { data, error } = await client
    .from(m.table)
    .delete()
    .eq("id", id)
    .select("id");
  if (error || !data?.length)
    return {
      ok: false,
      message: "Penghapusan gagal. Muat ulang atau login kembali.",
    };
  refresh();
  return {
    ok: true,
    message:
      "Konten dihapus. Berkas tetap disimpan agar referensi konten lain aman.",
  };
}
export async function uploadMedia(
  key: string,
  form: FormData,
): Promise<ActionState> {
  const { client } = await requireAdmin();
  const m = modules[key];
  const file = form.get("file");
  if (!m || !(file instanceof File) || !file.size || file.size > MAX_UPLOAD)
    return { ok: false, message: "Pilih JPEG, PNG, atau WebP maksimal 3 MiB." };
  const bytes = new Uint8Array(await file.arrayBuffer());
  const extension = imageExtension(bytes, file.type, file.name);
  if (!extension)
    return {
      ok: false,
      message: "Ekstensi, tipe MIME, dan isi berkas gambar tidak cocok.",
    };
  let optimized: Buffer;
  try {
    // Decode the entire image, reject decompression bombs, strip EXIF, and fit web dimensions.
    optimized = await sharp(bytes, { limitInputPixels: 40000000 })
      .rotate()
      .resize({
        width: 1920,
        height: 1920,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: 84 })
      .toBuffer();
  } catch {
    return {
      ok: false,
      message: "Gambar rusak atau melebihi 40 megapiksel. Pilih gambar lain.",
    };
  }
  const storagePath = m.folder + "/" + crypto.randomUUID() + ".webp";
  const { error } = await client.storage
    .from("temple-media")
    .upload(storagePath, optimized, {
      contentType: "image/webp",
      upsert: false,
      cacheControl: "0",
    });
  return error
    ? { ok: false, message: "Upload gagal. Periksa Storage dan sesi admin." }
    : {
        ok: true,
        message:
          "Berkas tersimpan secara privat. Publikasikan konten setelah izin diperoleh.",
        id: storagePath,
      };
}
