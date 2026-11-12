import Link from "next/link";
export default function NotFound() {
  return (
    <main id="main" className="container standalone">
      <p className="eyebrow">404</p>
      <h1>Halaman tidak ditemukan.</h1>
      <Link className="button button-gold" href="/">
        Kembali ke Beranda
      </Link>
    </main>
  );
}
