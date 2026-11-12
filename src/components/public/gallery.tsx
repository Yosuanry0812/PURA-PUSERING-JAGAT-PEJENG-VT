"use client";
import { useRef, useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight, Play, ArrowUpRight } from "lucide-react";
import type { ContentRow } from "@/lib/content";
import { Media } from "./ui";
import { videoUrl } from "@/lib/urls";
const value = (r: ContentRow, k: string) =>
  typeof r[k] === "string" ? (r[k] as string) : "";
export function Gallery({ items }: { items: ContentRow[] }) {
  const [active, setActive] = useState(0);
  const dialog = useRef<HTMLDialogElement>(null);
  const lastTrigger = useRef<HTMLButtonElement | null>(null);
  const selected = items[active];
  const isOpen = useRef(false);
  function close() {
    dialog.current?.close();
    isOpen.current = false;
    document.body.style.overflow = "";
    lastTrigger.current?.focus();
  }
  function step(delta: number) {
    setActive((i) => (i + delta + items.length) % items.length);
  }
  useEffect(
    () => () => {
      document.body.style.overflow = "";
    },
    [],
  );
  return (
    <>
      <div className="gallery-grid">
        {items.map((item, i) => (
          <button
            className="gallery-card"
            key={item.id}
            onClick={(e) => {
              lastTrigger.current = e.currentTarget;
              setActive(i);
              dialog.current?.showModal();
              isOpen.current = true;
              document.body.style.overflow = "hidden";
            }}
          >
            <Media
              path={
                item.media_type === "video"
                  ? item.thumbnail_url
                  : item.media_url
              }
              alt={value(item, "image_alt")}
            />
            <span className="gallery-card-caption">
              <small>{value(item, "category")}</small>
              <strong>{value(item, "title")}</strong>
              <span className="gallery-open">
                {item.media_type === "video" ? (
                  <Play size={19} />
                ) : (
                  <ArrowUpRight size={19} />
                )}
              </span>
            </span>
          </button>
        ))}
      </div>
      <dialog
        ref={dialog}
        className="lightbox"
        aria-labelledby="lightbox-title"
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
            className="icon-button lightbox-close"
            onClick={close}
            aria-label="Tutup detail"
          >
            <X />
          </button>
          {selected && (
            <>
              {selected.media_type === "video" ? (
                <div className="video-placeholder">
                  <Play size={50} strokeWidth={1} />
                  {videoUrl(value(selected, "video_url")) && (
                    <a
                      className="button button-gold"
                      href={value(selected, "video_url")}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Tonton dokumentasi
                      <ArrowUpRight size={16} />
                    </a>
                  )}
                </div>
              ) : (
                <Media
                  path={selected.media_url}
                  alt={value(selected, "image_alt")}
                />
              )}
              <div className="lightbox-caption">
                <div>
                  <span className="eyebrow">{value(selected, "category")}</span>
                  <h2 id="lightbox-title">{value(selected, "title")}</h2>
                  <p>{value(selected, "description")}</p>
                </div>
                <div className="button-row">
                  <button
                    className="icon-button"
                    onClick={() => step(-1)}
                    aria-label="Media sebelumnya"
                  >
                    <ChevronLeft />
                  </button>
                  <span>
                    {active + 1} / {items.length}
                  </span>
                  <button
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
