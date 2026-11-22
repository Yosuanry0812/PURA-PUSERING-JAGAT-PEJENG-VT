import { referencePhoto } from "./reference-media";
export function safeHttps(value: string) {
  try {
    const u = new URL(value);
    return u.protocol === "https:" && !u.username && !u.password ? u : null;
  } catch {
    return null;
  }
}
export function validTour(value: string, hosts: string[]) {
  const url = safeHttps(value);
  return Boolean(
    url && hosts.includes(url.hostname.toLowerCase()) && !url.port,
  );
}
export function mediaUrl(value: unknown) {
  if (
    typeof value === "string" &&
    /^gambar\/[a-zA-Z0-9._-]+(\/[a-zA-Z0-9._-]+)*$/.test(value) &&
    !value.includes("..")
  )
    return "/" + value;
  const reference = referencePhoto(value);
  if (reference) return reference.src;
  return typeof value === "string" &&
    /^[a-z-]+\/[a-zA-Z0-9._/-]+$/.test(value) &&
    !value.includes("..")
    ? "/media/" + value
    : "";
}
export function videoUrl(value: string) {
  const u = safeHttps(value);
  return u &&
    [
      "www.youtube.com",
      "youtube.com",
      "youtu.be",
      "vimeo.com",
      "www.vimeo.com",
    ].includes(u.hostname)
    ? u.href
    : null;
}
