import Link from "next/link";
import {
  Landmark,
  ImageIcon,
  Video,
  ScrollText,
  Compass,
  ArrowUpRight,
} from "lucide-react";
import { requireAdmin } from "@/lib/auth";
export default async function Dashboard() {
  const { client, displayName } = await requireAdmin();
  const queries = [
    client.from("temple_objects").select("*", { count: "exact", head: true }),
    client
      .from("gallery_items")
      .select("*", { count: "exact", head: true })
      .eq("media_type", "photo"),
    client
      .from("gallery_items")
      .select("*", { count: "exact", head: true })
      .eq("media_type", "video"),
    client.from("history_sections").select("*", { count: "exact", head: true }),
    client
      .from("virtual_tour_settings")
      .select("is_published,tour_url")
      .eq("id", 1)
      .maybeSingle(),
    client
      .from("history_sections")
      .select("id,title,status,updated_at")
      .order("updated_at", { ascending: false })
      .limit(5),
  ] as const;
  const [objects, photos, videos, history, tour, recent] =
    await Promise.all(queries);
  const failed = [objects, photos, videos, history, tour, recent].some(
    (r) => r.error || r.status >= 400,
  );
  return (
    <>
      <div className="admin-page-heading">
        <div>
          <p className="breadcrumb">Admin / Dashboard</p>
          <h1>Selamat datang{displayName ? ", " + displayName : ""}.</h1>
          <p>Ruang untuk merawat informasi dan dokumentasi pura.</p>
        </div>
        <Link href="/" className="button button-outline-dark">
          Lihat website
          <ArrowUpRight size={16} />
        </Link>
      </div>
      {failed && (
        <p className="notice" role="alert">
          Sebagian data belum dapat dimuat. Periksa koneksi dan migration
          Supabase.
        </p>
      )}
      <div className="summary-grid">
        {[
          [Landmark, "Objek pura", objects.count],
          [ImageIcon, "Foto galeri", photos.count],
          [Video, "Video galeri", videos.count],
          [ScrollText, "Bagian sejarah", history.count],
        ].map(([Icon, label, count]) => {
          const I = Icon as typeof Landmark;
          return (
            <article className="summary-card" key={String(label)}>
              <I size={23} strokeWidth={1.3} />
              <span>{String(label)}</span>
              <strong>
                {count === null || count === undefined ? "—" : String(count)}
              </strong>
            </article>
          );
        })}
        <article className="summary-card">
          <Compass size={23} strokeWidth={1.3} />
          <span>Virtual Tour</span>
          <strong className="summary-status">
            {tour.error
              ? "Belum dimuat"
              : tour.data?.is_published && tour.data?.tour_url
                ? "Terbit"
                : "Belum terbit"}
          </strong>
        </article>
      </div>
      <section className="admin-card">
        <div className="admin-card-heading">
          <h2>Aksi cepat</h2>
          <span>Mulai dari sini</span>
        </div>
        <div className="quick-actions">
          {[
            ["/admin/galeri?baru=1", "Tambah Foto"],
            ["/admin/objek-pura?baru=1", "Tambah Objek"],
            ["/admin/sejarah", "Edit Sejarah"],
            ["/admin/virtual-tour", "Atur Virtual Tour"],
          ].map(([url, label]) => (
            <Link href={url} key={url}>
              {label}
              <ArrowUpRight size={19} />
            </Link>
          ))}
        </div>
      </section>
      <section className="admin-card">
        <div className="admin-card-heading">
          <h2>Sejarah terakhir diperbarui</h2>
          <Link href="/admin/sejarah">Kelola sejarah →</Link>
        </div>
        {recent.data?.length ? (
          <div className="recent-list">
            {recent.data.map((r) => (
              <Link href={"/admin/sejarah?edit=" + r.id} key={r.id}>
                <div>
                  <strong>{r.title}</strong>
                  <small>
                    {new Date(r.updated_at).toLocaleString("id-ID", {
                      timeZone: "Asia/Makassar",
                    })}
                  </small>
                </div>
                <span className={"status " + r.status}>
                  {r.status === "published" ? "Terbit" : "Draft"}
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <p className="muted">
            Belum ada konten sejarah. Tambahkan bagian pertama melalui Kelola
            Sejarah.
          </p>
        )}
      </section>
      <div className="notice">
        <strong>Publikasi yang bertanggung jawab</strong>
        <p>
          Foto dan informasi objek hanya boleh diterbitkan setelah izin
          dokumentasi dan publikasi diperoleh.
        </p>
      </div>
    </>
  );
}
