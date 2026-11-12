import Link from "next/link";
export function Mark() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className="brand-mark">
      <path d="M32 6 38 16H26L32 6Zm-9 16h18M19 29h26M15 37h34M24 22v27m16-27v27M10 51h44M6 57h52M29 37v14m6-14v14" />
      <circle cx="32" cy="32" r="30" opacity=".3" />
    </svg>
  );
}
export function Brand({ name = "Pura Pusering Jagat" }: { name?: string }) {
  return (
    <Link href="/" className="brand" aria-label={name + " — Beranda"}>
      <Mark />
      <span>
        {name}
        <small>PEJENG · BALI</small>
      </span>
    </Link>
  );
}
