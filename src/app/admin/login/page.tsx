import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { adminIdentity } from "@/lib/auth";
import { configured } from "@/lib/supabase/config";
import { Brand } from "@/components/public/brand";
import { LoginForm } from "@/components/admin/login-form";
export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ reason?: string }>;
}) {
  const admin = await adminIdentity();
  if (admin) redirect("/admin/dashboard");
  const p = await searchParams;
  return (
    <main id="main" className="login-page">
      <section className="login-story">
        <Brand />
        <div>
          <p className="eyebrow">RUANG PENGELOLAAN</p>
          <h1>
            Menjaga cerita.
            <br />
            Merawat warisan.
          </h1>
          <p>
            Kelola dokumentasi budaya dengan cermat, akurat, dan penuh tanggung
            jawab.
          </p>
        </div>
        <span>PURA PUSERING JAGAT PEJENG · BALI</span>
      </section>
      <section className="login-panel">
        <div className="login-card">
          <span className="login-symbol">
            <ShieldCheck size={29} strokeWidth={1.3} />
          </span>
          <p className="eyebrow">AKSES TERBATAS</p>
          <h2>Login Administrator</h2>
          <p>Masuk menggunakan akun pengelola yang telah diizinkan.</p>
          {!configured() && (
            <div className="notice">
              Supabase belum dikonfigurasi. Login tersedia setelah URL proyek
              dan publishable key diatur pada lingkungan aplikasi.
            </div>
          )}
          {p.reason === "access" && configured() && (
            <p className="notice" role="status">
              Silakan login menggunakan akun admin aktif. Sesi sebelumnya
              mungkin telah berakhir.
            </p>
          )}
          {p.reason === "logout" && (
            <p className="notice" role="alert">
              Logout belum berhasil. Periksa koneksi dan coba kembali; sesi
              mungkin masih aktif.
            </p>
          )}
          <LoginForm enabled={configured()} />
          <Link className="back-link" href="/">
            <ArrowLeft size={16} />
            Kembali ke website utama
          </Link>
        </div>
      </section>
    </main>
  );
}
