import "server-only";
import { cache } from "react";
import { configured } from "./supabase/config";
import { publicClient } from "./supabase/server";
export type ContentRow = {
  id: string | number;
  [key: string]: string | number | boolean | null;
};
export type Collection = {
  rows: ContentRow[];
  state: "ready" | "unconfigured" | "error";
  count: number;
};
export const content = cache(
  async (
    table: string,
    options: {
      limit?: number;
      page?: number;
      category?: string;
      featured?: boolean;
    } = {},
  ): Promise<Collection> => {
    if (!configured()) return { rows: [], state: "unconfigured", count: 0 };
    try {
      let q = publicClient()
        .from(table)
        .select("*", { count: "exact" })
        .retry(false);
      if (
        ["history_sections", "temple_objects", "gallery_items"].includes(table)
      )
        q = q.eq("status", "published").order("sort_order").order("id");
      if (["gallery_items", "temple_objects"].includes(table))
        q = q.eq("publication_approved", true);
      if (["home_content", "about_content"].includes(table))
        q = q.eq("is_published", true);
      if (table === "virtual_tour_settings") q = q.eq("is_published", true);
      if (table === "contributors")
        q = q.eq("is_published", true).order("sort_order");
      if (options.category) q = q.eq("category", options.category);
      if (options.featured) q = q.eq("is_featured", true);
      const limit = options.limit ?? 48;
      const start = ((options.page ?? 1) - 1) * limit;
      const { data, error, count } = await q.range(start, start + limit - 1);
      if (error) return { rows: [], state: "error", count: 0 };
      return { rows: data as ContentRow[], state: "ready", count: count ?? 0 };
    } catch {
      return { rows: [], state: "error", count: 0 };
    }
  },
);
export function text(row: ContentRow | undefined, key: string, fallback = "") {
  const v = row?.[key];
  return typeof v === "string" && v ? v : fallback;
}
export async function galleryCategories() {
  if (!configured()) return [];
  const { data, error } = await publicClient()
    .rpc("gallery_categories")
    .retry(false);
  return error ? [] : (data as { category: string }[]).map((x) => x.category);
}
