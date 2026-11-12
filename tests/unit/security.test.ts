import { describe, it, expect } from "vitest";
import { safeHttps, validTour, mediaUrl, videoUrl } from "@/lib/urls";
import { modules, moduleSchema } from "@/lib/modules";
import { imageExtension, MAX_UPLOAD } from "@/lib/uploads";
const defaults = (key: string) =>
  Object.fromEntries(
    modules[key].fields.map((f) => [
      f.name,
      f.type === "checkbox"
        ? false
        : f.type === "number"
          ? 0
          : f.type === "select"
            ? (f.options?.[0] ?? "")
            : f.required
              ? "Konten"
              : "",
    ]),
  );
describe("Batas keamanan URL", () => {
  it.each([
    "javascript:alert(1)",
    "data:text/html,test",
    "http://example.com",
    "https://user:pass@example.com",
    "file:///tmp/a",
  ])("menolak %s", (v) => expect(safeHttps(v)).toBeNull());
  it("menolak host mirip, port, dan domain tanpa konfigurasi", () => {
    expect(validTour("https://tour.example.com/a", ["tour.example.com"])).toBe(
      true,
    );
    for (const url of [
      "https://tour.example.com.attacker.test/",
      "https://attacker.test/?tour.example.com",
      "https://tour.example.com:8443/",
    ])
      expect(validTour(url, ["tour.example.com"])).toBe(false);
    expect(validTour("https://tour.example.com/", [])).toBe(false);
  });
  it("membatasi video ke penyedia yang disetujui", () => {
    expect(videoUrl("https://youtu.be/abc")).toBeTruthy();
    expect(videoUrl("https://youtu.be.attacker.test/abc")).toBeNull();
  });
  it("tidak membentuk URL media dari traversal atau URL eksternal", () => {
    expect(mediaUrl("gallery/abc.webp")).toBe("/media/gallery/abc.webp");
    expect(mediaUrl("gallery/../private")).toBe("");
    expect(mediaUrl("https://x.test/a")).toBe("");
  });
});
describe("Workflow publikasi", () => {
  it("menolak objek belum diizinkan meskipun published", () => {
    const input = {
      ...defaults("objek-pura"),
      status: "published",
      publication_approved: false,
    };
    expect(moduleSchema(modules["objek-pura"]).safeParse(input).success).toBe(
      false,
    );
    input.publication_approved = true;
    expect(moduleSchema(modules["objek-pura"]).safeParse(input).success).toBe(
      true,
    );
  });
  it("menolak foto tanpa persetujuan dan alt text", () => {
    const input = {
      ...defaults("galeri"),
      media_url: "gallery/550e8400-e29b-41d4-a716-446655440000.jpg",
      status: "published",
      publication_approved: false,
    };
    expect(moduleSchema(modules.galeri).safeParse(input).success).toBe(false);
    expect(
      moduleSchema(modules.galeri).safeParse({
        ...input,
        publication_approved: true,
        image_alt: "Foto dokumentasi uji",
      }).success,
    ).toBe(true);
  });
  it("mendukung draft dan memvalidasi slug", () => {
    const input = {
      ...defaults("sejarah"),
      slug: "narasi-awal",
      status: "draft",
    };
    expect(moduleSchema(modules.sejarah).safeParse(input).success).toBe(true);
    expect(
      moduleSchema(modules.sejarah).safeParse({ ...input, slug: "../script" })
        .success,
    ).toBe(false);
  });
  it("membuang kolom role dan ID yang disisipkan", () => {
    const parsed = moduleSchema(modules["objek-pura"]).parse({
      ...defaults("objek-pura"),
      role: "admin",
      is_active: true,
      id: 1,
    });
    expect(parsed).not.toHaveProperty("role");
    expect(parsed).not.toHaveProperty("is_active");
    expect(parsed).not.toHaveProperty("id");
  });
  it("menolak URL gambar langsung agar draft tidak memakai bucket publik", () => {
    expect(
      moduleSchema(modules["objek-pura"]).safeParse({
        ...defaults("objek-pura"),
        image_url: "https://example.com/test.jpg",
      }).success,
    ).toBe(false);
  });
});
it("mencocokkan magic bytes, MIME, dan ekstensi upload", () => {
  const jpeg = new Uint8Array([255, 216, 255, 224]);
  expect(imageExtension(jpeg, "image/jpeg", "foto.jpeg")).toBe("jpg");
  expect(imageExtension(jpeg, "image/png", "foto.png")).toBeNull();
  expect(imageExtension(jpeg, "image/jpeg", "foto.svg")).toBeNull();
  expect(
    imageExtension(
      new TextEncoder().encode('<svg onload="alert(1)">'),
      "image/svg+xml",
      "foto.svg",
    ),
  ).toBeNull();
  expect(MAX_UPLOAD).toBe(3145728);
});
