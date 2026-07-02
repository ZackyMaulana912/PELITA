"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import AdminShell from "@/components/AdminShell";
import BadgeKategori from "@/components/BadgeKategori";
import BadgeStatus from "@/components/BadgeStatus";
import ConfirmDialog from "@/components/ConfirmDialog";
import { supabase } from "@/lib/supabaseClient";
import { hitungStatus, formatTanggalSingkat } from "@/lib/status";
import { warnaKategori } from "@/lib/kategoriWarna";
import { pathGambarDariUrl } from "@/lib/storage";

export default function HalamanKelolaPeluang() {
  const [daftar, setDaftar] = useState([]);
  const [memuat, setMemuat] = useState(true);
  const [target, setTarget] = useState(null);
  const [menghapus, setMenghapus] = useState(false);

  const muatData = useCallback(async () => {
    setMemuat(true);
    const { data } = await supabase
      .from("peluang")
      .select("*, kategori(nama)")
      .order("createdAt", { ascending: false });
    setDaftar(data || []);
    setMemuat(false);
  }, []);

  useEffect(() => {
    muatData();
  }, [muatData]);

  async function konfirmasiHapus() {
    if (!target) return;
    setMenghapus(true);

    // Hapus gambar dari storage lebih dulu (kalau ada), lalu baris datanya.
    if (target.gambarUrl) {
      const path = pathGambarDariUrl(target.gambarUrl);
      if (path) {
        await supabase.storage.from("peluang-images").remove([path]);
      }
    }
    await supabase.from("peluang").delete().eq("id", target.id);

    setMenghapus(false);
    setTarget(null);
    muatData();
  }

  const tombolTambah = (
    <Link
      href="/admin/peluang/baru"
      className="flex items-center gap-[7px] rounded-[9px] bg-amber px-[18px] py-[10px] text-[13.5px] font-bold text-white shadow-[0_2px_10px_rgba(245,168,35,0.35)] transition-all hover:-translate-y-[2px] hover:bg-amber-hover hover:shadow-[0_8px_18px_rgba(245,168,35,0.42)]"
    >
      <svg viewBox="0 0 16 16" className="h-[14px] w-[14px]" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
        <path d="M8 3v10M3 8h10" />
      </svg>
      Tambah Peluang
    </Link>
  );

  return (
    <AdminShell
      title="Kelola Peluang"
      subtitle="Kelola semua peluang yang tayang di portal PELITA"
      actions={tombolTambah}
    >
      <div className="overflow-hidden rounded-xl bg-white shadow-[0_1px_4px_rgba(0,0,0,0.07)]">
        {memuat ? (
          <div className="p-10 text-center text-[14px] text-[#6B7A90]">
            Memuat data...
          </div>
        ) : daftar.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-[15px] font-bold text-[#1C2B3A]">Belum ada peluang</p>
            <p className="mt-1 text-[13.5px] text-[#6B7A90]">
              Tekan tombol Tambah Peluang untuk membuat peluang pertama.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-[#E8EDF4] bg-[#F8FAFC]">
                  <Th className="w-[72px]">Gambar</Th>
                  <Th>Judul</Th>
                  <Th className="w-[130px]">Kategori</Th>
                  <Th className="w-[120px]">Berakhir</Th>
                  <Th className="w-[90px]">Status</Th>
                  <Th className="w-[150px]">Aksi</Th>
                </tr>
              </thead>
              <tbody>
                {daftar.map((p) => {
                  const namaKategori = p.kategori?.nama || null;
                  const warna = warnaKategori(namaKategori);
                  return (
                    <tr key={p.id} className="border-b border-[#F0F4F8] last:border-0">
                      <td className="px-4 py-3">
                        {p.gambarUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={p.gambarUrl}
                            alt=""
                            className="h-[38px] w-[52px] rounded-md object-cover"
                          />
                        ) : (
                          <div
                            className="h-[38px] w-[52px] rounded-md"
                            style={{
                              background: `repeating-linear-gradient(135deg, ${warna.bg} 0px, ${warna.bg} 8px, ${warna.bg}cc 8px, ${warna.bg}cc 16px)`,
                            }}
                          />
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-[13.5px] font-semibold text-[#1C2B3A]">
                          {p.judul}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <BadgeKategori nama={namaKategori} ukuran="sm" />
                      </td>
                      <td className="px-4 py-3 text-[13px] font-medium text-[#6B7A90]">
                        {formatTanggalSingkat(p.tenggat)}
                      </td>
                      <td className="px-4 py-3">
                        <BadgeStatus status={hitungStatus(p.tenggat)} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-[7px]">
                          <Link
                            href={`/admin/peluang/${p.id}/ubah`}
                            className="flex items-center gap-[5px] rounded-md border-[1.5px] border-[#DDE3ED] bg-white px-[11px] py-[5px] text-[12px] font-semibold text-[#374151] transition-colors hover:border-[#B0BCCC] hover:bg-[#F5F6F8]"
                          >
                            <svg viewBox="0 0 16 16" className="h-[11px] w-[11px]" fill="none" stroke="#6B7A90" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M11 2.5l2.5 2.5L5 13.5H2.5V11L11 2.5z" />
                              <path d="M9 4.5l2 2" />
                            </svg>
                            Ubah
                          </Link>
                          <button
                            onClick={() => setTarget(p)}
                            className="flex items-center gap-[5px] rounded-md border-[1.5px] border-[#FECDD3] bg-[#FFF1F2] px-[11px] py-[5px] text-[12px] font-semibold text-[#BE123C] transition-colors hover:border-[#FDA4AF] hover:bg-[#FFE1E4]"
                          >
                            <svg viewBox="0 0 16 16" className="h-[11px] w-[11px]" fill="none" stroke="#BE123C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M2 4.5h12M6 4.5V3h4v1.5M5 4.5l.7 9h4.6l.7-9" />
                            </svg>
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!target}
        judul="Hapus peluang ini?"
        pesan={
          target
            ? `Peluang "${target.judul}" akan dihapus permanen dan tidak bisa dikembalikan.`
            : ""
        }
        onKonfirmasi={konfirmasiHapus}
        onBatal={() => setTarget(null)}
        sedangProses={menghapus}
      />
    </AdminShell>
  );
}

function Th({ children, className = "" }) {
  return (
    <th
      className={`px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[0.07em] text-[#8A9AB0] ${className}`}
    >
      {children}
    </th>
  );
}
