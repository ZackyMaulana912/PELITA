# PELITA - Portal Peluang Informatika

PELITA adalah portal informasi terpusat untuk peluang magang, beasiswa, dan
program double degree di lingkungan HIMATIFA (Himpunan Mahasiswa Teknik
Informatika, Universitas Muhammadiyah Surabaya). Tujuannya mengumpulkan
informasi peluang yang selama ini tersebar di banyak grup WhatsApp dan media
sosial ke dalam satu tempat resmi, sehingga mahasiswa tidak ketinggalan
kesempatan penting sebelum tenggatnya.

Antarmuka aplikasi mengikuti mockup desain resmi (warna amber dan navy, font
Plus Jakarta Sans) yang diselaraskan dengan dokumen kebutuhan (`PRD.md`) dan
panduan teknis (`CLAUDE.md`).

## Struktur Proyek

```
PELITA/
├── README.md              # Dokumen ini
├── Deployment.md          # Langkah deploy ke Supabase dan Vercel
├── CLAUDE.md              # Panduan teknis dan konvensi kode
├── PRD.md                 # Dokumen kebutuhan produk
├── frontend/             # Aplikasi Next.js (App Router, JavaScript, Tailwind)
│   ├── app/               # Halaman publik dan admin
│   ├── components/        # Komponen antarmuka yang dipakai bersama
│   ├── lib/               # Klien Supabase dan fungsi bantu
│   ├── public/            # Aset statis (logo)
│   └── package.json
└── backend/              # Lapisan backend = Supabase (tanpa server kustom)
    ├── schema.sql         # Tabel, RLS, storage, dan data awal
    └── README.md          # Panduan setup database
```

Catatan arsitektur: PELITA sengaja tidak memakai server backend sendiri. Semua
interaksi data terjadi langsung dari `frontend` ke Supabase melalui pustaka
`@supabase/supabase-js`. Keamanan penulisan data ditegakkan oleh Row Level
Security (RLS) di Postgres, bukan oleh kode di sisi klien.

## Dua Jenis Pengguna

- **Mahasiswa** - pengunjung biasa, tidak perlu membuat akun dan tidak perlu
  login. Hanya dapat melihat daftar peluang, membuka detail, dan mengakses cara
  pendaftaran.
- **Admin HIMATIFA** - wajib login. Dapat menambah, mengubah, dan menghapus
  peluang serta mengelola kategori.

## Teknologi

- Next.js (App Router) dengan JavaScript
- Tailwind CSS
- Supabase: database Postgres, Storage untuk gambar, dan Auth untuk login admin
- Deploy: Vercel (aplikasi) dan Supabase Cloud (backend)

## Struktur Halaman

Sisi publik (tanpa login):

- `/` - Halaman Awal. Dua pilihan peran: Mahasiswa (ke daftar peluang) atau Admin (ke login).
- `/peluang` - Daftar Peluang. Grid kartu berisi seluruh peluang.
- `/peluang/[id]` - Detail Peluang beserta panel cara pendaftaran.

Sisi admin (wajib login):

- `/admin/login` - Halaman masuk admin.
- `/admin` - Kelola Peluang (tabel data dengan aksi ubah dan hapus).
- `/admin/peluang/baru` - Form tambah peluang.
- `/admin/peluang/[id]/ubah` - Form ubah peluang.
- `/admin/kategori` - Kelola kategori.

## Menjalankan Secara Lokal

### 1. Siapkan backend Supabase

Ikuti panduan di `backend/README.md`: jalankan `backend/schema.sql`, pastikan
bucket `peluang-images` ada, lalu buat satu akun admin di Authentication.

### 2. Siapkan dan jalankan frontend

```
cd frontend
cp .env.example .env.local     # lalu isi nilainya dari dashboard Supabase
npm install
npm run dev
```

Aplikasi berjalan di `http://localhost:3000`.

Environment variable yang dibutuhkan (di `frontend/.env.local`):

```
NEXT_PUBLIC_SUPABASE_URL=<URL proyek Supabase>
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<publishable key / anon key>
```

Membuat build produksi:

```
cd frontend
npm run build
npm start
```

## Aturan Bisnis Penting

- Setiap peluang memakai tepat satu cara pendaftaran: **tautan resmi** atau
  **kontak dosen**, tidak pernah keduanya sekaligus dan tidak pernah kosong.
  Aturan ini ditegakkan sekaligus di form dan sebagai CHECK constraint di
  database, sehingga tidak bisa dilanggar meski lewat panggilan API langsung.
- Status **Aktif** atau **Ditutup** tidak disimpan di database, melainkan
  dihitung otomatis dari tanggal tenggat dibanding tanggal hari ini.
- Gambar dikompres di sisi klien sebelum diunggah (lebar maksimum 1200px, target
  ukuran di bawah 500KB) agar kuota Storage tier gratis tidak cepat habis. Rasio
  yang disarankan persegi 1:1; gambar ditampilkan utuh (tidak terpotong) dengan
  latar blur, jadi rasio apa pun tetap aman.

## Catatan dan Risiko

- Proyek Supabase tier gratis akan otomatis di-pause setelah tujuh hari tanpa
  aktivitas. Sebelum demo, buka dahulu dashboard Supabase beberapa menit untuk
  memastikan proyek tidak sedang dalam keadaan pause.
- Tier gratis Supabase tidak memiliki backup otomatis. Data yang terhapus tidak
  bisa dipulihkan otomatis.
- Semua pengguna yang berhasil login dianggap admin penuh. Tidak ada level admin
  bertingkat maupun catatan riwayat siapa mengubah data.

Langkah deploy lengkap ke Supabase dan Vercel ada di `Deployment.md`.
