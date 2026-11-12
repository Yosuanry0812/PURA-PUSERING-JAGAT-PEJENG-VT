"use client";

import { useState } from "react";
import { ArrowUpRight, Compass } from "lucide-react";

export function TourLaunch({ url }: { url?: string }) {
  const [showStatus, setShowStatus] = useState(false);
  return url ? (
    <a
      className="button button-gold"
      href={url}
      target="_blank"
      rel="noopener noreferrer"
    >
      Buka Virtual Tour 360° <ArrowUpRight size={18} />
    </a>
  ) : (
    <div className="tour-launch">
      <button
        type="button"
        className="button button-gold"
        aria-expanded={showStatus}
        aria-controls="tour-availability"
        onClick={() => setShowStatus((shown) => !shown)}
      >
        Buka Virtual Tour 360° <Compass size={18} />
      </button>
      <p id="tour-availability" role="status" hidden={!showStatus}>
        Virtual tour belum tersedia. Silakan kembali setelah tur diterbitkan.
        Sementara itu, Anda dapat menjelajahi halaman sejarah.
      </p>
    </div>
  );
}
