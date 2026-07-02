"use client";

import { useEffect, useState } from "react";

// Banner gambar di halaman detail. Saat halaman pertama dibuka, banner tampil
// besar mendekati persegi (1:1); ketika pengguna menggulir ke bawah, tinggi
// banner menyusut halus mengikuti posisi scroll sampai batas minimum, agar
// konten di bawahnya lebih cepat terlihat.
export default function BannerPeluang({ gambarUrl, judul, warna, namaKategori }) {
  const [tinggi, setTinggi] = useState(null);

  useEffect(() => {
    function hitung() {
      // Tinggi awal mendekati 1:1 dengan lebar konten, tapi dibatasi agar tidak
      // melebihi tinggi layar pada perangkat lebar.
      const lebar = Math.min(window.innerWidth, 1024);
      const maks = Math.min(lebar, Math.round(window.innerHeight * 0.72));
      const min = 160;
      const rentang = 260; // jarak scroll (px) untuk transisi dari maks ke min
      const t = Math.max(min, maks - (window.scrollY * (maks - min)) / rentang);
      setTinggi(t);
    }

    hitung();
    window.addEventListener("scroll", hitung, { passive: true });
    window.addEventListener("resize", hitung);
    return () => {
      window.removeEventListener("scroll", hitung);
      window.removeEventListener("resize", hitung);
    };
  }, []);

  return (
    <div
      className="relative overflow-hidden bg-[#EEF2F7]"
      style={{ height: tinggi ? `${tinggi}px` : "72vh" }}
    >
      {gambarUrl ? (
        <>
          {/* Latar blur dari gambar yang sama, mengisi sisi kosong tanpa
              memotong isi gambar. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={gambarUrl}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full scale-110 object-cover blur-lg"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={gambarUrl}
            alt={judul}
            className="relative h-full w-full object-contain"
          />
        </>
      ) : (
        <div
          className="flex h-full w-full items-center justify-center"
          style={{
            background: `repeating-linear-gradient(135deg, ${warna.bg} 0px, ${warna.bg} 18px, ${warna.bg}cc 18px, ${warna.bg}cc 36px)`,
          }}
        >
          <span className="font-mono text-[12px] tracking-[0.05em]" style={{ color: warna.text }}>
            {namaKategori || "peluang"}
          </span>
        </div>
      )}
    </div>
  );
}
