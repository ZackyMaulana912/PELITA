import { warnaKategori } from "@/lib/kategoriWarna";

// Badge kategori sebagai label informasi (bukan filter). Menampilkan nama
// kategori dengan warna sesuai palet. Kategori yang kosong ditampilkan netral.
export default function BadgeKategori({ nama, ukuran = "md" }) {
  const warna = warnaKategori(nama);
  const teks = nama || "Tanpa Kategori";

  const padding = ukuran === "sm" ? "px-2 py-[3px] text-[11px]" : "px-[9px] py-[3px] text-[11px]";

  return (
    <span
      className={`inline-block rounded-[5px] font-bold ${padding}`}
      style={{ background: warna.bg, color: warna.text }}
    >
      {teks}
    </span>
  );
}
