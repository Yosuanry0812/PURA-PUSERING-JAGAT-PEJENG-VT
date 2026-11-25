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
const sumber =
  "https://desa-pejeng-home.vercel.app/artikel/pura-pusering-jagat";
const catatan = {
  rows: [
    {
      id: 1,
      slug: "kisah-pengelola",
      title: "Kisah dari pengelola",
      content: "Narasi terbit dari CMS.",
    },
  ],
  state: "ready" as const,
  count: 1,
};
describe("Narasi sejarah", () => {
  it("menampilkan narasi editorial saat CMS belum dapat diakses", async () => {
    respond({ rows: [], state: "error", count: 0 });
    render(await History());
    expect(
      screen.getByRole("heading", { name: "Jejak peradaban Bali Kuno" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Bejana Pejeng" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: "Tri Mandala: tiga ruang menuju kesucian",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Baca artikel rujukan lengkap/ }),
    ).toHaveAttribute("href", sumber);
    expect(
      screen.queryByRole("heading", { name: "Catatan tambahan" }),
    ).not.toBeInTheDocument();
  });
  it("tetap menampilkan narasi editorial ketika CMS kosong tanpa catatan tambahan", async () => {
    respond({ rows: [], state: "ready", count: 0 });
    render(await History());
    expect(
      screen.getByRole("heading", { name: "Di titik tengah semesta" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Catatan tambahan" }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("navigation", { name: "Bagian sejarah" }),
    ).toBeInTheDocument();
  });
  it("menampilkan narasi CMS terbit sebagai catatan tambahan", async () => {
    respond(catatan);
    render(await History());
    expect(
      screen.getByRole("heading", { name: "Catatan tambahan" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Kisah dari pengelola" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Jejak peradaban Bali Kuno" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Catatan tambahan/ }),
    ).toHaveAttribute("href", "#catatan-tambahan");
  });
});
