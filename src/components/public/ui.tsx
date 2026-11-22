import Image from "next/image";
import { Compass, ArrowUpRight, ImageIcon } from "lucide-react";
import Link from "next/link";
import { mediaUrl } from "@/lib/urls";
import { referencePhoto } from "@/lib/reference-media";
export function Media({
  path,
  alt = "",
  className = "",
  priority = false,
}: {
  path?: unknown;
  alt?: string;
  className?: string;
  priority?: boolean;
}) {
  const src = mediaUrl(path);
  return src ? (
    <div className={"media " + className}>
      <Image
        src={src}
        alt={alt || referencePhoto(path)?.title || ""}
        fill
        unoptimized={!src.startsWith("/gambar/")}
        sizes="(max-width: 768px) 100vw, 50vw"
        priority={priority}
      />
    </div>
  ) : (
    <div className={"media media-placeholder " + className}>
      <div className="ornament" aria-hidden="true">
        <Compass strokeWidth={0.6} />
      </div>
      <span>Dokumentasi pura</span>
      <small>Foto terverifikasi akan hadir di sini</small>
    </div>
  );
}
export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="eyebrow">
      <span />
      {children}
    </p>
  );
}
export function PageHero({
  label,
  title,
  description,
}: {
  label: string;
  title: string;
  description: string;
}) {
  const split = title.indexOf("Pura");
  return (
    <section className="page-hero">
      <div className="container">
        <Eyebrow>{label}</Eyebrow>
        <h1>
          {split > 0 ? (
            <>
              {title.slice(0, split)}
              <span className="title-gold">{title.slice(split)}</span>
            </>
          ) : (
            title
          )}
        </h1>
        <p>{description}</p>
        <div className="gold-divider" />
      </div>
    </section>
  );
}
export function Empty({
  title = "Dokumentasi sedang dipersiapkan",
  body = "Konten akan ditampilkan setelah diverifikasi dan mendapat persetujuan publikasi.",
}: {
  title?: string;
  body?: string;
}) {
  return (
    <div className="empty-state">
      <ImageIcon size={30} strokeWidth={1} />
      <h3>{title}</h3>
      <p>{body}</p>
    </div>
  );
}
export function ArrowLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link className="text-link" href={href}>
      {children}
      <ArrowUpRight size={17} />
    </Link>
  );
}
export function Prose({ value }: { value: string }) {
  return (
    <div className="prose">
      {value
        .split(/\n\s*\n/)
        .filter(Boolean)
        .map((p, i) => (
          <p key={i}>{p}</p>
        ))}
    </div>
  );
}
