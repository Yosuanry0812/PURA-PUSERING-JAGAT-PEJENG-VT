import type { GalleryItem } from "@/lib/gallery-files";
// @vitest-environment jsdom
import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, act, within } from "@testing-library/react";
import { Galeri } from "@/components/public/galeri";
import { TourViewer } from "@/components/virtual-tour/viewer";
import { Prose } from "@/components/public/ui";
vi.mock("next/image", () => ({
  default: ({
    fill,
    unoptimized,
    priority,
    sizes,
    ...props
  }: Record<string, unknown>) => {
    void fill;
    void unoptimized;
    void priority;
    void sizes;
    return React.createElement("img", props);
  },
}));
const folders = [
  { slug: "nista-mandala", label: "Nista Mandala" },
  { slug: "sejarah", label: "Sejarah" },
];
const photo = (n: number): GalleryItem => ({
  id: "nista-mandala/foto-" + n + ".jpg",
  category: "nista-mandala",
  type: "image",
  chroma: false,
  src: "/galeri/nista-mandala/foto-" + n + ".jpg",
  title: "Foto " + n,
  description: "Penjelasan foto " + n,
});
const video: GalleryItem = {
  id: "sejarah/asal-usul.mp4",
  category: "sejarah",
  type: "video",
  chroma: false,
  src: "/galeri/sejarah/asal-usul.mp4",
  title: "Asal Usul",
  description: "",
};
describe("Galeri", () => {
  it("memfilter lewat tab, membuka detail video, navigasi keyboard, menutup, fokus kembali", () => {
    render(<Galeri items={[photo(1), photo(2), video]} folders={folders} />);
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
    expect(screen.getByText("Penjelasan foto 2")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Sejarah" }));
    expect(screen.getAllByRole("listitem")).toHaveLength(1);
    fireEvent.click(screen.getByRole("button", { name: "Semua" }));
    const trigger = screen.getByRole("button", { name: /Foto 1/ });
    trigger.focus();
    fireEvent.click(trigger);
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("open");
    expect(
      within(dialog).getByRole("heading", { name: "Foto 1" }),
    ).toBeInTheDocument();
    expect(within(dialog).getByText("Penjelasan foto 1")).toBeInTheDocument();
    fireEvent.keyDown(dialog, { key: "ArrowLeft" });
    expect(
      within(dialog).getByRole("heading", { name: "Asal Usul" }),
    ).toBeInTheDocument();
    expect(dialog.querySelector("video")).toHaveAttribute(
      "src",
      "/galeri/sejarah/asal-usul.mp4",
    );
    fireEvent.click(screen.getByRole("button", { name: "Tutup detail" }));
    expect(dialog).not.toHaveAttribute("open");
    expect(dialog.querySelector("video")).toBeNull();
    expect(trigger).toHaveFocus();
    expect(document.body.style.overflow).toBe("");
  });
  it("membagi 9 media per halaman dan menampilkan pesan bila kategori kosong", () => {
    const many = Array.from({ length: 11 }, (_, n) => photo(n + 1));
    render(<Galeri items={many} folders={folders} />);
    expect(screen.getAllByRole("listitem")).toHaveLength(9);
    fireEvent.click(screen.getByRole("button", { name: "Halaman 2" }));
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    fireEvent.click(screen.getByRole("button", { name: "Sejarah" }));
    expect(screen.getByText(/Belum ada foto atau video/)).toBeInTheDocument();
    expect(
      screen.queryByRole("navigation", { name: "Halaman galeri" }),
    ).toBeNull();
  });
});
describe("Tur eksternal", () => {
  it("memuat iframe setelah pengunjung memilih mulai dan menyediakan URL asli", () => {
    const { container } = render(
      <TourViewer url="https://tour.example.com/" title="Tur pengujian" />,
    );
    expect(container.querySelector("iframe")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Muat Virtual Tour" }));
    expect(screen.getByTitle("Tur pengujian")).toHaveAttribute(
      "src",
      "https://tour.example.com/",
    );
    expect(screen.getByRole("status")).toHaveTextContent("Memuat");
    fireEvent.load(screen.getByTitle("Tur pengujian"));
    expect(screen.queryByRole("status")).toBeNull();
    expect(
      screen.getByRole("link", { name: "Buka Virtual Tour" }),
    ).toHaveAttribute("rel", "noopener noreferrer");
  });
  it("menampilkan fallback dan retry saat batas waktu pemuatan terlewati", () => {
    vi.useFakeTimers();
    render(
      <TourViewer url="https://tour.example.com/" title="Tur uji gagal" />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Muat Virtual Tour" }));
    act(() => {
      vi.advanceTimersByTime(15000);
    });
    expect(
      screen.getByRole("link", { name: /Buka URL asli/ }),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Coba kembali/ }));
    expect(screen.getByRole("status")).toHaveTextContent("Memuat");
  });
});
it("konten teks tidak mengeksekusi HTML atau script", () => {
  const { container } = render(
    <Prose
      value={"<script>alert(1)</script>\n\n<img src=x onerror=alert(1)>"}
    />,
  );
  expect(container.querySelector("script")).toBeNull();
  expect(container.querySelector("img")).toBeNull();
  expect(screen.getByText("<script>alert(1)</script>")).toBeInTheDocument();
});

// Tombol tetap memberi umpan balik sebelum URL HTML5 diterima.
describe("Tombol peluncuran tur", () => {
  it("menjelaskan ketersediaan tanpa membuat iframe atau URL palsu", async () => {
    const { TourLaunch } = await import("@/components/virtual-tour/launch");
    render(<TourLaunch />);
    const button = screen.getByRole("button", {
      name: "Buka Virtual Tour 360°",
    });
    expect(button).toBeEnabled();
    fireEvent.click(button);
    expect(button).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("status")).toHaveTextContent(
      "Virtual tour belum tersedia.",
    );
    expect(screen.queryByRole("link")).toBeNull();
  });
  it("membuka URL HTML5 yang telah dikonfigurasi di tab baru", async () => {
    const { TourLaunch } = await import("@/components/virtual-tour/launch");
    render(<TourLaunch url="https://tour.example.com/html5/index.html" />);
    const link = screen.getByRole("link", { name: "Buka Virtual Tour 360°" });
    expect(link).toHaveAttribute(
      "href",
      "https://tour.example.com/html5/index.html",
    );
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });
});
