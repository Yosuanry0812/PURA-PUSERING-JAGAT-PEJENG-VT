"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect, useSyncExternalStore } from "react";
import { Menu, X } from "lucide-react";
import { Brand } from "./brand";
import { links } from "@/lib/navigation";
const subscribe = () => () => {};
const clientReady = () => true;
const serverReady = () => false;
export function Header({ name }: { name?: string }) {
  const hydrated = useSyncExternalStore(subscribe, clientReady, serverReady);
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    function escape(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
    }
    document.addEventListener("keydown", escape);
    return () => document.removeEventListener("keydown", escape);
  }, []);
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Brand name={name} />
        <button
          ref={toggle}
          className="menu-toggle icon-button"
          aria-expanded={open}
          aria-controls="public-menu"
          aria-label={open ? "Tutup menu" : "Buka menu"}
          disabled={!hydrated}
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
        <nav
          id="public-menu"
          className={open ? "public-nav open" : "public-nav"}
          aria-label="Navigasi utama"
        >
          {links.map(([url, label]) => (
            <Link
              key={url}
              href={url}
              aria-current={pathname === url ? "page" : undefined}
              onClick={() => setOpen(false)}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
