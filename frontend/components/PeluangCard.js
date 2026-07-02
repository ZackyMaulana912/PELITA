import Link from "next/link";
import BadgeKategori from "./BadgeKategori";
import BadgeStatus from "./BadgeStatus";
import { IkonGedung, IkonKalender } from "./Ikon";
import { warnaKategori } from "@/lib/kategoriWarna";
import { hitungStatus, formatTanggal } from "@/lib/status";

// Kartu satu peluang di halaman daftar. Seluruh kartu adalah tautan ke halaman
// detail. Status aktif/ditutup dihitung dari tenggat saat render.
export default function PeluangCard({ peluang }) {
  const namaKategori = peluang.kategori?.nama || null;
  const warna = warnaKategori(namaKategori);
  const status = hitungStatus(peluang.tenggat);

  return (
    <Link
      href={`/peluang/${peluang.id}`}
      className="group block overflow-hidden rounded-xl bg-white shadow-card transition-all hover:-translate-y-1 hover:shadow-card-hover"
    >
      <div className="relative aspect-square overflow-hidden bg-[#EEF2F7]">
        {peluang.gambarUrl ? (
          <>
            {/* Latar blur dari gambar yang sama, mengisi sisi kosong saat
                gambar bukan lanskap (mis. poster 1:1) tanpa memotong isinya. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={peluang.gambarUrl}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-full scale-110 object-cover blur-lg"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={peluang.gambarUrl}
              alt={peluang.judul}
              className="relative h-full w-full object-contain"
            />
          </>
        ) : (
          <div
            className="flex h-full w-full items-center justify-center"
            style={{
              background: `repeating-linear-gradient(135deg, ${warna.bg} 0px, ${warna.bg} 14px, ${warna.bg}cc 14px, ${warna.bg}cc 28px)`,
            }}
          >
            <span
              className="font-mono text-[10.5px] tracking-[0.05em]"
              style={{ color: warna.text }}
            >
              {namaKategori || "peluang"}
            </span>
          </div>
        )}
        <div className="absolute right-3 top-3">
          <BadgeStatus status={status} />
        </div>
      </div>

      <div className="p-4">
        <div className="mb-[10px]">
          <BadgeKategori nama={namaKategori} />
        </div>
        <h3 className="mb-[7px] line-clamp-2 text-[14.5px] font-bold leading-[1.35] text-[#1C2B3A]">
          {peluang.judul}
        </h3>
        <div className="mb-3 flex items-center gap-[5px] text-[12.5px] font-medium text-[#6B7A90]">
          <IkonGedung />
          <span className="line-clamp-1">{peluang.penyelenggara}</span>
        </div>
        <div className="flex items-center gap-[6px] border-t border-[#F0F4F8] pt-[11px]">
          <IkonKalender />
          <span className="text-[12px] font-medium text-[#9BAAB8]">
            Berakhir:{" "}
            <span className="font-bold" style={{ color: warna.text }}>
              {formatTanggal(peluang.tenggat)}
            </span>
          </span>
        </div>
      </div>
    </Link>
  );
}
