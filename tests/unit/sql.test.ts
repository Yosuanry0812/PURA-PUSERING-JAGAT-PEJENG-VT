import { it, expect } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { parse } from "pgsql-parser";
it("migration dan seed lolos parser PostgreSQL tanpa menjalankan database", async () => {
  const files = readdirSync("supabase/migrations")
    .filter((x) => x.endsWith(".sql"))
    .map((x) => "supabase/migrations/" + x);
  for (const p of [
    ...files,
    "supabase/seed.sql",
    "supabase/tests/verify_cms.sql",
  ]) {
    expect(await parse(readFileSync(p, "utf8"))).toBeTruthy();
  }
});
