import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
const routes = [
  "/",
  "/sejarah",
  "/virtual-tour",
  "/galeri",
  "/tentang-kami",
  "/admin/login",
];
for (const route of routes) {
  test("akses dan aksesibilitas " + route, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    await expect(page.locator("main")).toBeVisible();
    await page.evaluate(() =>
      Promise.all(
        document
          .getAnimations()
          .filter((a) => a.effect?.getTiming().iterations !== Infinity)
          .map((a) => a.finished.catch(() => undefined)),
      ),
    );
    expect(await page.locator("h1,h2").count()).toBeGreaterThan(0);
    const axe = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(axe.violations).toEqual([]);
    expect(errors).toEqual([]);
  });
}
test("seluruh route admin menolak pengunjung", async ({ page }) => {
  for (const name of [
    "dashboard",
    "beranda",
    "sejarah",
    "objek-pura",
    "galeri",
    "virtual-tour",
    "tentang-kami",
    "pengaturan",
    "kontributor",
  ]) {
    await page.goto("/admin/" + name);
    await expect(page).toHaveURL(/\/admin\/login/);
  }
});
test("tanpa konfigurasi tur tidak ada iframe kosong", async ({ page }) => {
  await page.goto("/virtual-tour");
  await expect(
    page.getByRole("heading", {
      name: "Perjalanan virtual sedang dipersiapkan.",
    }),
  ).toBeVisible();
  await expect(page.locator("iframe")).toHaveCount(0);
});
test("media privat dan path tidak sah tidak terbuka", async ({ request }) => {
  for (const url of [
    "/media/gallery/550e8400-e29b-41d4-a716-446655440000.jpg",
    "/media/invalid.txt",
  ])
    expect((await request.get(url)).status()).toBe(404);
});
test("menu mobile dapat dipakai dengan keyboard dan Escape", async ({
  page,
}) => {
  await page.setViewportSize({ width: 393, height: 852 });
  await page.goto("/");
  const toggle = page.locator('button[aria-controls="public-menu"]');
  await expect(toggle).toBeEnabled();
  await toggle.focus();
  await page.keyboard.press("Enter");
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Escape");
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(toggle).toBeFocused();
  await toggle.click();
  await page
    .locator("#public-menu")
    .getByRole("link", { name: "Sejarah", exact: true })
    .click();
  await expect(page).toHaveURL(/\/sejarah$/);
});
test("layout tanpa overflow pada ponsel tablet dan desktop", async ({
  page,
}) => {
  for (const width of [320, 393, 650, 820, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of routes) {
      await page.goto(route);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth > window.innerWidth,
        ),
        route + " pada " + width,
      ).toBe(false);
    }
  }
});
test("SEO dan tidak ada tautan admin di navbar publik", async ({
  page,
  request,
}) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("lang", "id");
  await expect(page.locator('.public-nav a[href^="/admin"]')).toHaveCount(0);
  await page.goto("/admin/login");
  await expect(page.locator("meta[name=robots]")).toHaveAttribute(
    "content",
    /noindex/,
  );
  expect((await request.get("/robots.txt")).status()).toBe(200);
  expect((await request.get("/sitemap.xml")).status()).toBe(200);
});

test("narasi rujukan dan jalur menuju virtual tour tersedia", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .locator("main")
    .getByRole("link", { name: "Jelajahi Virtual Tour" })
    .first()
    .click();
  await expect(page).toHaveURL(/\/virtual-tour$/);
  await page.getByRole("button", { name: "Buka Virtual Tour 360°" }).click();
  await expect(page.getByRole("status")).toContainText(
    "Virtual tour belum tersedia.",
  );
  await page.goto("/sejarah");
  await expect(
    page.getByRole("heading", { name: "Jejak Bali Kuno di Pejeng" }),
  ).toBeVisible();
  const toc = page.getByRole("navigation", { name: "Bagian sejarah" });
  await toc.getByRole("link", { name: /Peninggalan dan makna/ }).click();
  await expect(page).toHaveURL(/#peninggalan-dan-makna$/);
  await expect(page.locator("#peninggalan-dan-makna")).toBeInViewport();
});
