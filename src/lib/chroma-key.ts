// Chroma key (bluescreen) pada data piksel RGBA, dihitung di ruang warna YCbCr
// supaya kecerahan latar yang bergradasi tidak mengganggu hasil.
export type Rgb = [number, number, number];

const cb = (r: number, g: number, b: number) =>
  128 - 0.168736 * r - 0.331264 * g + 0.5 * b;
const cr = (r: number, g: number, b: number) =>
  128 + 0.5 * r - 0.418688 * g - 0.081312 * b;

/** Warna latar = rata-rata blok 8x8 di empat sudut frame. */
export function estimateKey(
  data: Uint8ClampedArray,
  width: number,
  height: number,
): Rgb {
  const size = Math.min(8, width, height);
  const sum = [0, 0, 0];
  let n = 0;
  for (const x0 of [0, width - size])
    for (const y0 of [0, height - size])
      for (let y = y0; y < y0 + size; y++)
        for (let x = x0; x < x0 + size; x++) {
          const i = (y * width + x) * 4;
          sum[0] += data[i];
          sum[1] += data[i + 1];
          sum[2] += data[i + 2];
          n++;
        }
  return [sum[0] / n, sum[1] / n, sum[2] / n];
}

/**
 * Menghapus warna `key`: jarak kromatik <= low → transparan, >= high → utuh,
 * di antaranya transparan sebagian. Piksel tepi dipisahkan dari sisa warna
 * latar (unmix) agar tidak ada garis biru di sekeliling objek.
 */
export function chromaKey(
  data: Uint8ClampedArray,
  key: Rgb,
  low = 32,
  high = 78,
) {
  const kcb = cb(...key);
  const kcr = cr(...key);
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const d = Math.hypot(cb(r, g, b) - kcb, cr(r, g, b) - kcr);
    if (d >= high) continue;
    if (d <= low) {
      data[i + 3] = 0;
      continue;
    }
    const t = (d - low) / (high - low);
    const a = t * t * (3 - 2 * t);
    data[i] = Math.max(0, Math.min(255, (r - (1 - a) * key[0]) / a));
    data[i + 1] = Math.max(0, Math.min(255, (g - (1 - a) * key[1]) / a));
    data[i + 2] = Math.max(0, Math.min(255, (b - (1 - a) * key[2]) / a));
    data[i + 3] = Math.round(a * 255);
  }
}
