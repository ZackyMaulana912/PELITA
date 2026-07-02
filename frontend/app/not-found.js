import Link from "next/link";
import LogoPelita from "@/components/LogoPelita";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#F5F6F8] px-6 text-center">
      <LogoPelita size={52} radius={14} />
      <h1 className="mt-5 text-[22px] font-extrabold text-[#1C2B3A]">
        Halaman tidak ditemukan
      </h1>
      <p className="mt-2 max-w-sm text-[14px] text-[#6B7A90]">
        Peluang yang kamu cari mungkin sudah dihapus atau tautannya tidak valid.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-[9px] bg-amber px-6 py-3 text-[14px] font-bold text-white shadow-[0_2px_10px_rgba(245,168,35,0.35)] transition-all hover:-translate-y-[2px] hover:bg-amber-hover"
      >
        Kembali ke Beranda
      </Link>
    </div>
  );
}
