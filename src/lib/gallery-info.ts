// Nama dan penjelasan singkat tiap objek (dari Tabel 3.1–3.3 materi pemilik).
// Kunci = nama berkas tanpa ekstensi, huruf kecil. Urutan = urutan tabel.
// Berkas yang tidak terdaftar tetap tampil, memakai judul dari nama berkas.
type Row = [file: string, title: string, description: string];

const nista: Row[] = [
  [
    "pelinggih ratu pande",
    "Pelinggih Ratu Pande",
    "Dipercaya sebagai ratu penjaga Pura Pusering Jagat.",
  ],
  [
    "kalangan tajen",
    "Kalangan Tajen",
    "Tempat pelaksanaan Tajen Tabuh Rah dalam rangkaian upacara keagamaan Hindu Bali.",
  ],
  [
    "kori agung",
    "Kori Agung",
    "Pintu gerbang utama yang menghubungkan Jaba Tengah dengan Jeroan (Utama Mandala) dan menjadi akses masuk ke area paling suci pura.",
  ],
  [
    "bale saka pat 2",
    "Bale Saka Pat",
    "Pos penjagaan pecalang, tempat warga beristirahat sejenak, dan tempat merapikan banten sebelum masuk ke area suci.",
  ],
  [
    "pelinggih ratu kemong",
    "Pelinggih Ratu Kemong",
    "Tempat pemujaan Ratu Kemong yang dipercaya menjaga kesucian dan keharmonisan kawasan pura serta mendukung kelancaran upacara keagamaan.",
  ],
  [
    "ratu pendanda",
    "Ratu Pendanda",
    "Tempat pemujaan Ratu Pendanda sebagai simbol kesucian dan pembimbing spiritual umat Hindu.",
  ],
  [
    "wantilan",
    "Wantilan",
    "Tempat berkumpul, pelaksanaan kegiatan adat dan keagamaan, serta pertunjukan kesenian atau rapat yang berkaitan dengan aktivitas pura.",
  ],
];

const madya: Row[] = [
  [
    "pelinggih ratu penyapa",
    "Pelinggih Ratu Penyapa",
    "Tempat pemujaan yang dipercaya sebagai simbol penyambutan dan perlindungan bagi umat yang datang bersembahyang.",
  ],
  [
    "bale pesandekan",
    "Bale Pesandekan",
    "Tempat umat atau pengunjung beristirahat dan menunggu.",
  ],
  [
    "balai gede",
    "Balai Gede",
    "Bangunan tempat pelaksanaan kegiatan adat dan keagamaan di Pura Pusering Jagat.",
  ],
  [
    "arca ganesha",
    "Arca Ganesha",
    "Salah satu peninggalan arkeologis di kawasan Pura Pusering Jagat Pejeng.",
  ],
];

const utama: Row[] = [
  [
    "bale saka pat",
    "Bale Saka Pat",
    "Tempat menaruh perangkat gamelan (gong) untuk mengiringi jalannya upacara Yadnya.",
  ],
  [
    "bale pawedan",
    "Bale Pawedan",
    "Tempat duduk khusus Sulinggih (Pedanda, Sri Empu, Pandita) untuk melantunkan puja mantra weda dan memimpin upacara besar di pura.",
  ],
  [
    "pelinggih ratu mas",
    "Pelinggih Ratu Mas",
    "Tempat memohon kelancaran rezeki, kemakmuran, dan keberhasilan usaha atau perdagangan.",
  ],
  [
    "gedong kaler",
    "Gedong Kaler",
    "Tempat menyimpan benda sakral pura (pratima, barong, lontar suci) sekaligus stana sementara Ida Bhatara saat pujawali.",
  ],
  [
    "pelinggih padmasana surya",
    "Pelinggih Padmasana Surya",
    "Tempat memohon kesaksian (Siwa Saksi) kepada Sang Hyang Widhi Wasa atau Dewa Surya agar upacara sah dan direstui secara spiritual.",
  ],
  [
    "gedong ratu nusa",
    "Gedong Ratu Nusa",
    "Pelinggih yang disucikan sebagai stana Ratu Nusa, tempat umat menghaturkan bhakti dan memohon keselamatan, kesejahteraan, serta perlindungan spiritual.",
  ],
  [
    "kolam telaga maya",
    "Kolam Telaga Maya",
    "Sumber air suci (tirta) yang melambangkan kesucian, kehidupan, dan penyucian spiritual bagi umat yang bersembahyang.",
  ],
  [
    "pelinggih hiasan ratu payogan",
    "Pelinggih Hiasan Ratu Payogan",
    "Tempat penghormatan dan pelengkap sarana pemujaan saat upacara keagamaan di pura.",
  ],
  [
    "pelinggih payogan ida",
    "Pelinggih Payogan Ida",
    "Tempat beristirahatnya Ida Bhatara atau Ida Sesuhunan saat berada di pura, dipakai dalam rangkaian upacara keagamaan.",
  ],
  [
    "pelinggih ratu sangku sudamala",
    "Pelinggih Ratu Sangku Sudamala",
    "Pelinggih yang disucikan sebagai stana kekuatan penyucian (Sudamala), tempat memohon pembersihan diri lahir dan batin serta keselamatan.",
  ],
  [
    "bale pemangku sudamala",
    "Bale Pemangku Sudamala",
    "Tempat pemangku mempersiapkan dan melaksanakan upacara penyucian (Sudamala) serta memimpin persembahyangan di pura.",
  ],
  [
    "bale kulkul",
    "Bale Kulkul",
    "Tempat menggantung dan membunyikan kulkul, alat komunikasi suci untuk memanggil warga, menandai dimulainya upacara, atau memberi tanda bahaya.",
  ],
  [
    "pelinggih ratu gedong klon",
    "Pelinggih Ratu Gedong Klotok (Klon)",
    "Pelinggih yang oleh masyarakat dan pemangku setempat disebut sebagai stana pelindung tertentu dalam kompleks pura.",
  ],
  [
    "pelinggih ratu agung",
    "Pelinggih Ratu Agung",
    "Stana manifestasi Tuhan atau leluhur yang menjadi pemimpin dan penguasa niskala (spiritual) di wilayah pura.",
  ],
  [
    "pelinggih ratu sanghyang segara",
    "Pelinggih Ratu Sanghyang Segara",
    "Tempat pemujaan manifestasi Tuhan dalam wujud Dewa Baruna, penguasa lautan.",
  ],
  [
    "pesanekan",
    "Bale Pesanekan",
    "Tempat transit umat untuk beristirahat sekaligus menata sesajen (banten).",
  ],
  [
    "pelinggih ida ratu agung",
    "Pelinggih Ida Ratu Agung",
    "Stana manifestasi penguasa, pelindung, dan pemimpin niskala (spiritual) di wilayah pura.",
  ],
  [
    "pelinggih ratu lingga yoni",
    "Pelinggih Ratu Lingga Yoni",
    "Tempat memohon kesuburan, kemakmuran, keharmonisan hidup, dan kelancaran keturunan.",
  ],
  [
    "pelinggih ratu sidakarya",
    "Pelinggih Ratu Sidakarya",
    "Tempat memohon keberhasilan dan kesempurnaan pelaksanaan upacara.",
  ],
  [
    "gedong penyimpanan",
    "Gedong Penyimpanan",
    "Tempat suci menyimpan benda sakral milik pura, seperti pratima, barong, atau pusaka suci lainnya.",
  ],
  [
    "pelinggih pengaruman ida",
    "Pelinggih Pengaruman Ida",
    "Tempat berstana sementara bagi Ida Bhatara saat berkumpul bersama pada upacara besar (piodalan).",
  ],
  [
    "bale pawedan pemangku",
    "Bale Pawedan Pemangku",
    "Tempat duduk khusus pemangku untuk melafalkan puja mantra serta meletakkan alat ritual seperti genta, dupa, dan air suci (sangku).",
  ],
  [
    "bale pengaruman",
    "Bale Pengaruman",
    "Tempat menyucikan dan menghias pratima serta sesajen sebelum upacara besar dimulai.",
  ],
];

const sejarah: Row[] = [
  [
    "sejarah",
    "Sejarah Pura Pusering Jagat",
    "Video dokumentasi sejarah Pura Pusering Jagat Pejeng.",
  ],
];

export const GALLERY_INFO: Record<string, Row[]> = {
  "nista-mandala": nista,
  "madya-mandala": madya,
  "utama-mandala": utama,
  sejarah,
};

export const fileKey = (file: string) =>
  file
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
