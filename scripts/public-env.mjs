/** Reject dangerous NEXT_PUBLIC configuration before Next.js compiles browser assets. */
export function validatePublicEnvironment(environment) {
  for (const [name, value] of Object.entries(environment)) {
    if (
      name.startsWith("NEXT_PUBLIC_") &&
      typeof value === "string" &&
      value.startsWith("sb_secret_")
    ) {
      throw new Error(
        "Secret key dilarang pada environment NEXT_PUBLIC. Nilai disembunyikan.",
      );
    }
  }
  const url = environment.NEXT_PUBLIC_SUPABASE_URL;
  const key = environment.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url && !key) return;
  if (!url || !key)
    throw new Error("URL dan publishable key Supabase harus diisi bersama.");
  if (!key.startsWith("sb_publishable_"))
    throw new Error(
      "Aplikasi membutuhkan publishable key Supabase, bukan secret/service role key.",
    );
  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    throw new Error("Format URL Supabase tidak valid.");
  }
  if (
    parsed.protocol !== "https:" ||
    parsed.username ||
    parsed.password ||
    parsed.pathname !== "/" ||
    parsed.search ||
    parsed.hash
  ) {
    throw new Error(
      "Gunakan URL dasar Supabase HTTPS tanpa /rest/v1/, kredensial, query, atau fragment.",
    );
  }
}
