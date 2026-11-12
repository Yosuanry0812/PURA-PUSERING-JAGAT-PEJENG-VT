import { describe, expect, it } from "vitest";
import { resolveTourUrl } from "@/lib/tour";

describe("Konfigurasi URL tur", () => {
  const url = "https://tour.example.com/html5/index.html";
  it("memakai URL HTML5 environment ketika CMS belum tersedia", () => {
    expect(resolveTourUrl(undefined, url, " tour.example.com ")).toBe(url);
  });
  it("mengutamakan URL CMS yang terbit dan diizinkan", () => {
    expect(
      resolveTourUrl(
        { id: 1, is_published: true, tour_url: url },
        "https://other.example.com/",
        "tour.example.com,other.example.com",
      ),
    ).toBe(url);
    expect(
      resolveTourUrl(
        { id: 1, is_published: false, tour_url: url },
        "",
        "tour.example.com",
      ),
    ).toBe("");
  });
  it("menolak URL tanpa host yang diizinkan atau memakai protokol berbahaya", () => {
    for (const value of [
      url,
      "javascript:alert(1)",
      "https://tour.example.com.attacker.test/",
      "https://tour.example.com:8443/",
    ]) {
      expect(resolveTourUrl(undefined, value, "")).toBe("");
    }
    expect(
      resolveTourUrl(
        undefined,
        "https://tour.example.com.attacker.test/",
        "tour.example.com",
      ),
    ).toBe("");
  });
});
