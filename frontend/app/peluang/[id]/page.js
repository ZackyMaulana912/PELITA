import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import BadgeKategori from "@/components/BadgeKategori";
import BadgeStatus from "@/components/BadgeStatus";
import BannerPeluang from "@/components/BannerPeluang";
import PanelPendaftaran from "@/components/PanelPendaftaran";
import { IkonGedung } from "@/components/Ikon";
import { createServerClient } from "@/lib/supabaseServerClient";
import { hitungStatus } from "@/lib/status";
import { warnaKategori } from "@/lib/kategoriWarna";

export const dynamic = "force-dynamic";

async function ambilPeluang(id) {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("peluang")
    .select("*, kategori(nama)")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return null;
  return data;
}

export default async function HalamanDetail({ params }) {
  const { id } = await params;
  const peluang = await ambilPeluang(id);

  if (!peluang) {
    notFound();
  }

  const namaKategori = peluang.kategori?.nama || null;
  const warna = warnaKategori(namaKategori);
  const status = hitungStatus(peluang.tenggat);

  return (
    <div className="min-h-screen bg-[#F5F6F8]">
      <Navbar />

      <div className="mx-auto max-w-5xl px-5 py-6 sm:px-8">
        <Link
          href="/"
          className="mb-4 inline-flex items-center gap-2 text-[13px] font-semibold text-[#6B7A90] transition-colors hover:text-navy"
        >
          <svg viewBox="0 0 16 16" className="h-[13px] w-[13px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 4L6 8l4 4M6 8h8" />
          </svg>
          Kembali ke daftar peluang
        </Link>

        <div className="overflow-hidden rounded-2xl bg-white shadow-panel">
          {/* Banner: besar mendekati 1:1 saat awal, mengecil saat di-scroll. */}
          <BannerPeluang
            gambarUrl={peluang.gambarUrl}
            judul={peluang.judul}
            warna={warna}
            namaKategori={namaKategori}
          />

          {/* Konten */}
          <div className="grid grid-cols-1 gap-8 p-6 sm:p-10 lg:grid-cols-[1fr_300px] lg:items-start">
            <div>
              <div className="mb-[14px] flex items-center gap-2">
                <BadgeKategori nama={namaKategori} />
                <BadgeStatus status={status} />
              </div>
              <h1 className="mb-[10px] text-[22px] font-extrabold leading-[1.25] tracking-[-0.4px] text-[#1C2B3A] sm:text-[24px]">
                {peluang.judul}
              </h1>
              <div className="mb-6 flex items-center gap-[7px] border-b border-[#F0F4F8] pb-6">
                <IkonGedung className="h-[14px] w-[14px]" />
                <span className="text-[14px] font-semibold text-[#6B7A90]">
                  {peluang.penyelenggara}
                </span>
              </div>

              <h2 className="mb-3 text-[11px] font-bold uppercase tracking-[0.09em] text-[#8A9AB0]">
                Tentang Program
              </h2>
              <p className="whitespace-pre-line text-[14px] leading-[1.75] text-[#3D4E60]">
                {peluang.deskripsi}
              </p>
            </div>

            <PanelPendaftaran peluang={peluang} />
          </div>
        </div>
      </div>

      <footer className="mt-4 border-t border-[#E8EDF4] bg-white px-5 py-6 text-center sm:px-10">
        <p className="text-[12.5px] text-[#9BAAB8]">
          PELITA - Portal Peluang Informatika - HIMATIFA Teknik Informatika
        </p>
      </footer>
    </div>
  );
}
