import type { ContentRow } from "@/lib/content";
// @vitest-environment jsdom
import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { Gallery } from "@/components/public/gallery";
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
const items: ContentRow[] = [
  {
    id: "one",
    title: "Dokumentasi pengujian satu",
    category: "Kategori uji",
    media_type: "photo",
    media_url: "",
    image_alt: "Uji satu",
    description: "Deskripsi satu",
  },
  {
    id: "two",
    title: "Dokumentasi pengujian dua",
    category: "Kategori uji",
    media_type: "video",
    thumbnail_url: "",
    video_url: "https://youtu.be/test",
    description: "Deskripsi dua",
  },
];
describe("Galeri", () => {
  it("membuka detail, navigasi keyboard, menutup dan mengembalikan fokus", () => {
    render(<Gallery items={items} />);
    const trigger = screen.getByRole("button", {
      name: /Dokumentasi pengujian satu/,
    });
    trigger.focus();
    fireEvent.click(trigger);
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("open");
    expect(
      screen.getByRole("heading", { name: "Dokumentasi pengujian satu" }),
    ).toBeInTheDocument();
    fireEvent.keyDown(dialog, { key: "ArrowRight" });
    expect(
      screen.getByRole("heading", { name: "Dokumentasi pengujian dua" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Tonton dokumentasi/ }),
    ).toHaveAttribute("href", "https://youtu.be/test");
    fireEvent.click(screen.getByRole("button", { name: "Tutup detail" }));
    expect(dialog).not.toHaveAttribute("open");
    expect(trigger).toHaveFocus();
    expect(document.body.style.overflow).toBe("");
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
