-- ============================================================
-- PELITA - Skema Database Supabase
-- Jalankan seluruh isi file ini di Supabase SQL Editor satu kali
-- saat menyiapkan proyek. Nama kolom sengaja disamakan dengan
-- class diagram di paper akademik, jangan diubah tanpa alasan kuat.
-- ============================================================

-- ---------- Tabel ----------

create table if not exists kategori (
  id uuid primary key default gen_random_uuid(),
  nama text not null unique,
  created_at timestamptz default now()
);

create table if not exists peluang (
  id uuid primary key default gen_random_uuid(),
  judul text not null,
  deskripsi text not null,
  penyelenggara text not null,
  "kategoriId" uuid references kategori(id) on delete set null,
  tenggat date not null,
  "caraPendaftaran" text not null check ("caraPendaftaran" in ('tautan', 'dosen')),
  "tautanPendaftaran" text,
  "namaDosen" text,
  "kontakDosen" text,
  "gambarUrl" text,
  "createdAt" timestamptz default now(),
  "updatedAt" timestamptz default now(),

  constraint cara_pendaftaran_konsisten check (
    ("caraPendaftaran" = 'tautan'
      and "tautanPendaftaran" is not null
      and "namaDosen" is null
      and "kontakDosen" is null)
    or
    ("caraPendaftaran" = 'dosen'
      and "namaDosen" is not null
      and "kontakDosen" is not null
      and "tautanPendaftaran" is null)
  )
);

-- ---------- Row Level Security ----------
-- RLS adalah satu-satunya lapisan keamanan sesungguhnya karena semua
-- tulisan ke database terjadi langsung dari browser. Validasi form hanya
-- untuk pengalaman pengguna, bukan pengganti kebijakan di bawah ini.

alter table peluang enable row level security;
alter table kategori enable row level security;

-- Publik (pengunjung anonim) hanya boleh membaca.
create policy "Publik bisa membaca peluang" on peluang
  for select using (true);

create policy "Publik bisa membaca kategori" on kategori
  for select using (true);

-- Hanya pengguna yang sudah login (admin) yang boleh menulis.
create policy "Admin bisa menambah peluang" on peluang
  for insert to authenticated with check (true);

create policy "Admin bisa mengubah peluang" on peluang
  for update to authenticated using (true) with check (true);

create policy "Admin bisa menghapus peluang" on peluang
  for delete to authenticated using (true);

create policy "Admin bisa menambah kategori" on kategori
  for insert to authenticated with check (true);

create policy "Admin bisa mengubah kategori" on kategori
  for update to authenticated using (true) with check (true);

create policy "Admin bisa menghapus kategori" on kategori
  for delete to authenticated using (true);

-- ---------- Storage bucket untuk gambar ----------
-- Buat bucket bernama 'peluang-images' lewat menu Storage dan set Public,
-- lalu jalankan kebijakan berikut.

insert into storage.buckets (id, name, public)
values ('peluang-images', 'peluang-images', true)
on conflict (id) do nothing;

create policy "Publik bisa melihat gambar peluang" on storage.objects
  for select using (bucket_id = 'peluang-images');

create policy "Admin bisa upload gambar peluang" on storage.objects
  for insert to authenticated with check (bucket_id = 'peluang-images');

create policy "Admin bisa hapus gambar peluang" on storage.objects
  for delete to authenticated using (bucket_id = 'peluang-images');

-- ---------- Data kategori awal (opsional) ----------
insert into kategori (nama) values
  ('Magang'),
  ('Beasiswa'),
  ('Double Degree')
on conflict (nama) do nothing;
