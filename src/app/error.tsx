"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main id="main" className="container standalone">
      <h1>Halaman belum dapat dimuat.</h1>
      <p>Silakan coba kembali beberapa saat lagi.</p>
      <button className="button button-gold" onClick={reset}>
        Coba kembali
      </button>
    </main>
  );
}
