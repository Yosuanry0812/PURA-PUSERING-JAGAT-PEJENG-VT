export const MAX_UPLOAD = 3 * 1024 * 1024;
export function imageExtension(bytes: Uint8Array, mime: string, name: string) {
  const ext = name.toLowerCase().split(".").pop();
  if (
    mime === "image/jpeg" &&
    ["jpg", "jpeg"].includes(ext ?? "") &&
    bytes[0] === 255 &&
    bytes[1] === 216 &&
    bytes[2] === 255
  )
    return "jpg";
  if (
    mime === "image/png" &&
    ext === "png" &&
    [137, 80, 78, 71, 13, 10, 26, 10].every((v, i) => bytes[i] === v)
  )
    return "png";
  if (
    mime === "image/webp" &&
    ext === "webp" &&
    String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" &&
    String.fromCharCode(...bytes.slice(8, 12)) === "WEBP"
  )
    return "webp";
  return null;
}
