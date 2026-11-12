import type { ContentRow } from "./content";
import { validTour } from "./urls";

// URL environment disiapkan untuk output HTML5 sebelum CMS tersedia.
export function resolveTourUrl(
  row: ContentRow | undefined,
  fallback: string,
  allowedHosts: string,
) {
  const hosts = allowedHosts
    .split(",")
    .map((host) => host.trim().toLowerCase());
  const cmsUrl =
    row?.is_published === true && typeof row.tour_url === "string"
      ? row.tour_url
      : "";
  if (validTour(cmsUrl, hosts)) return cmsUrl;
  return validTour(fallback, hosts) ? fallback : "";
}
