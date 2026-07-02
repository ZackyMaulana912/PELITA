import Link from "next/link";
import LogoPelita from "./LogoPelita";

// Navbar publik. Tombol "Masuk Admin" adalah satu-satunya pintu ke area admin,
// karena mahasiswa tidak punya akun dan tidak perlu login.
export default function Navbar() {
  return (
    <nav className="flex h-16 items-center justify-between border-b border-[#E8EDF4] bg-white px-5 sm:px-10">
      <Link href="/peluang" className="flex items-center gap-[10px]">
        <LogoPelita size={30} />
        <div>
          <div className="text-[14.5px] font-extrabold leading-[1.1] tracking-[-0.3px] text-navy">
            PELITA
          </div>
          <div className="text-[9px] font-semibold uppercase tracking-[0.07em] text-[#9BAAB8]">
            Portal Peluang Informatika
          </div>
        </div>
      </Link>

      <div className="flex items-center gap-3">
        <span className="hidden text-[13px] font-medium text-[#6B7A90] sm:inline">
          HIMATIFA Teknik Informatika
        </span>
        <Link
          href="/admin/login"
          className="flex items-center gap-[6px] rounded-lg border-[1.5px] border-[#E8EDF4] bg-[#FAFBFC] px-[14px] py-[7px] transition-all hover:-translate-y-[1px] hover:border-navy hover:bg-navy hover:shadow-[0_4px_10px_rgba(30,58,95,0.2)] group"
        >
          <svg
            viewBox="0 0 16 16"
            className="h-3 w-3 flex-shrink-0 text-navy group-hover:text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="7" width="10" height="7" rx="1.5" />
            <path d="M5 7V5a3 3 0 016 0v2" />
          </svg>
          <span className="text-[12.5px] font-bold text-navy group-hover:text-white">
            Masuk Admin
          </span>
        </Link>
      </div>
    </nav>
  );
}
