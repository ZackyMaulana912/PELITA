"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { kompresGambar } from "@/lib/imageCompress";
import { BUCKET_GAMBAR, pathGambarDariUrl } from "@/lib/storage";

// Form dipakai bersama oleh halaman Tambah dan Ubah. Bila prop peluang berisi
// data, form berjalan dalam mode ubah; bila null, mode tambah.
//
// Validasi kondisional di sini untuk pengalaman pengguna. Aturan yang sama juga
// ditegakkan sebagai CHECK constraint di database sehingga tidak bisa dilanggar
// lewat panggilan API langsung.
export default function FormPeluang({ peluang }) {
  const router = useRouter();
  const modeUbah = !!peluang;
  const inputFileRef = useRef(null);

  const [judul, setJudul] = useState(peluang?.judul || "");
  const [deskripsi, setDeskripsi] = useState(peluang?.deskripsi || "");
  const [penyelenggara, setPenyelenggara] = useState(peluang?.penyelenggara || "");
  const [kategoriId, setKategoriId] = useState(peluang?.kategoriId || "");
  const [tenggat, setTenggat] = useState(peluang?.tenggat || "");
  const [caraPendaftaran, setCaraPendaftaran] = useState(
    peluang?.caraPendaftaran || "tautan"
  );
  const [tautanPendaftaran, setTautanPendaftaran] = useState(
    peluang?.tautanPendaftaran || ""
  );
  const [namaDosen, setNamaDosen] = useState(peluang?.namaDosen || "");
  const [kontakDosen, setKontakDosen] = useState(peluang?.kontakDosen || "");

  const [daftarKategori, setDaftarKategori] = useState([]);
  const [fileGambar, setFileGambar] = useState(null);
  const [previewGambar, setPreviewGambar] = useState(peluang?.gambarUrl || "");
  const [pesanError, setPesanError] = useState("");
  const [memproses, setMemproses] = useState(false);

  useEffect(() => {
    supabase
      .from("kategori")
      .select("id, nama")
      .order("nama")
      .then(({ data }) => setDaftarKategori(data || []));
  }, []);

  function pilihGambar(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileGambar(file);
    setPreviewGambar(URL.createObjectURL(file));
  }

  function hapusPilihanGambar() {
    setFileGambar(null);
    setPreviewGambar("");
    if (inputFileRef.current) inputFileRef.current.value = "";
  }

  function validasi() {
    if (!judul.trim()) return "Judul peluang wajib diisi.";
    if (!deskripsi.trim()) return "Deskripsi wajib diisi.";
    if (!penyelenggara.trim()) return "Penyelenggara wajib diisi.";
    if (!kategoriId) return "Kategori wajib dipilih.";
    if (!tenggat) return "Tanggal berakhir wajib diisi.";

    if (caraPendaftaran === "tautan") {
      if (!tautanPendaftaran.trim()) return "Tautan pendaftaran wajib diisi.";
      if (!/^https?:\/\//i.test(tautanPendaftaran.trim())) {
        return "Tautan harus diawali dengan http:// atau https://";
      }
    } else {
      if (!namaDosen.trim()) return "Nama dosen wajib diisi.";
      if (!kontakDosen.trim()) return "Kontak dosen wajib diisi.";
    }
    return "";
  }

  async function unggahGambar() {
    const fileKompres = await kompresGambar(fileGambar);
    const namaFile = `${crypto.randomUUID()}.jpg`;
    const { error } = await supabase.storage
      .from(BUCKET_GAMBAR)
      .upload(namaFile, fileKompres, { contentType: "image/jpeg" });
    if (error) throw error;

    const { data } = supabase.storage.from(BUCKET_GAMBAR).getPublicUrl(namaFile);
    return data.publicUrl;
  }

  async function simpan(e) {
    e.preventDefault();
    const error = validasi();
    if (error) {
      setPesanError(error);
      return;
    }

    setPesanError("");
    setMemproses(true);

    try {
      let gambarUrl = peluang?.gambarUrl || null;

      // Unggah gambar baru bila dipilih, lalu hapus gambar lama bila ada.
      if (fileGambar) {
        gambarUrl = await unggahGambar();
        if (modeUbah && peluang.gambarUrl) {
          const pathLama = pathGambarDariUrl(peluang.gambarUrl);
          if (pathLama) {
            await supabase.storage.from(BUCKET_GAMBAR).remove([pathLama]);
          }
        }
      } else if (modeUbah && !previewGambar && peluang.gambarUrl) {
        // Gambar lama dihapus tanpa pengganti.
        const pathLama = pathGambarDariUrl(peluang.gambarUrl);
        if (pathLama) {
          await supabase.storage.from(BUCKET_GAMBAR).remove([pathLama]);
        }
        gambarUrl = null;
      }

      // Susun payload dengan menetapkan field yang tidak dipakai menjadi null
      // agar memenuhi CHECK constraint di database dan membersihkan nilai lama.
      const viaTautan = caraPendaftaran === "tautan";
      const payload = {
        judul: judul.trim(),
        deskripsi: deskripsi.trim(),
        penyelenggara: penyelenggara.trim(),
        kategoriId: kategoriId || null,
        tenggat,
        caraPendaftaran,
        tautanPendaftaran: viaTautan ? tautanPendaftaran.trim() : null,
        namaDosen: viaTautan ? null : namaDosen.trim(),
        kontakDosen: viaTautan ? null : kontakDosen.trim(),
        gambarUrl,
      };

      if (modeUbah) {
        payload.updatedAt = new Date().toISOString();
        const { error: errUpdate } = await supabase
          .from("peluang")
          .update(payload)
          .eq("id", peluang.id);
        if (errUpdate) throw errUpdate;
      } else {
        const { error: errInsert } = await supabase.from("peluang").insert(payload);
        if (errInsert) throw errInsert;
      }

      router.push("/admin");
      router.refresh();
    } catch (err) {
      setPesanError(
        "Gagal menyimpan peluang. Periksa kembali data dan koneksi, lalu coba lagi."
      );
      setMemproses(false);
    }
  }

  const viaTautan = caraPendaftaran === "tautan";

  return (
    <form
      onSubmit={simpan}
      className="rounded-xl bg-white p-6 shadow-[0_1px_4px_rgba(0,0,0,0.07)] sm:p-8"
    >
      <Field label="Judul Peluang">
        <input
          type="text"
          value={judul}
          onChange={(e) => setJudul(e.target.value)}
          className={inputClass}
          placeholder="Contoh: Magang Software Engineer"
        />
      </Field>

      <Field label="Deskripsi">
        <textarea
          rows={4}
          value={deskripsi}
          onChange={(e) => setDeskripsi(e.target.value)}
          className={`${inputClass} resize-y leading-[1.6]`}
          placeholder="Jelaskan program, kualifikasi, dan hal penting lainnya."
        />
      </Field>

      <div className="mb-5 grid grid-cols-1 gap-[18px] sm:grid-cols-2">
        <Field label="Penyelenggara" margin={false}>
          <input
            type="text"
            value={penyelenggara}
            onChange={(e) => setPenyelenggara(e.target.value)}
            className={inputClass}
            placeholder="Contoh: PT Tokopedia"
          />
        </Field>
        <Field label="Kategori" margin={false}>
          <div className="relative">
            <select
              value={kategoriId}
              onChange={(e) => setKategoriId(e.target.value)}
              className={`${inputClass} appearance-none pr-10`}
            >
              <option value="">Pilih kategori</option>
              {daftarKategori.map((k) => (
                <option key={k.id} value={k.id}>
                  {k.nama}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
              <svg viewBox="0 0 16 16" className="h-[14px] w-[14px]" fill="none" stroke="#9BAAB8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 6l4 4 4-4" />
              </svg>
            </div>
          </div>
        </Field>
      </div>

      <div className="mb-5 grid grid-cols-1 gap-[18px] sm:grid-cols-2">
        <Field label="Tanggal Berakhir" margin={false}>
          <input
            type="date"
            value={tenggat}
            onChange={(e) => setTenggat(e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Gambar / Banner (opsional)" margin={false}>
          <input
            ref={inputFileRef}
            type="file"
            accept="image/*"
            onChange={pilihGambar}
            className="hidden"
            id="input-gambar"
          />
          {previewGambar ? (
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewGambar}
                alt="Pratinjau"
                className="h-[46px] w-16 rounded-md object-cover"
              />
              <label
                htmlFor="input-gambar"
                className="cursor-pointer text-[13px] font-semibold text-navy hover:underline"
              >
                Ganti
              </label>
              <button
                type="button"
                onClick={hapusPilihanGambar}
                className="text-[13px] font-semibold text-[#BE123C] hover:underline"
              >
                Hapus
              </button>
            </div>
          ) : (
            <label
              htmlFor="input-gambar"
              className="flex cursor-pointer items-center justify-center gap-[10px] rounded-[9px] border-2 border-dashed border-[#DDE3ED] bg-[#FAFBFC] px-[14px] py-[13px] transition-colors hover:border-navy"
            >
              <svg viewBox="0 0 16 16" className="h-4 w-4 flex-shrink-0" fill="none" stroke="#9BAAB8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 2v9M5 5l3-3 3 3" />
                <path d="M3 13h10" />
              </svg>
              <span className="text-[13px] font-medium text-[#9BAAB8]">
                Klik untuk unggah gambar
              </span>
            </label>
          )}
          <p className="mt-2 text-[11.5px] leading-[1.5] text-[#9BAAB8]">
            Disarankan format persegi 1:1 (contoh 1080 x 1080 px). Gambar
            otomatis dikompres ke lebar maksimum 1200px dan di bawah 500KB, jadi
            unggahan besar tetap aman.
          </p>
        </Field>
      </div>

      {/* Cara Pendaftaran */}
      <div className="mb-5">
        <label className="mb-[10px] block text-[13px] font-semibold text-[#374151]">
          Cara Pendaftaran
        </label>
        <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <OpsiCara
            aktif={viaTautan}
            onClick={() => setCaraPendaftaran("tautan")}
            judul="Via Tautan Resmi"
            keterangan="Tautan pendaftaran eksternal"
          />
          <OpsiCara
            aktif={!viaTautan}
            onClick={() => setCaraPendaftaran("dosen")}
            judul="Via Dosen"
            keterangan="Melalui dosen penanggung jawab"
          />
        </div>

        {viaTautan ? (
          <div className="rounded-[9px] border-[1.5px] border-[#E8EDF4] bg-[#F8FAFC] p-4">
            <Field label="Tautan Pendaftaran" margin={false}>
              <input
                type="url"
                value={tautanPendaftaran}
                onChange={(e) => setTautanPendaftaran(e.target.value)}
                className={inputClass}
                placeholder="https://..."
              />
            </Field>
          </div>
        ) : (
          <div className="flex flex-col gap-[14px] rounded-[9px] border-[1.5px] border-[#E8EDF4] bg-[#F8FAFC] p-4">
            <Field label="Nama Dosen" margin={false}>
              <input
                type="text"
                value={namaDosen}
                onChange={(e) => setNamaDosen(e.target.value)}
                className={inputClass}
                placeholder="Contoh: Dr. Budi Santoso, M.Kom."
              />
            </Field>
            <Field label="Kontak Dosen (nomor HP atau email)" margin={false}>
              <input
                type="text"
                value={kontakDosen}
                onChange={(e) => setKontakDosen(e.target.value)}
                className={inputClass}
                placeholder="Contoh: +62 812 3456 7890 atau dosen@kampus.ac.id"
              />
            </Field>
            <p className="text-[11.5px] leading-[1.5] text-[#9BAAB8]">
              Kontak dosen akan ditampilkan sebagai kartu di halaman detail peluang.
            </p>
          </div>
        )}
      </div>

      {pesanError && (
        <div className="mb-5 rounded-[9px] border border-[#FECDD3] bg-[#FFF1F2] px-[14px] py-[11px] text-[13px] font-medium text-[#BE123C]">
          {pesanError}
        </div>
      )}

      <div className="mt-2 flex justify-end gap-3 border-t border-[#EEF2F7] pt-6">
        <button
          type="button"
          onClick={() => router.push("/admin")}
          disabled={memproses}
          className="rounded-[9px] border-[1.5px] border-[#DDE3ED] bg-white px-6 py-[11px] text-[14px] font-semibold text-[#4A5568] transition-colors hover:border-[#B0BCCC] hover:bg-[#F5F6F8] disabled:opacity-60"
        >
          Batalkan
        </button>
        <button
          type="submit"
          disabled={memproses}
          className="flex items-center gap-2 rounded-[9px] bg-amber px-6 py-[11px] text-[14px] font-bold text-white shadow-[0_2px_10px_rgba(245,168,35,0.35)] transition-all hover:-translate-y-[2px] hover:bg-amber-hover hover:shadow-[0_8px_18px_rgba(245,168,35,0.42)] disabled:translate-y-0 disabled:opacity-70"
        >
          <svg viewBox="0 0 16 16" className="h-[14px] w-[14px]" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 3h7l3 3v7a1 1 0 01-1 1H4a1 1 0 01-1-1V3z" />
            <path d="M9 3v4H5V3" />
            <path d="M5 13v-3h5v3" />
          </svg>
          {memproses ? "Menyimpan..." : "Simpan Peluang"}
        </button>
      </div>
    </form>
  );
}

const inputClass =
  "w-full rounded-[9px] border-[1.5px] border-[#DDE3ED] px-[14px] py-[11px] text-[14px] text-[#1C2B3A] outline-none focus:border-navy";

function Field({ label, children, margin = true }) {
  return (
    <div className={margin ? "mb-5" : ""}>
      <label className="mb-[6px] block text-[13px] font-semibold text-[#374151]">
        {label}
      </label>
      {children}
    </div>
  );
}

function OpsiCara({ aktif, onClick, judul, keterangan }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-[10px] rounded-[9px] border px-4 py-[13px] text-left transition-colors ${
        aktif
          ? "border-2 border-amber bg-[#FFFBEB]"
          : "border-[1.5px] border-[#DDE3ED] bg-white hover:border-[#B0BCCC]"
      }`}
    >
      <div
        className={`flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full border-2 ${
          aktif ? "border-amber" : "border-[#DDE3ED]"
        }`}
      >
        {aktif && <div className="h-[7px] w-[7px] rounded-full bg-amber" />}
      </div>
      <div>
        <div className="text-[13.5px] font-bold text-[#1C2B3A]">{judul}</div>
        <div className="mt-[1px] text-[11.5px] text-[#9BAAB8]">{keterangan}</div>
      </div>
    </button>
  );
}
