import { describe, it, expect } from "vitest";
import { secretIssues } from "../../scripts/check-secrets.mjs";
import { validatePublicEnvironment } from "../../scripts/public-env.mjs";
import { galleryPayload } from "@/lib/content-payload";
const testPublic = "sb_" + "publishable_" + "X".repeat(24);
const testSecret = "sb_" + "secret_" + "X".repeat(24);
describe("Pencegahan kebocoran Git", () => {
  it("menolak environment aktif meskipun dipaksa masuk staging", () => {
    expect(secretIssues(".env.local", "")).toContain(
      "berkas environment aktif",
    );
    expect(secretIssues("sub/.env.production", "")).toContain(
      "berkas environment aktif",
    );
    expect(secretIssues(".env.example", "NEXT_PUBLIC_SUPABASE_URL=")).toEqual(
      [],
    );
  });
  it("menandai key literal tanpa mencetak nilainya", () => {
    for (const key of [testPublic, testSecret])
      expect(secretIssues("src/leak.ts", key)).toEqual(["API key literal"]);
  });
  it("menolak salinan vault di source", () =>
    expect(secretIssues("credentials.dpapi", "encrypted")).toContain(
      "berkas kredensial/vault",
    ));
});
describe("Konfigurasi browser", () => {
  it("menerima URL dasar dengan publishable key atau mode tanpa konfigurasi", () => {
    expect(() => validatePublicEnvironment({})).not.toThrow();
    expect(() =>
      validatePublicEnvironment({
        NEXT_PUBLIC_SUPABASE_URL: "https://project.supabase.co",
        NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: testPublic,
      }),
    ).not.toThrow();
  });
  it("menghentikan build jika secret key akan dimasukkan ke browser", () => {
    expect(() =>
      validatePublicEnvironment({ NEXT_PUBLIC_OTHER: testSecret }),
    ).toThrow(/Secret key dilarang/);
  });
  it("menolak suffix endpoint dan konfigurasi setengah terisi", () => {
    expect(() =>
      validatePublicEnvironment({
        NEXT_PUBLIC_SUPABASE_URL: "https://project.supabase.co/rest/v1/",
        NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: testPublic,
      }),
    ).toThrow(/URL dasar/);
    expect(() =>
      validatePublicEnvironment({
        NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: testPublic,
      }),
    ).toThrow(/diisi bersama/);
  });
});
describe("Perubahan jenis media", () => {
  it("beralih ke video menghilangkan referensi foto lama dari record", () => {
    const data = galleryPayload({
      media_type: "video",
      media_url: "gallery/old.webp",
      storage_path: "gallery/old.webp",
      video_url: "https://youtu.be/test",
      thumbnail_url: "gallery/cover.webp",
      temple_object_id: "",
    });
    expect(data.media_url).toBe("");
    expect(data.storage_path).toBeNull();
    expect(data.video_url).toBe("https://youtu.be/test");
    expect(data.temple_object_id).toBeNull();
  });
  it("beralih ke foto menghilangkan URL video dan thumbnail yang tidak terpakai", () => {
    const data = galleryPayload({
      media_type: "photo",
      media_url: "gallery/new.webp",
      video_url: "https://youtu.be/old",
      thumbnail_url: "gallery/old.webp",
    });
    expect(data.video_url).toBe("");
    expect(data.thumbnail_url).toBe("");
    expect(data.storage_path).toBe(data.media_url);
  });
});
