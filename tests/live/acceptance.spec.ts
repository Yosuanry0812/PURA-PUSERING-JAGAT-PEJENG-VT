import sharp from "sharp";
import { test, expect, type Page } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";
const required = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
  "TEST_ADMIN_EMAIL",
  "TEST_ADMIN_PASSWORD",
  "TEST_NONADMIN_EMAIL",
  "TEST_NONADMIN_PASSWORD",
];
const enabled =
  process.env.RUN_LIVE_TESTS === "1" &&
  required.every((k) => Boolean(process.env[k]));
test.skip(
  !enabled,
  "Memerlukan proyek Supabase uji, dua akun uji, serta RUN_LIVE_TESTS=1; tidak dijalankan dengan credential rekaan.",
);
const client = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    { auth: { persistSession: false } },
  );
async function login(page: Page) {
  await page.goto("/admin/login");
  await page
    .getByLabel("Email administrator")
    .fill(process.env.TEST_ADMIN_EMAIL!);
  await page
    .getByLabel("Kata sandi", { exact: true })
    .fill(process.env.TEST_ADMIN_PASSWORD!);
  await page.getByRole("button", { name: "Login", exact: true }).click();
  await expect(page).toHaveURL(/\/admin\/dashboard$/);
}
test("A: edit hero melalui admin, tampil publik, dan pulihkan data asli", async ({
  page,
}) => {
  await login(page);
  await page.goto("/admin/beranda");
  const original = await page
    .getByLabel("Judul hero", { exact: true })
    .inputValue();
  const changed = "Verifikasi integrasi " + Date.now();
  try {
    await page.getByLabel("Judul hero", { exact: true }).fill(changed);
    await page.getByRole("button", { name: "Simpan perubahan" }).click();
    await expect(page.getByRole("status")).toContainText(
      "tersimpan di Supabase",
    );
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(changed);
    await page.reload();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(changed);
  } finally {
    await page.goto("/admin/beranda");
    await page.getByLabel("Judul hero", { exact: true }).fill(original);
    await page.getByRole("button", { name: "Simpan perubahan" }).click();
    await expect(page.getByRole("status")).toContainText(
      "tersimpan di Supabase",
    );
  }
});
test("B, H, I: upload privat, izin publikasi, tampil publik, hapus", async ({
  page,
}) => {
  await login(page);
  await page.goto("/admin/galeri?baru=1");
  const title = "Dokumentasi pengujian integrasi " + Date.now();
  let storagePath = "";
  const admin = client();
  await admin.auth.signInWithPassword({
    email: process.env.TEST_ADMIN_EMAIL!,
    password: process.env.TEST_ADMIN_PASSWORD!,
  });
  try {
    await page.getByLabel("Judul media", { exact: true }).fill(title);
    await page.locator("#field-media_url").setInputFiles({
      name: "verifikasi.png",
      mimeType: "image/png",
      buffer: await sharp({
        create: {
          width: 2,
          height: 2,
          channels: 3,
          background: { r: 0, g: 0, b: 0 },
        },
      })
        .png()
        .toBuffer(),
    });
    await expect(page.getByRole("status")).toContainText(
      "tersimpan secara privat",
    );
    await page
      .getByLabel("Alt text foto", { exact: true })
      .fill("Gambar sintetis untuk pengujian integrasi, bukan foto pura");
    await page
      .getByLabel("Kategori", { exact: true })
      .fill("Pengujian integrasi");
    await page.getByLabel("Status", { exact: true }).selectOption("draft");
    await page.getByRole("button", { name: "Simpan perubahan" }).click();
    await expect(page.getByRole("status")).toContainText(
      "tersimpan di Supabase",
    );
    const { data } = await admin
      .from("gallery_items")
      .select("id,media_url")
      .eq("title", title)
      .single();
    expect(data).toBeTruthy();
    storagePath = data!.media_url;
    const anon = client();
    expect(
      (await anon.storage.from("temple-media").download(storagePath)).error,
    ).toBeTruthy();
    await page.getByLabel("Status", { exact: true }).selectOption("published");
    await page.getByRole("button", { name: "Simpan perubahan" }).click();
    await expect(
      page.getByText("Izin publikasi wajib diperoleh sebelum menerbitkan."),
    ).toBeVisible();
    await page
      .getByLabel("Izin dokumentasi dan publikasi telah diperoleh")
      .check();
    await page.getByRole("button", { name: "Simpan perubahan" }).click();
    await expect(page.getByRole("status")).toContainText(
      "tersimpan di Supabase",
    );
    await page.goto("/galeri?kategori=Pengujian+integrasi");
    await expect(
      page.getByRole("button", { name: new RegExp(title) }),
    ).toBeVisible();
    expect(
      (await anon.storage.from("temple-media").download(storagePath)).error,
    ).toBeNull();
    await page.goto("/admin/galeri?q=" + encodeURIComponent(title));
    await page.getByRole("button", { name: "Hapus " + title }).click();
    await page
      .getByRole("button", { name: "Hapus konten", exact: true })
      .click();
    await expect(page.getByRole("heading", { name: title })).toHaveCount(0);
    await page.goto("/galeri?kategori=Pengujian+integrasi");
    await expect(
      page.getByRole("button", { name: new RegExp(title) }),
    ).toHaveCount(0);
    expect(
      (await anon.storage.from("temple-media").download(storagePath)).error,
    ).toBeTruthy();
  } finally {
    await admin.from("gallery_items").delete().eq("title", title);
    if (storagePath)
      await admin.storage.from("temple-media").remove([storagePath]);
    await admin.auth.signOut();
  }
});
test("C: sejarah draft tidak terlihat, publish mengikuti urutan dan dapat dihapus", async ({
  page,
}) => {
  await login(page);
  const title = "Narasi pengujian " + Date.now(),
    slug = "uji-" + Date.now();
  const admin = client();
  await admin.auth.signInWithPassword({
    email: process.env.TEST_ADMIN_EMAIL!,
    password: process.env.TEST_ADMIN_PASSWORD!,
  });
  try {
    await page.goto("/admin/sejarah?baru=1");
    await page.getByLabel("Judul", { exact: true }).fill(title);
    await page.getByLabel("Slug", { exact: true }).fill(slug);
    await page
      .getByLabel("Isi sejarah", { exact: true })
      .fill("Konten sintetis untuk pengujian, bukan sejarah pura.");
    await page.getByRole("button", { name: "Simpan perubahan" }).click();
    await expect(page.getByRole("status")).toContainText(
      "tersimpan di Supabase",
    );
    await page.goto("/sejarah");
    await expect(page.getByRole("heading", { name: title })).toHaveCount(0);
    const { data } = await admin
      .from("history_sections")
      .select("id")
      .eq("slug", slug)
      .single();
    await page.goto("/admin/sejarah?edit=" + data!.id);
    await page.getByLabel("Status", { exact: true }).selectOption("published");
    await page.getByRole("button", { name: "Simpan perubahan" }).click();
    await expect(page.getByRole("status")).toContainText(
      "tersimpan di Supabase",
    );
    await page.goto("/sejarah");
    await expect(page.getByRole("heading", { name: title })).toBeVisible();
  } finally {
    await admin.from("history_sections").delete().eq("slug", slug);
    await admin.auth.signOut();
  }
});
test("D, E: anon dan non-admin ditolak oleh Auth, server, RLS, Storage, dan membership", async ({
  page,
}) => {
  const anon = client(),
    nonAdmin = client();
  const { error } = await nonAdmin.auth.signInWithPassword({
    email: process.env.TEST_NONADMIN_EMAIL!,
    password: process.env.TEST_NONADMIN_PASSWORD!,
  });
  expect(error).toBeNull();
  for (const c of [anon, nonAdmin]) {
    expect(
      (
        await c.from("history_sections").insert({
          title: "Percobaan ditolak",
          slug: "denied-" + Date.now(),
          content: "Tidak boleh tersimpan",
        })
      ).error,
    ).toBeTruthy();
    const { data } = await c
      .from("history_sections")
      .select("id")
      .eq("status", "draft");
    expect(data ?? []).toHaveLength(0);
    expect(
      (
        await c
          .from("admin_users")
          .insert({ user_id: crypto.randomUUID(), display_name: "Tidak sah" })
      ).error,
    ).toBeTruthy();
    expect(
      (
        await c.storage
          .from("temple-media")
          .upload(
            "gallery/" + crypto.randomUUID() + ".png",
            new Uint8Array([1, 2]),
            { contentType: "image/png" },
          )
      ).error,
    ).toBeTruthy();
  }
  await page.goto("/admin/dashboard");
  await expect(page).toHaveURL(/\/admin\/login/);
  await page
    .getByLabel("Email administrator")
    .fill(process.env.TEST_NONADMIN_EMAIL!);
  await page
    .getByLabel("Kata sandi", { exact: true })
    .fill(process.env.TEST_NONADMIN_PASSWORD!);
  await page.getByRole("button", { name: "Login", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText("tidak memiliki akses");
  const invalid = await anon.auth.signInWithPassword({
    email: process.env.TEST_ADMIN_EMAIL!,
    password: crypto.randomUUID(),
  });
  expect(invalid.error).toBeTruthy();
  await nonAdmin.auth.signOut();
});
test("F, G: publish URL Pano2VR lalu nonaktifkan dan pulihkan konfigurasi", async ({
  page,
}) => {
  test.skip(
    !process.env.TEST_TOUR_URL,
    "Memerlukan URL Pano2VR uji HTTPS pada TOUR_ALLOWED_HOSTS.",
  );
  await login(page);
  const admin = client();
  await admin.auth.signInWithPassword({
    email: process.env.TEST_ADMIN_EMAIL!,
    password: process.env.TEST_ADMIN_PASSWORD!,
  });
  const { data: original } = await admin
    .from("virtual_tour_settings")
    .select("*")
    .eq("id", 1)
    .single();
  expect(original).toBeTruthy();
  try {
    await page.goto("/admin/virtual-tour");
    await page
      .getByLabel("URL publish Pano2VR", { exact: true })
      .fill(process.env.TEST_TOUR_URL!);
    await page.getByLabel("Publikasikan Virtual Tour").check();
    await page.getByRole("button", { name: "Simpan perubahan" }).click();
    await expect(page.getByRole("status")).toContainText(
      "tersimpan di Supabase",
    );
    await page.goto("/virtual-tour");
    await page.getByRole("button", { name: "Muat Virtual Tour" }).click();
    await expect(page.locator("iframe")).toHaveAttribute(
      "src",
      process.env.TEST_TOUR_URL!,
    );
    await page.goto("/admin/virtual-tour");
    await page.getByLabel("Publikasikan Virtual Tour").uncheck();
    await page.getByRole("button", { name: "Simpan perubahan" }).click();
    await expect(page.getByRole("status")).toContainText(
      "tersimpan di Supabase",
    );
    await page.goto("/virtual-tour");
    await expect(page.locator("iframe")).toHaveCount(0);
    await expect(
      page.getByText("Perjalanan virtual sedang dipersiapkan."),
    ).toBeVisible();
  } finally {
    await admin.from("virtual_tour_settings").upsert(original!);
    await admin.auth.signOut();
  }
});
test("logout mengakhiri akses dashboard", async ({ page }) => {
  await login(page);
  await page.getByRole("button", { name: "Logout", exact: true }).click();
  await expect(page).toHaveURL(/\/admin\/login$/);
  await page.goto("/admin/dashboard");
  await expect(page).toHaveURL(/\/admin\/login/);
});
