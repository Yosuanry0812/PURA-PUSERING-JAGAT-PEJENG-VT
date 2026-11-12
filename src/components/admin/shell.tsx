"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, LayoutDashboard, ArrowUpRight, LogOut } from "lucide-react";
import { useState, useRef, useActionState } from "react";
import { Brand } from "@/components/public/brand";
import { navigation } from "@/lib/modules";
import { logout } from "@/app/admin/actions";
export function AdminShell({
  children,
  name,
}: {
  children: React.ReactNode;
  name: string;
}) {
  const [open, setOpen] = useState(false);
  const [logoutState, logoutAction, loggingOut] = useActionState(logout, {
    ok: false,
    message: "",
  });
  const path = usePathname();
  const toggle = useRef<HTMLButtonElement>(null);
  return (
    <div
      className="admin-shell"
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          setOpen(false);
          toggle.current?.focus();
        }
      }}
    >
      {open && (
        <button
          className="sidebar-backdrop"
          onClick={() => setOpen(false)}
          aria-label="Tutup navigasi"
        />
      )}
      <aside className={"admin-sidebar " + (open ? "is-open" : "")}>
        <Brand />
        <span className="admin-label">PENGELOLAAN WEBSITE</span>
        <nav aria-label="Navigasi admin" id="admin-navigation">
          {[
            { href: "/admin/dashboard", label: "Dashboard" },
            ...navigation,
          ].map((n, i) => (
            <Link
              key={n.href}
              href={n.href}
              aria-current={path === n.href ? "page" : undefined}
              onClick={() => setOpen(false)}
            >
              {i === 0 ? (
                <LayoutDashboard size={17} />
              ) : (
                <span className="nav-dot" />
              )}
              {n.label}
            </Link>
          ))}
        </nav>
        <form action={logoutAction}>
          <button className="logout-button" disabled={loggingOut}>
            <LogOut size={17} />
            {loggingOut ? "Mengakhiri sesi…" : "Logout"}
          </button>
          {logoutState.message && (
            <p className="logout-error" role="alert">
              {logoutState.message}
            </p>
          )}
        </form>
        <p className="sidebar-note">
          Setiap publikasi adalah bagian dari tanggung jawab menjaga warisan.
        </p>
      </aside>
      <div className="admin-workspace">
        <header className="admin-topbar">
          <div>
            <button
              ref={toggle}
              className="menu-toggle icon-button"
              aria-expanded={open}
              aria-controls="admin-navigation"
              aria-label={open ? "Tutup navigasi" : "Buka navigasi"}
              onClick={() => setOpen(!open)}
            >
              {open ? <X /> : <Menu />}
            </button>
            <span>
              Administrator <strong>{name}</strong>
            </span>
          </div>
          <Link href="/" target="_blank">
            Lihat website
            <ArrowUpRight size={16} />
          </Link>
        </header>
        <main id="main" className="admin-main">
          {children}
        </main>
        <footer className="admin-footer">
          Pura Pusering Jagat Pejeng · Pengelolaan konten
        </footer>
      </div>
    </div>
  );
}
