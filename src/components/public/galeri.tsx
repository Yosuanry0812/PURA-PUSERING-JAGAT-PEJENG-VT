"use client";
import "./galeri.css";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Play, X } from "lucide-react";
import type { GalleryItem } from "@/lib/gallery-files";

const PER_PAGE = 9;

type Folder = { slug: string; label: string };

export function Galeri({
  items,
  folders,
}: {
  items: GalleryItem[];
  folders: readonly Folder[];
}) {
  const [category, setCategory] = useState("semua");
  const [page, setPage] = useState(1);
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);

  const shown =
    category === "semua"
      ? items
      : items.filter((item) => item.category === category);
  const pages = Math.max(1, Math.ceil(shown.length / PER_PAGE));
  const current = Math.min(page, pages);
  const visible = shown.slice((current - 1) * PER_PAGE, current * PER_PAGE);
  const selected = open ? shown[active] : undefined;
  const tabs = [{ slug: "semua", label: "Semua" }, ...folders];
  const labelOf = (slug: string) =>
    folders.find((f) => f.slug === slug)?.label ?? "";

  function pick(slug: string) {
    setCategory(slug);
    setPage(1);
  }
  function show(index: number, el: HTMLButtonElement) {
    trigger.current = el;
    setActive(index);
    setOpen(true);
    dialog.current?.showModal();
    document.body.style.overflow = "hidden";
  }
  function close() {
    setOpen(false);
    dialog.current?.close();
    document.body.style.overflow = "";
    trigger.current?.focus();
  }
  function step(delta: number) {
    setActive((i) => (i + delta + shown.length) % shown.length);
  }
  useEffect(
    () => () => {
      document.body.style.overflow = "";
    },
    [],
  );

  return (
    <>
      <nav className="galeri-tabs" aria-label="Kategori galeri">
        {tabs.map((tab) => (
          <button
            key={tab.slug}
            type="button"
            aria-pressed={category === tab.slug}
            onClick={() => pick(tab.slug)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {visible.length ? (
        <ul className="galeri-grid">
          {visible.map((item, i) => (
            <li key={item.id}>
              <button
                type="button"
                className="galeri-card"
                onClick={(e) =>
                  show((current - 1) * PER_PAGE + i, e.currentTarget)
                }
              >
                <span className="galeri-thumb">
                  {item.type === "video" ? (
                    <>
                      <video
                        src={item.src + "#t=0.1"}
                        preload="metadata"
                        muted
                        playsInline
                        aria-hidden="true"
                        tabIndex={-1}
                      />
                      <span className="galeri-play" aria-hidden="true">
                        <Play size={22} fill="currentColor" />
                      </span>
                    </>
                  ) : (
                    <Image
                      src={item.src}
                      alt=""
                      fill
                      sizes="(max-width: 520px) 100vw, (max-width: 900px) 50vw, 420px"
                    />
                  )}
                </span>
                <span className="galeri-title">
                  {item.title}
                  <small className="sr-only">
                    {item.type === "video" ? " (video)" : " (foto)"}
                  </small>
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="galeri-empty">
          {items.length
            ? "Belum ada foto atau video pada kategori ini."
            : "Foto dan video akan hadir setelah melalui verifikasi dan persetujuan publikasi."}
        </p>
      )}

      {pages > 1 && (
        <nav className="galeri-pages" aria-label="Halaman galeri">
          <button
            type="button"
            aria-label="Halaman sebelumnya"
            disabled={current === 1}
            onClick={() => setPage(current - 1)}
          >
            «
          </button>
          {Array.from({ length: pages }, (_, n) => n + 1).map((n) => (
            <button
              key={n}
              type="button"
              aria-label={"Halaman " + n}
              aria-current={n === current ? "page" : undefined}
              onClick={() => setPage(n)}
            >
              {n}
            </button>
          ))}
          <button
            type="button"
            aria-label="Halaman berikutnya"
            disabled={current === pages}
            onClick={() => setPage(current + 1)}
          >
            »
          </button>
        </nav>
      )}

      <dialog
        ref={dialog}
        className="lightbox"
        aria-labelledby="galeri-judul"
        onCancel={(e) => {
          e.preventDefault();
          close();
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") step(-1);
          if (e.key === "ArrowRight") step(1);
        }}
      >
        <div className="lightbox-inner">
          <button
            type="button"
            className="icon-button lightbox-close"
            onClick={close}
            aria-label="Tutup detail"
          >
            <X />
          </button>
          {selected && (
            <>
              <div className="galeri-stage">
                {selected.type === "video" ? (
                  <video
                    key={selected.id}
                    src={selected.src}
                    controls
                    autoPlay
                    playsInline
                  />
                ) : (
                  <Image
                    key={selected.id}
                    src={selected.src}
                    alt={selected.title}
                    fill
                    sizes="(max-width: 1060px) 95vw, 1060px"
                  />
                )}
              </div>
              <div className="lightbox-caption">
                <div>
                  <span className="eyebrow">{labelOf(selected.category)}</span>
                  <h2 id="galeri-judul">{selected.title}</h2>
                </div>
                <div className="button-row">
                  <button
                    type="button"
                    className="icon-button"
                    onClick={() => step(-1)}
                    aria-label="Media sebelumnya"
                  >
                    <ChevronLeft />
                  </button>
                  <span>
                    {active + 1} / {shown.length}
                  </span>
                  <button
                    type="button"
                    className="icon-button"
                    onClick={() => step(1)}
                    aria-label="Media berikutnya"
                  >
                    <ChevronRight />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </dialog>
    </>
  );
}
