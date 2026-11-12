// @vitest-environment jsdom
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import type { Collection } from "@/lib/content";
import { content } from "@/lib/content";
import History from "@/app/(public)/sejarah/page";

vi.mock("@/lib/content", () => ({
  content: vi.fn(),
  text: (
    row: Record<string, unknown> | undefined,
    key: string,
    fallback = "",
  ) => (typeof row?.[key] === "string" ? row[key] : fallback),
}));
vi.mock("next/image", () => ({ default: () => null }));

const respond = (value: Collection) =>
  vi.mocked(content).mockResolvedValue(value);
describe("Narasi sejarah", () => {
  it("menampilkan narasi rujukan saat CMS belum dapat diakses", async () => {
    respond({ rows: [], state: "error", count: 0 });
    render(await History());
    expect(
      screen.getByRole("heading", { name: "Jejak Bali Kuno di Pejeng" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Bejana Pejeng merupakan/)).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Baca artikel rujukan lengkap/ }),
    ).toHaveAttribute(
      "href",
      "https://desa-pejeng-home.vercel.app/artikel/pura-pusering-jagat",
    );
  });
  it("tidak memunculkan ulang narasi ketika CMS berhasil memberi konten kosong", async () => {
    respond({ rows: [], state: "ready", count: 0 });
    render(await History());
    expect(
      screen.queryByRole("heading", { name: "Jejak Bali Kuno di Pejeng" }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByText("Kisah sedang disusun dengan cermat"),
    ).toBeInTheDocument();
  });
  it("mengutamakan narasi CMS terbit", async () => {
    respond({
      rows: [
        {
          id: 1,
          slug: "kisah-pengelola",
          title: "Kisah dari pengelola",
          content: "Narasi terbit dari CMS.",
        },
      ],
      state: "ready",
      count: 1,
    });
    render(await History());
    expect(
      screen.getByRole("heading", { name: "Kisah dari pengelola" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Jejak Bali Kuno di Pejeng" }),
    ).not.toBeInTheDocument();
  });
});
