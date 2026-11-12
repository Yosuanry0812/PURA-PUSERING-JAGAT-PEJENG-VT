import photos from "../../public/images/reference/attribution.json";
export const referencePhotos = photos;
export function referencePhoto(value: unknown) {
  return referencePhotos.find((p) => p.path === value);
}
export function allowsReference(table: string) {
  return [
    "site_settings",
    "home_content",
    "history_sections",
    "about_content",
    "virtual_tour_settings",
  ].includes(table);
}
