import { IkonKalender, IkonTelepon, IkonAmplop } from "./Ikon";
import { formatTanggal } from "@/lib/status";

// Panel "Cara Pendaftaran" di halaman detail. Menampilkan tombol tautan resmi
// bila caraPendaftaran = 'tautan', atau kartu kontak dosen bila = 'dosen'.
// Satu peluang selalu tepat memakai salah satu jalur, tidak pernah keduanya.
export default function PanelPendaftaran({ peluang }) {
  const viaTautan = peluang.caraPendaftaran === "tautan";
  const kontakEmail =
    peluang.kontakDosen && peluang.kontakDosen.includes("@");

  return (
    <div className="rounded-[13px] border-[1.5px] border-[#E8EDF4] bg-[#FAFBFC] p-[22px]">
      <h3 className="mb-[6px] text-[14.5px] font-bold text-[#1C2B3A]">
        Cara Pendaftaran
      </h3>

      {viaTautan ? (
        <>
          <p className="mb-5 text-[13px] leading-[1.65] text-[#6B7A90]">
            Pendaftaran dilakukan secara mandiri melalui tautan resmi
            penyelenggara.
          </p>
          <a
            href={peluang.tautanPendaftaran}
            target="_blank"
            rel="noopener noreferrer"
            className="mb-[14px] flex items-center justify-center gap-2 rounded-[9px] bg-amber p-[13px] shadow-[0_2px_8px_rgba(245,168,35,0.3)] transition-all hover:-translate-y-[2px] hover:bg-amber-hover hover:shadow-[0_6px_16px_rgba(245,168,35,0.42)]"
          >
            <span className="text-[14px] font-bold text-white">Daftar Sekarang</span>
            <svg viewBox="0 0 16 16" className="h-[13px] w-[13px] flex-shrink-0" fill="none">
              <path d="M6.5 3H3a1 1 0 00-1 1v9a1 1 0 001 1h9a1 1 0 001-1V9.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M9 2h5v5M14 2L9 7" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </>
      ) : (
        <>
          <p className="mb-[18px] text-[13px] leading-[1.65] text-[#6B7A90]">
            Pendaftaran dilakukan melalui dosen penanggung jawab. Hubungi beliau
            untuk informasi lebih lanjut dan pengiriman berkas.
          </p>
          <div className="mb-[14px] rounded-[10px] border-[1.5px] border-[#E8EDF4] bg-white p-4">
            <div className="mb-[13px] flex items-center gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-navy to-navy-light">
                <span className="text-base font-bold text-white">
                  {(peluang.namaDosen || "?").charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <div className="text-[13.5px] font-bold leading-[1.2] text-[#1C2B3A]">
                  {peluang.namaDosen}
                </div>
                <div className="mt-[2px] text-[11.5px] font-medium text-[#9BAAB8]">
                  Dosen Penanggung Jawab
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                {kontakEmail ? <IkonAmplop /> : <IkonTelepon />}
                {kontakEmail ? (
                  <a
                    href={`mailto:${peluang.kontakDosen}`}
                    className="break-all text-[12.5px] font-medium text-[#4A5568] hover:text-navy"
                  >
                    {peluang.kontakDosen}
                  </a>
                ) : (
                  <span className="text-[12.5px] font-medium text-[#4A5568]">
                    {peluang.kontakDosen}
                  </span>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      <div className="flex items-center gap-[6px] rounded-[7px] border border-[#FDE68A] bg-[#FFFBEB] px-3 py-[10px]">
        <IkonKalender stroke="#B45309" className="h-3 w-3" />
        <span className="text-[12px] font-semibold text-[#B45309]">
          Berakhir: {formatTanggal(peluang.tenggat)}
        </span>
      </div>
    </div>
  );
}
