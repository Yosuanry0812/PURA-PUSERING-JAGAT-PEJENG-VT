"use client";
import { useEffect, useRef } from "react";

/**
 * Animasi muncul saat di-scroll untuk elemen bertanda `data-reveal`.
 * Tanpa JavaScript atau dengan prefers-reduced-motion, semua elemen tetap terlihat.
 */
export function Reveal({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    if (
      typeof window.matchMedia !== "function" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !("IntersectionObserver" in window)
    )
      return;
    const items = root.querySelectorAll<HTMLElement>("[data-reveal]");
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.add("is-in");
          io.unobserve(e.target);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -5% 0px" },
    );
    root.classList.add("reveal-ready");
    items.forEach((el) => io.observe(el));
    return () => {
      io.disconnect();
      root.classList.remove("reveal-ready");
    };
  }, []);
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
