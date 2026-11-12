import Link from "next/link";
import { notFound } from "next/navigation";
import { Plus, Search, Pencil, ArrowLeft, ExternalLink } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { modules } from "@/lib/modules";
import { ContentForm } from "@/components/forms/content-form";
import { DeleteButton } from "@/components/admin/delete-button";
import type { ContentRow } from "@/lib/content";
export default async function Manage({
  params,
  searchParams,
}: {
  params: Promise<{ module: string }>;
  searchParams: Promise<{
    edit?: string;
    baru?: string;
    q?: string;
    filter?: string;
    page?: string;
    saved?: string;
  }>;
}) {
  const { module: key } = await params;
  const m = modules[key];
  if (!m) notFound();
  const { client } = await requireAdmin();
  const p = await searchParams;
  const editing = Boolean(p.edit || p.baru);
  const page = Math.max(1, Math.min(10000, Number(p.page) || 1));
  let initial: ContentRow | undefined,
    error = false;
  let records: ContentRow[] = [];
  let total = 0;
  if (m.single || p.edit) {
    let q = client.from(m.table).select("*");
    q = m.single ? q.eq("id", 1) : q.eq("id", p.edit!);
    const r = await q.maybeSingle();
    initial = r.data as ContentRow | undefined;
    error = Boolean(r.error);
    if (p.edit && !r.data && !r.error) notFound();
  } else if (!p.baru) {
    let q = client
      .from(m.table)
      .select("*", { count: "exact" })
      .order("sort_order")
      .order("id");
    if (p.q)
      q = q.ilike(
        m.table === "temple_objects" || m.table === "contributors"
          ? "name"
          : "title",
        "%" + p.q.replace(/[%_\\]/g, "") + "%",
      );
    if (p.filter && ["draft", "published"].includes(p.filter))
      q = q.eq("status", p.filter);
    if (p.filter && ["nista", "madya", "utama"].includes(p.filter))
      q = q.eq("mandala", p.filter);
    const r = await q.range((page - 1) * 20, page * 20 - 1);
    records = (r.data as ContentRow[]) ?? [];
    total = r.count ?? 0;
    error = Boolean(r.error);
  }
  let objects: { id: string; name: string }[] = [];
  if (key === "galeri" && (editing || m.single)) {
    const r = await client
      .from("temple_objects")
      .select("id,name")
      .order("name")
      .limit(500);
    objects = r.data ?? [];
  }
  const url = (n: number) =>
    "/admin/" +
    key +
    "?" +
    new URLSearchParams({
      ...(p.q ? { q: p.q } : {}),
      ...(p.filter ? { filter: p.filter } : {}),
      page: String(n),
    });
  return (
    <>
      <div className="admin-page-heading">
        <div>
          <p className="breadcrumb">Admin / {m.title}</p>
          <h1>{m.title}</h1>
          <p>
            {m.single
              ? "Perbarui informasi yang tampil di website publik."
              : "Kelola data, urutan, izin, dan status publikasi."}
          </p>
        </div>
        {!m.single && !editing && (
          <Link
            className="button button-green"
            href={"/admin/" + key + "?baru=1"}
          >
            <Plus size={18} />
            Tambah konten
          </Link>
        )}
        {editing && (
          <Link href={"/admin/" + key} className="button button-outline-dark">
            <ArrowLeft size={16} />
            Kembali ke daftar
          </Link>
        )}
      </div>
      {key === "virtual-tour" && (
        <div className="notice">
          Konfigurasi ini menghubungkan hasil publish Pano2VR. Edit hotspot,
          node, skin, dan denah di aplikasi Pano2VR. Domain tur harus disetujui
          melalui environment server.
        </div>
      )}
      {["galeri", "objek-pura"].includes(key) && (
        <div className="notice">
          Terbitkan hanya konten dengan izin dokumentasi dan publikasi. Bagian
          dalam pelinggih atau benda sakral yang dilarang tidak boleh
          ditampilkan.
        </div>
      )}
      {error ? (
        <div className="notice" role="alert">
          Data belum dapat dimuat dari Supabase. Periksa migration, koneksi, dan
          sesi admin. Form dinonaktifkan untuk mencegah penimpaan data.
        </div>
      ) : m.single || editing ? (
        <div className="admin-card">
          <ContentForm
            key={initial?.id ?? key + "-new"}
            moduleKey={key}
            initial={initial}
            objects={objects}
            saved={p.saved === "1"}
          />
        </div>
      ) : (
        <>
          <form className="admin-filters" action={"/admin/" + key}>
            <label className="search-input">
              <span className="sr-only">Cari konten</span>
              <Search size={17} />
              <input
                name="q"
                placeholder="Cari judul atau nama…"
                defaultValue={p.q}
                maxLength={100}
              />
            </label>
            {key !== "kontributor" && (
              <label>
                <span className="sr-only">Filter</span>
                <select name="filter" defaultValue={p.filter ?? ""}>
                  <option value="">Semua status</option>
                  <option value="draft">Draft</option>
                  <option value="published">Terbit</option>
                  {key === "objek-pura" &&
                    ["nista", "madya", "utama"].map((k) => (
                      <option key={k} value={k}>
                        {k} mandala
                      </option>
                    ))}
                </select>
              </label>
            )}
            <button className="button button-outline-dark">Terapkan</button>
          </form>
          <section className="admin-card">
            {records.length ? (
              <div className="content-list">
                {records.map((r) => (
                  <article key={r.id}>
                    <div>
                      <h2>{String(r.title ?? r.name)}</h2>
                      <div className="record-meta">
                        <span
                          className={
                            "status " +
                            (r.status ??
                              (r.is_published ? "published" : "draft"))
                          }
                        >
                          {r.status === "published" || r.is_published
                            ? "Terbit"
                            : "Draft"}
                        </span>
                        {r.publication_approved !== undefined && (
                          <span>
                            {r.publication_approved
                              ? "Izin disetujui"
                              : "Belum disetujui"}
                          </span>
                        )}
                        <span>Urutan {String(r.sort_order)}</span>
                      </div>
                    </div>
                    <div className="record-actions">
                      <Link
                        className="icon-button"
                        href={"/admin/" + key + "?edit=" + r.id}
                        aria-label={"Edit " + String(r.title ?? r.name)}
                      >
                        <Pencil size={17} />
                      </Link>
                      <DeleteButton
                        moduleKey={key}
                        id={String(r.id)}
                        title={String(r.title ?? r.name)}
                      />
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <h2>
                  {p.q ? "Tidak ada hasil pencarian" : "Belum ada konten"}
                </h2>
                <p>
                  Tambahkan data dan simpan sebagai draft sebelum diterbitkan.
                </p>
              </div>
            )}
          </section>
          <nav className="pagination" aria-label="Halaman data">
            {page > 1 && <Link href={url(page - 1)}>← Sebelumnya</Link>}
            <span>{total} konten</span>
            {page * 20 < total && (
              <Link href={url(page + 1)}>Selanjutnya →</Link>
            )}
          </nav>
        </>
      )}
      {key === "tentang-kami" && (
        <Link className="text-link" href="/admin/kontributor">
          Kelola pengembang dan kontributor
          <ExternalLink size={16} />
        </Link>
      )}
    </>
  );
}
