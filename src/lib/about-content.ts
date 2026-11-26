// Teks halaman Tentang Kami (mengikuti wireframe pemilik). Hanya memuat hal yang
// memang ada di situs ini atau diberikan pemilik; jangan menambah klaim baru.

export const aboutHero = {
  label: "PURA PUSERING JAGAT PEJENG",
  title: "Tentang Kami",
  description:
    "Mengenal situs dokumentasi ini, tempat yang ditampilkannya, dan orang-orang yang membantu mewujudkannya.",
};

export const aboutStory = {
  eyebrow: "LATAR BELAKANG",
  title: "Menjaga cerita pura tetap bisa dibaca",
  photoPath: "reference/temple.webp",
  photoAlt:
    "Halaman pura dengan pelinggih, gapura belah, dan dua arca penjaga di Pura Pusering Jagat Pejeng",
};

export const aboutPlace = {
  name: "Pura Pusering Jagat Pejeng",
  address: "Desa Pejeng, Kecamatan Tampaksiring, Kabupaten Gianyar",
};

// Penyusun situs. CMS (modul Kontributor) diutamakan; bila kosong, daftar
// `members` dipakai. Isi: { name: "Nama", role: "Peran" }.
export const aboutTeam = {
  title: "Tim Penyusun",
  members: [
    {
      name: "Kristina Mulyati Jaya",
      role: "INSTIKI (Institut Bisnis dan Teknologi Indonesia)",
    },
  ] as { name: string; role: string }[],
  // Logo kampus penyusun, di bawah nama (berkas: public/logo/instiki.png).
  logo: {
    src: "/logo/instiki.png",
    alt: "Logo INSTIKI, Institut Bisnis dan Teknologi Indonesia",
    width: 900,
    height: 289,
  },
  empty: "Nama tim penyusun akan segera dicantumkan.",
};

export const aboutThanks = {
  title: "Terima kasih kepada",
  people: [
    {
      role: "Dosen Pembimbing",
      name: "Ir. Ida Bagus Ary Indra Iswara, S.Kom., M.Kom.",
    },
    {
      role: "Pemangku Pura Pusering Jagat",
      name: "Dewa Ngakan Putu Bagiana",
    },
  ],
};

// Logo pihak yang terlibat (kampus dll.), baris bawah wireframe. Isi bila berkas
// logo sudah diberikan pemilik: { path: "gambar/logo-x.webp", alt: "Logo X" }.
export const aboutLogos: { path: string; alt: string }[] = [];
