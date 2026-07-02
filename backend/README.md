# Backend PELITA - Supabase

PELITA tidak memakai server backend kustom. Seluruh interaksi data terjadi
langsung dari aplikasi frontend (Next.js) ke Supabase melalui pustaka
`@supabase/supabase-js`. Karena itu, "backend" proyek ini adalah layanan
Supabase yang dikelola (managed), dan folder ini berisi definisi serta panduan
untuk menyiapkannya.

## Isi Folder

- `schema.sql` - skrip lengkap untuk membangun database: tabel `kategori` dan
  `peluang`, aturan Row Level Security (RLS), bucket penyimpanan gambar, dan data
  kategori awal.

## Komponen Backend di Supabase

1. **Database Postgres** - dua tabel: `kategori` dan `peluang`. Nama kolom
   sengaja disamakan dengan class diagram di paper akademik (judul, tenggat,
   caraPendaftaran, dan seterusnya).
2. **Row Level Security (RLS)** - satu-satunya lapisan keamanan yang sebenarnya.
   Pengunjung anonim (mahasiswa) hanya boleh membaca (SELECT). Hanya pengguna
   yang sudah login (admin) yang boleh menambah, mengubah, dan menghapus data.
3. **Storage** - bucket `peluang-images` (public) untuk menyimpan gambar/banner
   peluang. Gambar dikompres di sisi klien sebelum diunggah.
4. **Auth** - login admin memakai Supabase Auth. Tidak ada tabel admin kustom;
   akun admin dibuat langsung dari dashboard Supabase.

## Cara Menyiapkan

1. Buat proyek baru di [Supabase](https://supabase.com).
2. Buka menu **SQL Editor**, tempelkan seluruh isi `schema.sql`, lalu jalankan.
3. Buka menu **Storage** dan pastikan bucket `peluang-images` ada dan berstatus
   Public (skrip SQL sudah membuatnya secara otomatis).
4. Buka menu **Authentication > Users** dan buat satu akun admin (email dan kata
   sandi). Akun inilah yang dipakai untuk masuk ke panel admin.
5. Ambil nilai `URL` dan `publishable key` dari **Project Settings > API** untuk
   diisikan ke environment variable frontend (lihat `frontend/.env.example`).

## Aturan Penting yang Ditegakkan Database

- **CHECK constraint `cara_pendaftaran_konsisten`** memastikan setiap peluang
  memakai tepat satu jalur pendaftaran: bila `caraPendaftaran = 'tautan'` maka
  `tautanPendaftaran` wajib terisi dan field dosen kosong; bila `= 'dosen'` maka
  `namaDosen` dan `kontakDosen` wajib terisi dan `tautanPendaftaran` kosong.
  Aturan ini tidak bisa dilanggar meskipun lewat panggilan API langsung.
- **Status aktif/ditutup tidak disimpan** sebagai kolom, melainkan dihitung di
  aplikasi dari perbandingan `tenggat` dengan tanggal hari ini.

Langkah deploy lengkap ada di `../Deployment.md`.
