import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { readGallery, titleFromFile } from "@/lib/gallery-files";

vi.mock("server-only", () => ({}));

let root = "";
beforeAll(async () => {
  root = await mkdtemp(path.join(tmpdir(), "galeri-"));
  await mkdir(path.join(root, "utama-mandala"));
  await mkdir(path.join(root, "sejarah"));
  for (const f of ["10-b.JPG", "2-a.png", ".gitkeep", "catatan.txt", "x.mov"])
    await writeFile(path.join(root, "utama-mandala", f), "");
  await writeFile(path.join(root, "sejarah", "asal usul.mp4"), "");
});
afterAll(() => rm(root, { recursive: true, force: true }));

describe("Berkas galeri", () => {
  it("membaca foto/video per folder, urut alami, mengabaikan berkas lain", async () => {
    const items = await readGallery(root);
    expect(items.map((i) => i.id)).toEqual([
      "utama-mandala/2-a.png",
      "utama-mandala/10-b.JPG",
      "sejarah/asal usul.mp4",
    ]);
    expect(items[2]).toMatchObject({
      type: "video",
      category: "sejarah",
      src: "/galeri/sejarah/asal%20usul.mp4",
      title: "Asal Usul",
    });
  });
  it("memakai nama, penjelasan, dan urutan tabel untuk objek terdaftar", async () => {
    const dir = await mkdtemp(path.join(tmpdir(), "galeri-info-"));
    await mkdir(path.join(dir, "nista-mandala"));
    for (const f of ["Wantilan.jpeg", "Bale saka pat 2.jpeg", "Lain.jpeg"])
      await writeFile(path.join(dir, "nista-mandala", f), "");
    const items = await readGallery(dir);
    await rm(dir, { recursive: true, force: true });
    expect(items.map((i) => i.title)).toEqual([
      "Bale Saka Pat",
      "Wantilan",
      "Lain",
    ]);
    expect(items[0].description).toMatch(/pecalang/);
    expect(items[2].description).toBe("");
  });
  it("folder yang belum ada tidak membuat galeri gagal", async () => {
    expect(await readGallery(path.join(root, "tidak-ada"))).toEqual([]);
  });
  it("membuat judul dari nama berkas", () => {
    expect(titleFromFile("01-jaba-tengah.jpg")).toBe("Jaba Tengah");
    expect(titleFromFile("Bale Pemangku.webp")).toBe("Bale Pemangku");
  });
});
