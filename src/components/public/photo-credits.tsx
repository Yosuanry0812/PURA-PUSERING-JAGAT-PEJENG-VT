import { referencePhotos } from "@/lib/reference-media";
export function PhotoCredits() {
  return (
    <details className="photo-credits container" id="sumber-foto">
      <summary>Sumber foto sementara</summary>
      <p>
        Foto gerbang Pura Pusering Jagat oleh{" "}
        <a
          href="https://commons.wikimedia.org/wiki/User:Anandajoti"
          target="_blank"
          rel="noopener noreferrer"
        >
          Anandajoti Bhikkhu
        </a>
        , melalui Wikimedia Commons. Bukan dokumentasi penelitian pengembang.
      </p>
      <ul>
        {referencePhotos.map((p) => (
          <li key={p.key}>
            <a href={p.source} target="_blank" rel="noopener noreferrer">
              {p.title}
            </a>{" "}
            —{" "}
            <a href={p.licenseUrl} target="_blank" rel="noopener noreferrer">
              {p.license}
            </a>
            . Ukuran diperkecil, dikonversi ke WebP, dan sebagian tampilan
            dipotong. Versi foto ini dibagikan dengan lisensi yang sama.
          </li>
        ))}
      </ul>
    </details>
  );
}
