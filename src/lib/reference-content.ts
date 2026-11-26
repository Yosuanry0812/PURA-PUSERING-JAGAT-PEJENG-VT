import type { ContentRow } from "./content";

// Ringkasan editorial dari artikel pilihan pemilik, diperiksa 2026-11-12.
// Dipakai ketika CMS belum dapat diakses; konten CMS terbit tetap diutamakan.
export const referenceSource = {
  title: "Pusering Jagat: Pura Sad Kahyangan di Titik Tengah Bali",
  author: "Tim KKN Desa Pejeng",
  url: "https://desa-pejeng-home.vercel.app/artikel/pura-pusering-jagat",
};

export const referenceHome: ContentRow = {
  id: "reference-home",
  hero_title: "Menjelajahi Warisan Suci Pura Pusering Jagat Pejeng",
  hero_subtitle:
    "Dari kisah Bali Kuno hingga makna ruang suci, kenali Pura Pusering Jagat di Pejeng melalui sejarah, dokumentasi, dan jelajah virtual 360°.",
  hero_cta: "Jelajahi Virtual Tour",
  history_cta: "Jelajahi Sejarah",
  hero_image_url: "reference/main-gate.webp",
  hero_image_alt: "Gerbang utama Pura Pusering Jagat Pejeng",
  intro_image_url: "reference/split-gateway.webp",
  intro_image_alt: "Gerbang terbelah Pura Pusering Jagat Pejeng",
  intro_title: "Mengenal warisan di jantung Pejeng",
  intro_description:
    "Pura Pusering Jagat menyimpan kisah, simbol, dan tradisi yang terus hidup di tengah masyarakat Pejeng. Telusuri pengenalannya terlebih dahulu, lalu baca sejarah untuk memahami konteks setiap peninggalan dan ruangnya.",
  features_title: "Empat pintu untuk mengenal pura",
  heritage_title: "Sejarah & tradisi",
  heritage_description:
    "Baca jejak masa lalu beserta cerita yang diwariskan masyarakat, dengan sumber yang dapat ditelusuri.",
  architecture_title: "Ruang & arsitektur",
  architecture_description:
    "Pahami hubungan antarhalaman dan gerbang sebelum menjelajahi kawasan pura.",
  archaeology_title: "Peninggalan bermakna",
  archaeology_description:
    "Kenali benda dan simbol dalam konteks budayanya melalui narasi pada halaman sejarah.",
  spiritual_title: "Kehidupan spiritual",
  spiritual_description:
    "Dekati setiap kisah dengan penghormatan kepada tradisi dan umat yang menjaga pura.",
  mandala_title: "Tiga ruang, satu perjalanan mengenal pura",
  nista_description:
    "Halaman luar, sebagai awal pengenalan sebelum menuju ruang berikutnya.",
  madya_description:
    "Halaman tengah, yang menghubungkan bagian luar dengan halaman utama.",
  utama_description:
    "Halaman utama, dengan ketentuan akses dan dokumentasi yang mengikuti arahan pengelola.",
  tour_title: "Jelajahi pura dari sudut pandang 360°",
  tour_description:
    "Lihat panduan penggunaan dan ketersediaan tur, lalu mulai penjelajahan ketika pengalaman 360° telah tersedia.",
  tour_cta: "Jelajahi Virtual Tour",
  tour_cover_url: "reference/split-gateway.webp",
  gallery_title: "Cerita pura dalam bingkai",
  conservation_title: "Mengenal adalah awal dari menjaga",
  conservation_description:
    "Gunakan ruang digital ini untuk belajar dan mempersiapkan kunjungan. Saat berada di pura, tetap ikuti petunjuk pengelola, jaga ketenangan, dan minta izin sebelum mendokumentasikan objek atau kegiatan.",
};

export const referenceAbout: ContentRow = {
  id: "reference-about",
  title: "Tentang Pura Pusering Jagat Pejeng",
  image_url: "reference/temple.webp",
  image_alt:
    "Halaman pura dengan pelinggih, gapura belah, dan dua arca penjaga di Pura Pusering Jagat Pejeng",
  background:
    "Pura Pusering Jagat Pejeng sudah lama dikunjungi umat dan wisatawan, tetapi cerita di balik tiap pelinggih dan arcanya jarang tertulis rapi. Situs ini mengumpulkannya di satu tempat: sejarah yang sumbernya bisa ditelusuri, foto objek di setiap halaman pura, dan jelajah virtual 360° yang bisa dibuka sebelum Anda datang.\n\nNarasi awal dirangkum dari artikel Tim KKN Desa Pejeng, dengan Jero Mangku Pura Puser Ing Jagat sebagai narasumber. Hal yang belum pasti, seperti tahun pendirian pura, kami tulis apa adanya sebagai perkiraan.",
  purpose:
    "Menyediakan satu tempat untuk belajar tentang pura: sejarah dengan sumber yang jelas, makna pelinggih dan peninggalan, serta tata ruang Tri Mandala. Tautan rujukan disertakan agar pembaca bisa menelusuri artikel aslinya.",
  benefits:
    "Siapa pun bisa mengenal pura sebelum datang, termasuk mereka yang belum sempat berkunjung langsung. Dokumentasi digital membantu mewariskan pengetahuan ini kepada generasi berikutnya, tanpa menggantikan kunjungan maupun aturan yang ditetapkan pengelola pura.",
};
