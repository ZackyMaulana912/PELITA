import Navbar from "@/components/Navbar";
import PeluangCard from "@/components/PeluangCard";
import { createServerClient } from "@/lib/supabaseServerClient";
import { hitungStatus } from "@/lib/status";
import { warnaKategori } from "@/lib/kategoriWarna";

// Halaman publik dibaca langsung dari database di server tiap permintaan,
// tanpa sesi login. force-dynamic memastikan data selalu terkini dan tidak
// dibekukan saat proses build.
export const dynamic = "force-dynamic";

async function ambilPeluang() {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("peluang")
    .select("*, kategori(nama)")
    .order("createdAt", { ascending: false });

  if (error) {
    return { daftar: [], gagal: true };
  }
  return { daftar: data || [], gagal: false };
}

function urutkan(daftar) {
  // Peluang aktif tampil lebih dulu (tenggat terdekat di atas), lalu yang sudah
  // ditutup di bagian bawah.
  return [...daftar].sort((a, b) => {
    const sa = hitungStatus(a.tenggat) === "aktif" ? 0 : 1;
    const sb = hitungStatus(b.tenggat) === "aktif" ? 0 : 1;
    if (sa !== sb) return sa - sb;
    return new Date(a.tenggat) - new Date(b.tenggat);
  });
}

function hitungPerKategori(daftar) {
  const peta = new Map();
  for (const p of daftar) {
    const nama = p.kategori?.nama;
    if (!nama) continue;
    peta.set(nama, (peta.get(nama) || 0) + 1);
  }
  return Array.from(peta, ([nama, jumlah]) => ({ nama, jumlah }));
}

export default async function HalamanDaftar() {
  const { daftar, gagal } = await ambilPeluang();
  const terurut = urutkan(daftar);
  const perKategori = hitungPerKategori(daftar).slice(0, 3);

  return (
    <div className="min-h-screen bg-[#F5F6F8]">
      <Navbar />

      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-navy to-navy-light px-5 py-11 sm:px-10 sm:py-12">
        <div className="pointer-events-none absolute -right-10 -top-16 h-[300px] w-[300px] rounded-full bg-white/[0.03]" />
        <div className="pointer-events-none absolute bottom-[-80px] right-20 h-[220px] w-[220px] rounded-full bg-amber/[0.07]" />
        <div className="relative mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
          <div className="flex-1">
            <div className="mb-[18px] inline-flex items-center gap-[7px] rounded-[20px] border border-amber/40 bg-amber/[0.16] px-[13px] py-[5px]">
              <svg viewBox="0 0 14 14" className="h-[11px] w-[11px] flex-shrink-0" fill="none">
                <circle cx="7" cy="7" r="6" stroke="#F5A823" strokeWidth="1.5" />
                <path d="M7 4v3l2 2" stroke="#F5A823" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-[11.5px] font-bold text-amber">
                {daftar.length} Peluang Tersedia
              </span>
            </div>
            <h1 className="mb-[10px] text-[26px] font-extrabold leading-[1.2] tracking-[-0.4px] text-white sm:text-[30px]">
              Temukan Peluang Terbaikmu
            </h1>
            <p className="max-w-[480px] text-[14.5px] leading-[1.65] text-white/[0.65]">
              Informasi terpusat seputar magang, beasiswa, dan program double
              degree pilihan untuk mahasiswa Teknik Informatika.
            </p>
          </div>

          {perKategori.length > 0 && (
            <div className="flex w-full flex-col gap-[9px] sm:w-auto sm:flex-row lg:flex-col">
              {perKategori.map((k) => {
                const warna = warnaKategori(k.nama);
                return (
                  <div
                    key={k.nama}
                    className="flex flex-1 items-center gap-[13px] rounded-xl border border-white/[0.14] bg-white/10 px-[18px] py-[11px]"
                  >
                    <div
                      className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-[9px]"
                      style={{ background: warna.bg }}
                    >
                      <span className="text-[15px] font-extrabold" style={{ color: warna.text }}>
                        {k.nama.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="text-[20px] font-extrabold leading-none text-white">
                        {k.jumlah}
                      </div>
                      <div className="mt-[2px] text-[11.5px] font-medium text-white/[0.55]">
                        {k.nama}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Daftar kartu */}
      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-10 sm:py-10">
        {gagal ? (
          <div className="rounded-xl border border-[#FDE68A] bg-[#FFFBEB] p-8 text-center">
            <p className="text-[14px] font-semibold text-[#B45309]">
              Data peluang belum dapat dimuat.
            </p>
            <p className="mt-1 text-[13px] text-[#92702A]">
              Pastikan koneksi ke Supabase sudah dikonfigurasi dengan benar.
            </p>
          </div>
        ) : terurut.length === 0 ? (
          <div className="rounded-xl border border-[#E8EDF4] bg-white p-10 text-center">
            <p className="text-[15px] font-bold text-[#1C2B3A]">
              Belum ada peluang yang tersedia
            </p>
            <p className="mt-1 text-[13.5px] text-[#6B7A90]">
              Peluang baru akan muncul di sini setelah ditambahkan oleh admin.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {terurut.map((p) => (
              <PeluangCard key={p.id} peluang={p} />
            ))}
          </div>
        )}
      </div>

      <footer className="border-t border-[#E8EDF4] bg-white px-5 py-6 text-center sm:px-10">
        <p className="text-[12.5px] text-[#9BAAB8]">
          PELITA - Portal Peluang Informatika - HIMATIFA Teknik Informatika
        </p>
      </footer>
    </div>
  );
}
