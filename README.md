# Pura Pusering Jagat Pejeng — Virtual Tour 360

Website dokumentasi budaya dengan Next.js App Router, TypeScript strict, Tailwind CSS, Supabase Auth/PostgreSQL/Storage, dan integrasi URL Pano2VR. Antarmuka berbahasa Indonesia. Tidak ada login, database, CRUD, foto, atau panorama rekaan.

**Status:** URL dasar dan publishable key telah disimpan lokal; Data API terjangkau. Pemeriksaan GET pada 2026-11-10 menghasilkan `PGRST205`: tabel aplikasi belum dibuat. Signup hosted masih aktif. Konektor belum memiliki akses proyek dan CLI belum login; migration, seed, bootstrap admin, serta pengujian CRUD/RLS live masih menunggu otorisasi pemilik. Deployment belum dilakukan.

## Penyimpanan kredensial dan pemeriksaan Git

`.env.local` berisi URL dasar dan publishable key, diabaikan Git dan dibatasi ACL ke pengguna Windows saat ini. Secret key **tidak** dipakai aplikasi. Salinan seluruh kredensial disimpan terenkripsi menggunakan Windows DPAPI pada `%LOCALAPPDATA%\PuseringJagatVT\supabase-credentials.dpapi`, di luar repository, dengan ACL pengguna yang sama. Berkas DPAPI terikat profil Windows; jangan menyalinnya ke source atau menganggapnya backup portabel.

Secret key yang pernah dikirim melalui chat harus dirotasi/revoke melalui dashboard Supabase. Penyimpanan terenkripsi tidak membatalkan paparan sebelumnya. Jangan mengirim key pengganti, password, atau token management melalui chat; aplikasi ini cukup memakai publishable key dan sesi Supabase Auth.

Jalankan `npm run security:check` sebelum commit/push. Pemeriksaan ini mencari environment aktif, vault/private key, API key literal, JWT, dan URL database ber-password pada file Git/calon source, tanpa mencetak nilainya. Hook lokal `.githooks/pre-commit` memeriksa isi **staging**, termasuk file environment yang ditambahkan paksa. Build dan dev juga memeriksa konfigurasi `NEXT_PUBLIC_*` menggunakan urutan environment Next.js; secret key tidak boleh dikompilasi ke browser. Hook lokal bukan pengganti pemeriksaan GitHub/CI dan dapat dilewati oleh operator.

## Desain dan foto sementara

Arahan visual mengikuti `https://pura-pengukur-ukuran.vercel.app/`: latar foto gelap, navbar transparan, sans-serif, judul putih–emas, teks dan foto berdampingan, serta panel transparan berbatas terang. Identitas dan aset website referensi tidak disalin. CSS publik terpisah di `src/app/public-theme.css`; dashboard mempertahankan tampilan pengelolaan yang lebih sederhana.

Dua foto gerbang Pura Pusering Jagat oleh **Anandajoti Bhikkhu**, berlisensi **CC BY-SA 4.0**, tersedia di `public/images/reference/`. Halaman file dan lisensinya diperiksa melalui Wikimedia Commons. Ukuran maksimum 1920 piksel, WebP, total `796352` byte. Metadata sumber/lisensi/perubahan ada pada `attribution.json`; sumber dan lisensi ditampilkan melalui “Sumber foto sementara” pada footer. Ini foto eksterior gerbang dari sumber terbuka, bukan dokumentasi penelitian atau panorama 360.

Seed menyimpan referensi foto pada field gambar CMS yang sama dengan field unggahan. Admin dapat memilih foto referensi atau menggantinya dengan unggahan Storage. Dua alias `reference/split-gateway.webp` dan `reference/main-gate.webp` diizinkan secara terbatas pada halaman/config/sejarah; keduanya bukan signed URL dan merupakan aset publik. Gallery, objek penelitian, dan kontributor tetap menggunakan unggahan privat sendiri. Foto referensi tidak dimasukkan sebagai record galeri rekaan.

Ketika CMS belum terkonfigurasi atau tidak terjangkau, Beranda, Sejarah, dan Tentang Kami memakai narasi editorial dari `src/lib/reference-content.ts`, disarikan dari [artikel Tim KKN Desa Pejeng](https://desa-pejeng-home.vercel.app/artikel/pura-pusering-jagat) yang diperiksa pada 2026-11-12. Ini konten bawaan website, bukan record database. Konten CMS terbit diutamakan; CMS yang berhasil merespons dengan konten kosong tetap menampilkan empty state, sehingga keputusan unpublish dihormati. Seed CMS yang lama tidak otomatis ditimpa. Galeri tetap membutuhkan dokumentasi terbit dan berizin. Foto latar dapat diganti dari Pengaturan Website.

Tautan Beranda menuju `/virtual-tour` selalu aktif. Halaman tur menyediakan tombol **Buka Virtual Tour 360°**: tanpa URL, tombol menampilkan status belum tersedia; dengan URL valid, tombol membuka output HTML5 di tab baru dan penampil iframe tersedia secara opsional.

## Menjalankan aplikasi

Gunakan Node.js 22 atau 24 dan npm. Dependency dikunci dalam `package-lock.json`.

```powershell
cd 'C:\Users\yosuanry simbolon\Sistem\joki\PURA PUSERING JAGAT PEJENG VT'
npm ci
if (-not (Test-Path -LiteralPath '.env.local')) { Copy-Item .env.example .env.local }
npm run dev -- --port 3107
```

Buka `http://localhost:3107`. Isi `.env.local` secara lokal:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
NEXT_PUBLIC_SITE_URL=
VIRTUAL_TOUR_URL=
TOUR_ALLOWED_HOSTS=
```

- URL proyek dan **publishable key** tersedia pada dialog **Connect**/API Keys di dashboard Supabase. Aplikasi tidak memerlukan legacy anon key, service role key, secret key, atau database password untuk runtime.
- `NEXT_PUBLIC_SITE_URL`: URL HTTPS aplikasi ketika domain deployment tersedia. Biarkan kosong saat domain belum ditetapkan; canonical/metadata absolut dan sitemap domain tidak direka.
- `VIRTUAL_TOUR_URL`: URL HTTPS output HTML5 tur, termasuk path `index.html` bila diperlukan. Konfigurasi ini dapat digunakan sebelum CMS tersedia. URL CMS terbit yang valid diutamakan, kemudian URL environment. Kosongkan environment ini jika ingin menonaktifkan tur sepenuhnya melalui CMS.
- `TOUR_ALLOWED_HOSTS`: hostname Pano2VR yang disetujui, dipisahkan koma, tanpa protokol, port, atau path. Kosong berarti semua URL tur ditolak untuk publikasi.
- Mulai ulang server setelah environment berubah; variabel `NEXT_PUBLIC_*` harus tersedia saat build production.
- Tanpa konfigurasi CMS, narasi bawaan tersedia pada Beranda, Sejarah, dan Tentang Kami; admin login dinonaktifkan. Narasi tersebut tidak disimpan otomatis ke database.

## Setup Supabase

1. Siapkan proyek Supabase milik pemilik aplikasi. Catat project reference/ID; jangan membuat proyek berbayar baru secara otomatis.
2. Jalankan semua migration berurutan: `20261109181221_create_cultural_cms.sql`, lalu `20261109194707_harden_content_integrity.sql`, melalui workflow migration yang terkontrol. Jangan menganggap secret API key sebagai token Management API/izin menjalankan SQL.
3. Jalankan `supabase/seed.sql` sekali setelah migration. Seed bersifat idempotent (`ON CONFLICT DO NOTHING`) dan tidak menimpa perubahan CMS yang sudah ada.
4. Pastikan schema API yang diekspos hanya yang dibutuhkan. **Jangan mengekspos schema `private`.** Semua tabel aplikasi di `public` memiliki RLS dan explicit grants.
5. Bucket `temple-media` dibuat oleh migration sebagai **private**, maksimum `3145728` byte, MIME JPEG/PNG/WebP. Jangan mengubahnya menjadi public.
6. Pada Auth, nonaktifkan **Allow new users to sign up** serta anonymous sign-ins. `supabase/config.toml` menonaktifkan signup untuk stack konfigurasi lokal; pengaturan hosted tetap perlu diperiksa di dashboard.
7. Atur Auth Site URL dan redirect URLs sesuai origin lokal yang digunakan serta domain produksi. Tidak ada OAuth, magic link, registrasi publik, atau endpoint bootstrap admin pada aplikasi.
8. Jalankan `supabase/tests/verify_cms.sql` sebagai pemilik setelah migration/seed. Skrip bersifat read-only: memeriksa RLS, grants, singleton, helper private, bucket dan kebijakan publikasi. Lanjutkan advisors, pemeriksaan API, dan pengujian akun admin/non-admin/anon.

CLI yang disertakan adalah **Supabase CLI 3.1.0**. Versi ini menargetkan lokal secara default; gunakan `--remote` secara eksplisit untuk hosted. Periksa `--help` jika mengubah versi.

```powershell
npx supabase login
npx supabase link --project-ref <PROJECT_REFERENCE>
npx supabase db push --remote --dry-run
npx supabase db push --remote --include-seed
npx supabase migration list --remote
npx supabase db advisors --remote --type all --fail-on error
```

Login CLI/MCP dilakukan pemilik melalui mekanisme autentikasi aman; jangan menaruh token pada source, chat, atau command line. Alternatif tanpa akses CLI adalah menjalankan berkas migration lalu seed di SQL Editor dashboard sebagai pemilik proyek dan mencatat migration melalui workflow Supabase yang dipakai. Jangan menjalankan `db reset` terhadap proyek hosted.

Setelah akses pemilik tersedia, urutan yang dipakai adalah migration pertama → migration integritas → seed → pemeriksaan SQL read-only → bootstrap admin → advisors → tes live. `npm run supabase:check` menggunakan GET dengan publishable key untuk memeriksa keberadaan tabel, pembatasan membership admin, dan signup. Skrip ini tidak menulis data dan tidak memakai secret key. Status gagal berarti setup hosted belum siap, bukan bahwa CRUD telah diuji.

| Tabel                   | Isi dan aturan alur                                                                         |
| ----------------------- | ------------------------------------------------------------------------------------------- |
| `admin_users`           | UUID Supabase Auth, admin aktif; tanpa password dan tanpa hak tulis pengguna biasa          |
| `site_settings`         | Satu record `id=1`: identitas, kontak publik, SEO dan foto latar; tidak berisi kredensial   |
| `home_content`          | Satu record `id=1`: seluruh section Beranda dan status publikasi                            |
| `history_sections`      | Narasi terurut, slug unik, sumber, draft/published; seed menyiapkan 7 bagian, 2 tetap draft |
| `temple_objects`        | Objek hasil observasi; kategori mandala dan approval wajib sebelum terbit; seed kosong      |
| `gallery_items`         | Metadata foto/video, kategori, relasi objek, urutan, featured, approval; seed kosong        |
| `virtual_tour_settings` | Satu konfigurasi Pano2VR; seed belum dipublikasikan dan URL kosong                          |
| `about_content`         | Satu halaman Tentang Kami; kontak tetap di `site_settings`                                  |
| `contributors`          | Identitas nyata dengan izin; seed kosong                                                    |

Migration integritas menolak judul kosong, alt text kosong pada gambar, ukuran teks berlebihan, serta pencampuran field foto/video. Saat berganti ke video, Server Action membersihkan path foto lama dari record; saat berganti ke foto, URL video dan thumbnail lama dibersihkan. Berkas fisik tetap dipertahankan agar tidak menghapus media bersama. Singleton tidak dapat dihapus melalui Data API admin; form menggunakan upsert.

## Membuat administrator pertama

1. Supabase Dashboard → Authentication → Users → buat pengguna email/password secara manual. Konfirmasikan email sesuai pengaturan proyek.
2. Salin UUID akun dari Auth. Password hanya dikelola Supabase Auth.
3. Pemilik database menjalankan SQL berikut di SQL Editor menggunakan UUID akun tersebut. Ganti placeholder di editor; jangan commit identitas akun aktual.

```sql
insert into public.admin_users (user_id, display_name, role, is_active)
values ('<UUID_AUTH_USER>', '<NAMA_PENGELOLA_YANG_DISETUJUI>', 'admin', true)
on conflict (user_id) do update
set display_name = excluded.display_name, is_active = true;
```

4. Masuk melalui `/admin/login`. Akun Auth tanpa membership aktif ditolak.
5. Membership hanya dikelola pemilik melalui database; anon/authenticated tidak memiliki hak tulis tabel `admin_users`. Tidak ada endpoint promosi role atau password admin bawaan.

## Panduan admin

| Halaman               | Kegunaan                                                                                     |
| --------------------- | -------------------------------------------------------------------------------------------- |
| `/admin/dashboard`    | Jumlah objek/foto/video/bagian sejarah aktual dan status tur                                 |
| `/admin/beranda`      | Hero, pengenalan, empat keunikan, Tri Mandala, preview tur/galeri, CTA, pelestarian          |
| `/admin/sejarah`      | Tambah/edit/hapus narasi teks, sumber, gambar, slug, urutan, draft/published                 |
| `/admin/objek-pura`   | Nama, mandala, narasi, fungsi, nilai budaya, foto, izin, status                              |
| `/admin/galeri`       | Foto Storage/video YouTube atau Vimeo, kategori bebas, objek terkait, urutan, featured, izin |
| `/admin/virtual-tour` | Judul, deskripsi, URL, cover, preview URL, publikasi Pano2VR                                 |
| `/admin/tentang-kami` | Latar belakang, tujuan, manfaat, gambar; tautan pengelolaan kontributor                      |
| `/admin/kontributor`  | Identitas/peran yang telah diizinkan; tidak ada identitas fiktif di seed                     |
| `/admin/pengaturan`   | Identitas, logo/favicon, lokasi, kontak, media sosial, footer, SEO                           |

Simpan narasi sejarah sebagai **teks biasa**. Paragraf dipisahkan baris kosong. HTML ditampilkan sebagai teks yang di-escape; tidak ada `dangerouslySetInnerHTML` atau rich-text HTML bebas.

Untuk menerbitkan foto/objek: simpan draft → periksa konten dengan pengelola → centang izin publikasi → ubah status menjadi Terbit → Simpan. Validasi server dan constraint database menolak publikasi tanpa izin. Upload bukan bukti izin. Benda sakral atau bagian dalam pelinggih yang tidak diizinkan tidak boleh diunggah.

Batas input 3 MiB menjaga ukuran request multipart di bawah batas Vercel Functions. Foto wajib memiliki alt text. Unggahan diperiksa ukuran, ekstensi, MIME, signature, dan decoding; gambar lebih dari 40 megapiksel ditolak. Server mengubahnya ke WebP, sisi terpanjang maksimum 1920 piksel, kualitas 84, tanpa EXIF. Bucket menyimpan path acak UUID dalam folder `hero/`, `history/`, `gallery/`, `objects/`, `about/`, `virtual-tour-cover/`.

Galeri publik memakai kategori yang memiliki konten terbit dan pagination 18 item. Daftar admin memakai pagination 20 item, pencarian, dan filter. Beranda menampilkan enam media unggulan dan enam objek pertama menurut urutan. Dropdown objek terkait dibatasi 500 objek; perlu diperluas menjadi pencarian server jika koleksi melampaui jumlah tersebut.

Dialog Hapus menghapus record; **berkas Storage dipertahankan** agar referensi lain aman. Lepaskan gambar pada semua konten sebelum membersihkannya melalui Storage dengan akses admin. Policy Storage menolak update/delete berkas yang masih direferensikan; pembersihan otomatis/orphan scheduler tidak disertakan.

## Arsitektur dan keamanan

- Server Components membaca konten menggunakan client anon tanpa cookie dan `cache: no-store`; pengunjung tidak pernah membaca draft dengan sesi admin. `React.cache` hanya menduplikasi query dalam satu render request.
- Server Actions menulis ke tabel yang sama memakai cookie pengguna, memverifikasi `auth.getUser()` serta membership aktif, memvalidasi Zod, lalu `revalidatePath('/', 'layout')`. Data tidak disimpan pada localStorage atau database alternatif.
- `src/proxy.ts` menyegarkan sesi SSR dengan `getClaims()` dan meneruskan cookie. Layout **dan setiap operasi** memverifikasi admin di server. RLS tetap berlaku saat API dipanggil langsung.
- Helper `private.is_admin()` adalah satu-satunya fungsi `SECURITY DEFINER`; search path kosong, lookup UUID dari `auth.uid()`, EXECUTE dibatasi, tidak menerima role/user ID dari input. Tidak mengandalkan `user_metadata` atau email frontend.
- Storage private hanya dapat dibaca anon jika path direferensikan konten terbit/berizin. `/media/...` mengunduh dengan identitas pemanggil dan mengirim `private, no-store`, tanpa signed URL yang masih hidup setelah unpublish.
- Pengguna dapat menyimpan salinan media yang sudah pernah dipublikasikan. Unpublish mencegah permintaan baru melalui aplikasi, bukan menarik salinan di perangkat orang lain.
- Halaman admin noindex; robots melarang `/admin/` dan `/media/`. Ada metadata per halaman, Open Graph dasar, sitemap/canonical berbasis domain terkonfigurasi, label form, dialog native, keyboard navigation, dan reduced motion.
- Tidak ada analytics, statistik pengunjung, service role, secret key, password hardcoded, atau registrasi publik.

## Menghubungkan Pano2VR

1. Buat panorama, hotspot, denah, skin, dan scene di **Pano2VR**. Pano2VR menggantikan 3DVista sebagai keputusan implementasi, bukan ketentuan eksplisit proposal.
2. Publish output lengkap ke hosting HTTPS. Pastikan jalur relatif aset bekerja dan izin publikasi lokasi/objek sudah diperoleh.
3. Tambahkan hostname ke `TOUR_ALLOWED_HOSTS` di server lokal/Vercel; redeploy bila diperlukan.
4. Admin → Kelola Virtual Tour → masukkan URL final, judul/deskripsi, dan cover → centang publikasi → Simpan.
5. Halaman `/virtual-tour` memuat iframe setelah tombol **Muat Virtual Tour** dipilih, sehingga file panorama tidak dimuat di Beranda.
6. Hosting panorama harus mengizinkan embedding dari domain aplikasi melalui CSP `frame-ancestors`/`X-Frame-Options` yang sesuai. Tidak semua hosting mengizinkan iframe.
7. Loading, timeout 15 detik, retry, fullscreen, dan tombol URL asli tersedia. Browser tidak selalu melaporkan blok iframe lintas origin sebagai error; tombol URL asli selalu disediakan.
8. Menonaktifkan publikasi dan mengosongkan `VIRTUAL_TOUR_URL` menampilkan status persiapan. URL referensi `https://panorama-beta-one.vercel.app/` **tidak dijadikan tur final**.

## Pengujian

```powershell
npm run lint
npm run typecheck
npm run security:check
npm test
npm run build
npm run test:e2e
```

E2E memakai Microsoft Edge yang tersedia pada Windows dan production server port `3107`. Ganti port lewat `PLAYWRIGHT_PORT` bila terpakai. Jika Edge belum terpasang, pasang Edge atau sesuaikan channel Playwright ke Chromium yang tersedia. Jangan menghentikan server proyek lain.

`tests/unit` memeriksa URL berbahaya, persetujuan publikasi, field injection, format unggahan, dan **parsing** migration/seed. Parsing SQL tidak membuktikan RLS bekerja pada database hidup. `tests/components` menguji lightbox, iframe/loading/timeout/retry, dan escaping narasi. `tests/e2e` menguji route, redirect admin tanpa sesi, menu, layout, SEO, dan axe.

Pengujian live disediakan dalam `tests/live/acceptance.spec.ts`. Gunakan **proyek uji** yang telah dimigrasikan dan di-seed serta dua akun uji manual. Set variabel berikut hanya di lingkungan lokal/CI aman:

```dotenv
RUN_LIVE_TESTS=1
TEST_BASE_URL=
TEST_ADMIN_EMAIL=
TEST_ADMIN_PASSWORD=
TEST_NONADMIN_EMAIL=
TEST_NONADMIN_PASSWORD=
TEST_TOUR_URL=
```

Jalankan aplikasi dengan konfigurasi proyek uji yang sama, lalu `npm run test:live`. Skenario mengubah konten sementara lalu memulihkannya, membuat/menghapus record uji dan berkas, memeriksa anon/non-admin, serta logout. Tracing/screenshot/video live dinonaktifkan agar kredensial dan konten privat tidak tercatat. URL tur live opsional, harus milik proyek uji dan host sudah disetujui. Tanpa konfigurasi lengkap, skenario ditandai **skipped**, bukan lulus.

Uji tambahan sebelum production: admin dinonaktifkan/expired session, seluruh modul CRUD, advisori database, kebijakan Storage dan membership langsung, perangkat fisik/Safari/Firefox, serta iframe dengan output Pano2VR final.

Pemeriksaan lokal terakhir mencakup 31 tes unit/komponen, termasuk pencegahan key masuk Git/browser dan konsistensi perubahan jenis media. Pemeriksaan readiness hosted saat tabel belum tersedia memang gagal dengan `PGRST205`; jangan melaporkannya sebagai tes database lulus.

## Deployment Vercel

1. Simpan source dan lockfile di repository sendiri. `.env.local`, dependency, build, sesi, serta hasil test tidak di-commit.
2. Import repository ke Vercel → Framework Next.js → Node.js 22/24 → `npm ci` → `npm run build`.
3. Isi tiga environment publik dan `TOUR_ALLOWED_HOSTS` pada environment production/preview yang tepat. Gunakan proyek Supabase uji untuk preview jika kontennya berbeda.
4. Pastikan Supabase hosted sudah memiliki migration/seed, admin, Auth URL configuration, signup nonaktif, dan bucket private.
5. Deploy setelah persetujuan pemilik. Update `NEXT_PUBLIC_SITE_URL` ke domain aktual, Auth redirect URLs, dan izin embedding Pano2VR; redeploy.
6. Verifikasi lima route publik, login/logout, perubahan CMS, draft/approval, Storage, canonical/sitemap, noindex admin, dan skenario A–I pada domain sebenarnya.

Tidak ada klaim deployment atau integrasi Supabase berhasil sebelum diverifikasi.

## Bahan yang masih diperlukan

- Proposal seminar, terutama BAB I, BAB III, wawancara, dan observasi. Folder proyek awal kosong; dokumen tersebut belum dibaca.
- Foto dokumentasi Pura Pusering Jagat yang benar beserta izin publikasi, alt text, keterangan, dan kategori.
- Verifikasi sejarah: perkiraan abad ke-10 dari artikel Desa Pejeng, nama/angka Bejana Sangku Sudamala 1251 Saka/1329 Masehi dari prompt pemilik. Seed lama menyimpan keduanya sebagai **draft**. Narasi bawaan baru menyebut abad ke-10 hanya sebagai perkiraan artikel, bukan tahun pendirian pasti; angka bejana tidak ditambahkan karena tidak disebut pada artikel rujukan.
- Daftar objek hasil observasi dan persetujuan pengelola; kontak, logo/favicon, dan identitas kontributor yang disetujui.
- URL hasil publish Pano2VR, hostname yang diizinkan, dan domain aplikasi final.
- URL proyek Supabase, publishable key, project reference, dan otorisasi konektor MCP/CLI untuk migration bila pekerjaan database akan dilanjutkan oleh agent. Jangan kirim database password, service role key, atau password admin melalui chat.

Catatan analisis dan hasil verifikasi disimpan pada `doc/catatan/joki/PURA PUSERING JAGAT PEJENG VT/` di workspace induk, mengikuti struktur dokumentasi Gunung Kawi VT.

Referensi teknis: [Next.js App Router](https://nextjs.org/docs/app), [Supabase SSR](https://supabase.com/docs/guides/auth/server-side/creating-a-client?framework=nextjs), [RLS](https://supabase.com/docs/guides/database/postgres/row-level-security), [Storage access control](https://supabase.com/docs/guides/storage/security/access-control), [CLI v3](https://supabase.com/changelog/supabase-cli-v3).
