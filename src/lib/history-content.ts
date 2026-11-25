// Narasi editorial halaman Sejarah. Disusun ulang dari artikel Tim KKN Desa Pejeng
// (narasumber: Jero Mangku Pura Puser Ing Jagat). Jangan menambah fakta di luar artikel.

export const historyHero = {
  label: "JEJAK SEJARAH",
  title: "Sejarah Pura Pusering Jagat",
  description:
    "Dari keyakinan tentang titik tengah semesta hingga jejak Kerajaan Bali Kuno di Pejeng: kisah sebuah pura yang masih dijaga dan dihidupi hingga kini.",
};

export const historySections = [
  { id: "titik-tengah", label: "Di titik tengah semesta" },
  { id: "tiga-pusaka", label: "Tiga pusaka di Utama Mandala" },
  { id: "jejak-bali-kuno", label: "Jejak peradaban Bali Kuno" },
  { id: "tri-mandala", label: "Tri Mandala" },
  { id: "berkunjung", label: "Berkunjung dengan hormat" },
] as const;

export const historyCover = {
  path: "reference/temple.webp",
  alt: "Halaman pura dengan pelinggih, gapura belah, dan dua arca penjaga di Pura Pusering Jagat Pejeng",
};

export const historyIntro = {
  title: "Di titik tengah semesta",
  lead: "Di Desa Pejeng Tengah, Gianyar, berdiri satu dari enam Pura Sad Kahyangan Bali: Pura Pusering Jagat, atau Puser Ing Jagat.",
  paragraphs: [
    "Namanya berarti pusat dunia. Bagi masyarakat setempat, itu bukan sekadar perlambang. Secara turun-temurun, pura ini dipercaya berkedudukan di titik tengah Pulau Bali, tempat Dewa Siwa bersemayam sebagai poros keseimbangan alam semesta. Dari titik inilah, menurut keyakinan tersebut, keseimbangan spiritual pulau berpusat.",
    "Pejeng sendiri dahulu dikenal sebagai jantung pemerintahan Kerajaan Bali Kuno. Tahun pendirian pura belum dapat dipastikan karena catatan pastinya sulit ditemukan. Sejumlah sumber memperkirakan awalnya sekitar abad ke-10 Masehi, bersamaan dengan menyebarnya pengaruh Hindu dari Jawa ke Bali.",
  ],
  bylineLabel: "Narasumber",
  byline: "Jero Mangku Pura Puser Ing Jagat",
};

export const historyFacts = [
  {
    label: "Kedudukan",
    value: "Sad Kahyangan",
    note: "salah satu dari enam pura di Bali",
  },
  {
    label: "Perkiraan awal",
    value: "± Abad ke-10 M",
    note: "tahun pasti belum diketahui",
  },
  { label: "Lokasi", value: "Pejeng Tengah", note: "Kabupaten Gianyar" },
  { label: "Pelestarian", value: "Cagar budaya", note: "Kabupaten Gianyar" },
];

export const historyRelicsIntro = {
  title: "Tiga pusaka di Utama Mandala",
  body: "Di halaman utama pura terdapat tiga peninggalan yang paling sering dikisahkan kepada pengunjung.",
};

export const historyRelics = [
  {
    slug: "bejana-pejeng",
    title: "Bejana Pejeng",
    subtitle: "Wadah tirta bermotif Samudramanthana",
    body: "Bejana batu berbentuk silinder ini berfungsi sebagai wadah air suci atau tirta. Pada dindingnya terpahat relief Samudramanthana, kisah para dewa dan asura mengaduk lautan susu demi memperoleh tirta amerta, air kehidupan. Relief itu menampilkan delapan ekor naga, para dewa penunjang, serta kinnara dan kinnari yang terbang di atas latar pegunungan.",
    image: "reference/pejeng-vessel.webp",
    alt: "Bejana Pejeng, bejana batu silinder berbalut kain, berdiri di bawah bale beratap anyaman",
  },
  {
    slug: "gedong-purusa-predana",
    title: "Gedong Purusa Predana",
    subtitle: "Lingga–Yoni, lambang awal kehidupan",
    body: "Pelinggih ini menaungi simbol Purusa dan Predana: unsur kejiwaan (laki-laki) dan unsur kebendaan (perempuan). Dalam ajaran Hindu, keduanya dipercaya sebagai ciptaan pertama Tuhan sekaligus sumber kehidupan. Umat dari berbagai latar agama yang memohon keturunan kerap bersembahyang di sini.",
    image: "reference/lingas.webp",
    alt: "Kumpulan lingga dan arca batu berbalut kain kuning dan putih di sebuah bale",
  },
  {
    slug: "telaga-maya",
    title: "Telaga Maya",
    subtitle: "Kolam kering dengan kisah magis",
    body: "Di sisi Utama Mandala terdapat sebuah kolam kering. Konon, sesajen atau pekelem yang dihaturkan di telaga ini akan muncul kembali di perairan Nusa Penida, keyakinan yang memperkuat kesakralan Telaga Maya di mata masyarakat setempat.",
    image: "reference/empty-pond.webp",
    alt: "Kolam bundar berbingkai batu dengan dasar berumput di halaman pura",
  },
];

export const historyAncient = {
  title: "Jejak peradaban Bali Kuno",
  body: "Kawasan Pejeng menyimpan banyak peninggalan arkeologis, sehingga wilayah ini diyakini menjadi salah satu pusat peradaban Bali Kuno. Pura Pusering Jagat adalah salah satu saksinya, dan naskah kuno ikut menyebut namanya.",
  image: "reference/old-statues.webp",
  alt: "Bale beratap ijuk berisi arca-arca kuno di halaman pura",
};

export const historyTimeline = [
  {
    era: "± Abad ke-10 M",
    title: "Perkiraan awal pura",
    body: "Sejumlah sumber sejarah menempatkan awal mula pura pada masa ketika pengaruh Hindu dari Jawa mulai menyebar ke Bali. Ini perkiraan, bukan tahun yang telah dibuktikan.",
  },
  {
    era: "Lontar Kusuma Dewa",
    title: "Tempat petapaan Batara Amangkurat",
    body: "Lontar ini menyebut Pura Puser Ing Jagat sebagai tempat petapaan Batara Amangkurat, manifestasi Tuhan sebagai penuntun spiritual bagi para pemimpin.",
  },
  {
    era: "1979",
    title: "Penelitian akademisi UNHI",
    body: "Tim akademisi Universitas Hindu Indonesia mengukuhkan kedudukan pura sebagai salah satu dari enam Pura Sad Kahyangan, sebagaimana diuraikan lontar tentang masa ketika Bali masih bersatu di bawah satu kerajaan.",
  },
  {
    era: "Kini",
    title: "Pura yang tetap hidup",
    body: "Pura menjadi tujuan persembahyangan umat dari berbagai wilayah Bali, sekaligus dijaga kelestariannya sebagai cagar budaya Kabupaten Gianyar.",
  },
];

export const historyMandala = {
  title: "Tri Mandala: tiga ruang menuju kesucian",
  body: "Pura ini menerapkan konsep Tri Mandala, tata ruang khas pura-pura kuno di Bali yang membagi kawasan menjadi tiga tingkat kesucian.",
  closing:
    "Tri Mandala menjadi wadah bagi berbagai pelinggih yang menyimpan makna filosofis mendalam, dari simbol Purusa–Predana hingga perwujudan Catur Lokapala.",
  levels: [
    {
      name: "Nista Mandala",
      place: "Halaman luar",
      body: "Halaman terluar, titik awal memasuki kawasan pura.",
    },
    {
      name: "Madya Mandala",
      place: "Halaman tengah",
      body: "Ruang peralihan antara halaman luar dan halaman utama.",
    },
    {
      name: "Utama Mandala",
      place: "Halaman utama",
      body: "Ruang paling suci, tempat Bejana Pejeng, Gedong Purusa Predana, dan Telaga Maya berada.",
    },
  ],
  photos: [
    {
      image: "reference/split-gateway.webp",
      alt: "Gerbang terbelah Pura Pusering Jagat Pejeng",
    },
    {
      image: "reference/main-gate.webp",
      alt: "Gerbang utama Pura Pusering Jagat Pejeng",
    },
  ],
};

export const historyVisit = {
  title: "Berkunjung dengan hormat",
  body: "Pura Pusering Jagat masih aktif menjalankan tradisi keagamaan turun-temurun. Beberapa hal berikut membantu kunjungan tetap selaras dengan kesucian pura.",
  image: "reference/shrine-umbrellas.webp",
  alt: "Pelinggih berlumut dengan arca, sesajen bunga, dan dua payung upacara putih dan kuning",
  items: [
    {
      icon: "shirt",
      title: "Berpakaian sopan",
      body: "Kenakan kamen (kain sarung) dan/atau selendang yang diikat di pinggang.",
    },
    {
      icon: "flower",
      title: "Menjaga kesucian",
      body: "Perempuan yang sedang dalam masa menstruasi dimohon tidak memasuki area pura, demi menjaga kesucian energi tempat ini.",
    },
    {
      icon: "hand",
      title: "Tidak menyentuh atau memanjat",
      body: "Terutama Bejana Pejeng, arca-arca kuno, dan pelinggih yang berstatus cagar budaya.",
    },
    {
      icon: "quiet",
      title: "Menjaga keheningan",
      body: "Hormati umat yang sedang bersembahyang, terutama saat prosesi piodalan berlangsung.",
    },
    {
      icon: "calendar",
      title: "Waktu kunjungan istimewa",
      body: "Untuk menyaksikan upacara besar, datanglah saat pelaksanaan piodalan tahunan pura.",
    },
  ],
  closingTitle: "Rahajeng rauh!",
  closing: "Selamat menyelami titik tengah semesta di Pura Puser Ing Jagat.",
} as const;
