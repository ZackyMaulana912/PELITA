"use client";

import { useCallback, useEffect, useState } from "react";
import AdminShell from "@/components/AdminShell";
import BadgeKategori from "@/components/BadgeKategori";
import ConfirmDialog from "@/components/ConfirmDialog";
import { supabase } from "@/lib/supabaseClient";

export default function HalamanKelolaKategori() {
  const [daftar, setDaftar] = useState([]);
  const [memuat, setMemuat] = useState(true);

  const [namaBaru, setNamaBaru] = useState("");
  const [menambah, setMenambah] = useState(false);
  const [pesanError, setPesanError] = useState("");

  const [editId, setEditId] = useState(null);
  const [namaEdit, setNamaEdit] = useState("");

  const [target, setTarget] = useState(null);
  const [menghapus, setMenghapus] = useState(false);

  const muatData = useCallback(async () => {
    setMemuat(true);
    const { data } = await supabase
      .from("kategori")
      .select("id, nama")
      .order("nama");
    setDaftar(data || []);
    setMemuat(false);
  }, []);

  useEffect(() => {
    muatData();
  }, [muatData]);

  async function tambahKategori(e) {
    e.preventDefault();
    const nama = namaBaru.trim();
    if (!nama) return;

    setMenambah(true);
    setPesanError("");
    const { error } = await supabase.from("kategori").insert({ nama });
    setMenambah(false);

    if (error) {
      setPesanError(
        error.code === "23505"
          ? "Kategori dengan nama itu sudah ada."
          : "Gagal menambah kategori. Coba lagi."
      );
      return;
    }
    setNamaBaru("");
    muatData();
  }

  function mulaiEdit(k) {
    setEditId(k.id);
    setNamaEdit(k.nama);
    setPesanError("");
  }

  async function simpanEdit(id) {
    const nama = namaEdit.trim();
    if (!nama) return;

    const { error } = await supabase
      .from("kategori")
      .update({ nama })
      .eq("id", id);

    if (error) {
      setPesanError(
        error.code === "23505"
          ? "Kategori dengan nama itu sudah ada."
          : "Gagal mengubah kategori. Coba lagi."
      );
      return;
    }
    setEditId(null);
    muatData();
  }

  async function konfirmasiHapus() {
    if (!target) return;
    setMenghapus(true);
    await supabase.from("kategori").delete().eq("id", target.id);
    setMenghapus(false);
    setTarget(null);
    muatData();
  }

  return (
    <AdminShell
      title="Kelola Kategori"
      subtitle="Tambah, ubah, atau hapus kategori peluang"
    >
      <div className="mx-auto max-w-2xl">
        {/* Form tambah */}
        <form
          onSubmit={tambahKategori}
          className="mb-5 rounded-xl bg-white p-5 shadow-[0_1px_4px_rgba(0,0,0,0.07)]"
        >
          <label className="mb-[6px] block text-[13px] font-semibold text-[#374151]">
            Tambah Kategori Baru
          </label>
          <div className="flex gap-3">
            <input
              type="text"
              value={namaBaru}
              onChange={(e) => setNamaBaru(e.target.value)}
              placeholder="Contoh: Magang"
              className="flex-1 rounded-[9px] border-[1.5px] border-[#DDE3ED] px-[14px] py-[11px] text-[14px] text-[#1C2B3A] outline-none focus:border-navy"
            />
            <button
              type="submit"
              disabled={menambah || !namaBaru.trim()}
              className="flex flex-shrink-0 items-center gap-[7px] rounded-[9px] bg-amber px-5 py-[11px] text-[13.5px] font-bold text-white shadow-[0_2px_10px_rgba(245,168,35,0.35)] transition-all hover:-translate-y-[2px] hover:bg-amber-hover disabled:translate-y-0 disabled:opacity-60"
            >
              <svg viewBox="0 0 16 16" className="h-[14px] w-[14px]" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                <path d="M8 3v10M3 8h10" />
              </svg>
              Tambah
            </button>
          </div>
          {pesanError && (
            <p className="mt-3 text-[12.5px] font-medium text-[#BE123C]">
              {pesanError}
            </p>
          )}
        </form>

        {/* Daftar kategori */}
        <div className="overflow-hidden rounded-xl bg-white shadow-[0_1px_4px_rgba(0,0,0,0.07)]">
          {memuat ? (
            <div className="p-8 text-center text-[14px] text-[#6B7A90]">
              Memuat data...
            </div>
          ) : daftar.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-[14px] font-bold text-[#1C2B3A]">
                Belum ada kategori
              </p>
              <p className="mt-1 text-[13px] text-[#6B7A90]">
                Tambahkan kategori lewat form di atas.
              </p>
            </div>
          ) : (
            <ul>
              {daftar.map((k) => (
                <li
                  key={k.id}
                  className="flex items-center justify-between gap-3 border-b border-[#F0F4F8] px-5 py-[14px] last:border-0"
                >
                  {editId === k.id ? (
                    <>
                      <input
                        type="text"
                        value={namaEdit}
                        onChange={(e) => setNamaEdit(e.target.value)}
                        autoFocus
                        className="flex-1 rounded-[7px] border-[1.5px] border-navy px-[12px] py-[8px] text-[13.5px] text-[#1C2B3A] outline-none"
                      />
                      <div className="flex flex-shrink-0 gap-2">
                        <button
                          onClick={() => simpanEdit(k.id)}
                          className="rounded-md bg-amber px-[14px] py-[7px] text-[12.5px] font-bold text-white transition-colors hover:bg-amber-hover"
                        >
                          Simpan
                        </button>
                        <button
                          onClick={() => setEditId(null)}
                          className="rounded-md border-[1.5px] border-[#DDE3ED] bg-white px-[14px] py-[7px] text-[12.5px] font-semibold text-[#4A5568] transition-colors hover:bg-[#F5F6F8]"
                        >
                          Batal
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <BadgeKategori nama={k.nama} />
                      <div className="flex flex-shrink-0 gap-2">
                        <button
                          onClick={() => mulaiEdit(k)}
                          className="flex items-center gap-[5px] rounded-md border-[1.5px] border-[#DDE3ED] bg-white px-[11px] py-[5px] text-[12px] font-semibold text-[#374151] transition-colors hover:border-[#B0BCCC] hover:bg-[#F5F6F8]"
                        >
                          <svg viewBox="0 0 16 16" className="h-[11px] w-[11px]" fill="none" stroke="#6B7A90" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 2.5l2.5 2.5L5 13.5H2.5V11L11 2.5z" />
                            <path d="M9 4.5l2 2" />
                          </svg>
                          Ubah
                        </button>
                        <button
                          onClick={() => setTarget(k)}
                          className="flex items-center gap-[5px] rounded-md border-[1.5px] border-[#FECDD3] bg-[#FFF1F2] px-[11px] py-[5px] text-[12px] font-semibold text-[#BE123C] transition-colors hover:border-[#FDA4AF] hover:bg-[#FFE1E4]"
                        >
                          <svg viewBox="0 0 16 16" className="h-[11px] w-[11px]" fill="none" stroke="#BE123C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M2 4.5h12M6 4.5V3h4v1.5M5 4.5l.7 9h4.6l.7-9" />
                          </svg>
                          Hapus
                        </button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={!!target}
        judul="Hapus kategori ini?"
        pesan={
          target
            ? `Kategori "${target.nama}" akan dihapus. Peluang yang memakai kategori ini tidak ikut terhapus, hanya kehilangan labelnya.`
            : ""
        }
        onKonfirmasi={konfirmasiHapus}
        onBatal={() => setTarget(null)}
        sedangProses={menghapus}
      />
    </AdminShell>
  );
}
