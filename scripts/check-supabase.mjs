import { existsSync } from "node:fs";
import { validatePublicEnvironment } from "./public-env.mjs";
if (existsSync(".env.local")) process.loadEnvFile(".env.local");
validatePublicEnvironment(process.env);
const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
if (!base || !key) {
  console.error("Konfigurasi Supabase belum tersedia.");
  process.exit(1);
}
let failed = false;
const tables = [
  "site_settings",
  "home_content",
  "history_sections",
  "temple_objects",
  "gallery_items",
  "virtual_tour_settings",
  "about_content",
  "contributors",
];
// GET is intentional: an error response to HEAD has no JSON body and can be misleading.
for (const table of tables) {
  const response = await fetch(
    base + "/rest/v1/" + table + "?select=id&limit=0",
    { headers: { apikey: key }, signal: AbortSignal.timeout(15000) },
  );
  const body = await response.json().catch(() => null);
  const ok = response.ok && Array.isArray(body);
  console.log(
    JSON.stringify({
      check: table,
      ok,
      status: response.status,
      code: body?.code ?? null,
    }),
  );
  if (!ok) failed = true;
}
const membership = await fetch(
  base + "/rest/v1/admin_users?select=user_id&limit=0",
  { headers: { apikey: key }, signal: AbortSignal.timeout(15000) },
);
const membershipBody = await membership.json().catch(() => null);
const membershipProtected =
  [401, 403].includes(membership.status) && membershipBody?.code === "42501";
console.log(
  JSON.stringify({
    check: "admin_membership_not_public",
    ok: membershipProtected,
    status: membership.status,
    code: membershipBody?.code ?? null,
  }),
);
if (!membershipProtected) failed = true;
const auth = await fetch(base + "/auth/v1/settings", {
  headers: { apikey: key },
  signal: AbortSignal.timeout(15000),
});
const settings = await auth.json().catch(() => ({}));
const authOk =
  auth.ok &&
  settings.disable_signup === true &&
  settings.external?.anonymous_users !== true;
console.log(
  JSON.stringify({
    check: "auth_settings",
    ok: authOk,
    status: auth.status,
    signupDisabled: settings.disable_signup ?? null,
    anonymousEnabled: settings.external?.anonymous_users ?? null,
  }),
);
if (!authOk) failed = true;
console.log(
  failed
    ? "Konfigurasi hosted belum siap; periksa migration, izin, dan pengaturan Auth."
    : "Pemeriksaan dasar berhasil. Advisors serta pengujian akun admin/non-admin tetap diperlukan.",
);
process.exitCode = failed ? 1 : 0;
