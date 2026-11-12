"use client";
import { useState, useEffect, useRef } from "react";
import { Maximize, ExternalLink, RotateCw } from "lucide-react";
export function TourViewer({ url, title }: { url: string; title: string }) {
  const [state, setState] = useState<
    "idle" | "loading" | "loaded" | "timeout" | "error"
  >("idle");
  const [attempt, setAttempt] = useState(0);
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (state !== "loading") return;
    const timer = setTimeout(() => setState("timeout"), 15000);
    return () => clearTimeout(timer);
  }, [state, attempt]);
  return (
    <div className="tour-viewer">
      <div className="tour-toolbar">
        <span>VIRTUAL TOUR · 360°</span>
        <div>
          <a href={url} target="_blank" rel="noopener noreferrer">
            Buka Virtual Tour
            <ExternalLink size={15} />
          </a>
          {state !== "idle" && (
            <button
              onClick={() =>
                box.current?.requestFullscreen().catch(() => setState("error"))
              }
              aria-label="Layar penuh"
            >
              <Maximize size={18} />
            </button>
          )}
        </div>
      </div>
      <div className="iframe-container" ref={box}>
        {state === "idle" ? (
          <div className="viewer-message">
            <h2>Jelajahi Pura Pusering Jagat</h2>
            <p>
              Mulai pengalaman interaktif 360° di area yang telah disetujui.
            </p>
            <button
              className="button button-gold"
              onClick={() => setState("loading")}
            >
              Muat Virtual Tour
            </button>
          </div>
        ) : (
          <>
            <iframe
              key={attempt}
              src={url}
              title={title}
              loading="lazy"
              allow="fullscreen; gyroscope; accelerometer"
              allowFullScreen
              sandbox="allow-scripts allow-same-origin allow-pointer-lock allow-popups"
              referrerPolicy="strict-origin-when-cross-origin"
              onLoad={() => setState("loaded")}
              onError={() => setState("error")}
            />
            {state === "loading" && (
              <div className="viewer-loading" role="status">
                Memuat pengalaman 360°…
              </div>
            )}
          </>
        )}
      </div>
      {["error", "timeout"].includes(state) && (
        <div className="notice" role="status">
          Tur belum dapat dimuat. Server panorama mungkin membatasi penyematan.{" "}
          <a href={url} target="_blank" rel="noopener noreferrer">
            Buka URL asli ↗
          </a>
          <button
            onClick={() => {
              setAttempt((x) => x + 1);
              setState("loading");
            }}
          >
            <RotateCw size={15} />
            Coba kembali
          </button>
        </div>
      )}
      <p className="small muted">
        Jika layar tur kosong atau diblokir oleh penyedia, gunakan “Buka Virtual
        Tour”.
      </p>
    </div>
  );
}
