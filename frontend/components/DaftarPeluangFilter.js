"use client";

import { useMemo, useState } from "react";
import PeluangCard from "./PeluangCard";

// Grid peluang dengan tombol filter kategori di atasnya. Filter berjalan di
// sisi klien atas data yang sudah diambil server, jadi berpindah kategori tidak
// memuat ulang halaman. Daftar tombol dibangun dari kategori yang benar-benar
// dipakai oleh peluang yang ada, ditambah tombol "Semua".
export default function DaftarPeluangFilter({ peluang }) {
  const [aktif, setAktif] = useState("semua");

  const kategoriList = useMemo(() => {
    const set = new Set();
    for (const p of peluang) {
      const nama = p.kategori?.nama;
      if (nama) set.add(nama);
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [peluang]);

  const terfilter = useMemo(() => {
    if (aktif === "semua") return peluang;
    return peluang.filter((p) => p.kategori?.nama === aktif);
  }, [peluang, aktif]);

  if (peluang.length === 0) {
    return (
      <div className="rounded-xl border border-[#E8EDF4] bg-white p-10 text-center">
        <p className="text-[15px] font-bold text-[#1C2B3A]">
          Belum ada peluang yang tersedia
        </p>
        <p className="mt-1 text-[13.5px] text-[#6B7A90]">
          Peluang baru akan muncul di sini setelah ditambahkan oleh admin.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 flex flex-wrap gap-2">
        <TombolFilter
          label="Semua"
          jumlah={peluang.length}
          aktif={aktif === "semua"}
          onClick={() => setAktif("semua")}
        />
        {kategoriList.map((nama) => (
          <TombolFilter
            key={nama}
            label={nama}
            jumlah={peluang.filter((p) => p.kategori?.nama === nama).length}
            aktif={aktif === nama}
            onClick={() => setAktif(nama)}
          />
        ))}
      </div>

      {terfilter.length === 0 ? (
        <div className="rounded-xl border border-[#E8EDF4] bg-white p-10 text-center">
          <p className="text-[14px] font-semibold text-[#6B7A90]">
            Tidak ada peluang pada kategori ini.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {terfilter.map((p) => (
            <PeluangCard key={p.id} peluang={p} />
          ))}
        </div>
      )}
    </>
  );
}

function TombolFilter({ label, jumlah, aktif, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-[7px] rounded-full border px-[15px] py-[7px] text-[13px] font-bold transition-colors ${
        aktif
          ? "border-navy bg-navy text-white"
          : "border-[#DDE3ED] bg-white text-[#4A5568] hover:border-[#B0BCCC] hover:bg-[#F5F6F8]"
      }`}
    >
      {label}
      <span
        className={`rounded-full px-[7px] py-[1px] text-[11px] font-bold ${
          aktif ? "bg-white/20 text-white" : "bg-[#EEF2F7] text-[#8A9AB0]"
        }`}
      >
        {jumlah}
      </span>
    </button>
  );
}
