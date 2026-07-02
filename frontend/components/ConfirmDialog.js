"use client";

// Dialog konfirmasi sederhana untuk aksi yang tidak bisa dibatalkan seperti
// menghapus data. Ditampilkan hanya saat prop open bernilai true.
export default function ConfirmDialog({
  open,
  judul,
  pesan,
  labelKonfirmasi = "Hapus",
  onKonfirmasi,
  onBatal,
  sedangProses = false,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-[0_24px_64px_rgba(0,0,0,0.28)]">
        <div className="mb-4 flex items-start gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#FFF1F2]">
            <svg viewBox="0 0 16 16" className="h-5 w-5" fill="none" stroke="#BE123C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 5v4M8 11h.01" />
              <circle cx="8" cy="8" r="6.5" />
            </svg>
          </div>
          <div>
            <h3 className="text-[16px] font-bold text-[#1C2B3A]">{judul}</h3>
            <p className="mt-1 text-[13.5px] leading-[1.6] text-[#6B7A90]">{pesan}</p>
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <button
            onClick={onBatal}
            disabled={sedangProses}
            className="rounded-[9px] border-[1.5px] border-[#DDE3ED] bg-white px-5 py-[10px] text-[13.5px] font-semibold text-[#4A5568] transition-colors hover:bg-[#F5F6F8] disabled:opacity-60"
          >
            Batal
          </button>
          <button
            onClick={onKonfirmasi}
            disabled={sedangProses}
            className="rounded-[9px] bg-[#BE123C] px-5 py-[10px] text-[13.5px] font-bold text-white transition-colors hover:bg-[#9F0F32] disabled:opacity-60"
          >
            {sedangProses ? "Memproses..." : labelKonfirmasi}
          </button>
        </div>
      </div>
    </div>
  );
}
