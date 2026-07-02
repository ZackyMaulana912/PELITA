import Link from "next/link";
import LogoPelita from "@/components/LogoPelita";

// Halaman awal (landing). Pengunjung memilih perannya: Mahasiswa untuk melihat
// daftar peluang, atau Admin untuk masuk mengelola isi portal. Halaman ini
// statis dan tidak membaca database sama sekali.
export default function HalamanAwal() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-navy-dark to-navy-light px-5 py-12">
      <div className="pointer-events-none absolute -left-20 -top-20 h-[320px] w-[320px] rounded-full bg-white/[0.03]" />
      <div className="pointer-events-none absolute -bottom-24 -right-16 h-[360px] w-[360px] rounded-full bg-amber/[0.06]" />

      <div className="relative w-full max-w-[820px]">
        <div className="mb-10 flex flex-col items-center text-center">
          <LogoPelita size={64} radius={18} />
          <h1 className="mt-5 text-[30px] font-extrabold tracking-[-0.5px] text-white sm:text-[36px]">
            PELITA
          </h1>
          <p className="mt-2 text-[12.5px] font-bold uppercase tracking-[0.14em] text-amber">
            Portal Peluang Informatika
          </p>
          <p className="mt-3 max-w-[440px] text-[14.5px] leading-[1.65] text-white/[0.62]">
            Informasi terpusat magang, beasiswa, dan program double degree untuk
            mahasiswa Teknik Informatika HIMATIFA.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <KartuPilihan
            href="/peluang"
            judul="Mahasiswa"
            keterangan="Lihat semua peluang yang tersedia. Tanpa perlu membuat akun atau login."
            aksi="Lihat Peluang"
            ikon={<IkonMahasiswa />}
          />
          <KartuPilihan
            href="/admin/login"
            judul="Admin HIMATIFA"
            keterangan="Masuk untuk menambah, mengubah, dan mengelola peluang di portal."
            aksi="Masuk sebagai Admin"
            ikon={<IkonAdmin />}
          />
        </div>

        <p className="mt-9 text-center text-[12px] text-white/[0.4]">
          HIMATIFA - Teknik Informatika - Universitas Muhammadiyah Surabaya
        </p>
      </div>
    </div>
  );
}

function KartuPilihan({ href, judul, keterangan, aksi, ikon }) {
  return (
    <Link
      href={href}
      className="group flex flex-col rounded-[18px] bg-white p-7 shadow-[0_24px_64px_rgba(0,0,0,0.28)] transition-all hover:-translate-y-[3px] hover:shadow-[0_30px_72px_rgba(0,0,0,0.34)]"
    >
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-[14px] bg-navy/[0.06] text-navy transition-colors group-hover:bg-navy group-hover:text-white">
        {ikon}
      </div>
      <h2 className="text-[18px] font-extrabold tracking-[-0.3px] text-navy">
        {judul}
      </h2>
      <p className="mt-[6px] flex-1 text-[13.5px] leading-[1.6] text-[#6B7A90]">
        {keterangan}
      </p>
      <span className="mt-6 inline-flex items-center gap-[7px] text-[13.5px] font-bold text-amber">
        {aksi}
        <svg
          viewBox="0 0 16 16"
          className="h-[13px] w-[13px] transition-transform group-hover:translate-x-1"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 4l4 4-4 4M2 8h8" />
        </svg>
      </span>
    </Link>
  );
}

function IkonMahasiswa() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 8l10-4 10 4-10 4L2 8z" />
      <path d="M6 10v5c0 1.1 2.7 2.5 6 2.5s6-1.4 6-2.5v-5" />
      <path d="M22 8v5" />
    </svg>
  );
}

function IkonAdmin() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l8 3v6c0 5-3.5 8.5-8 11-4.5-2.5-8-6-8-11V5l8-3z" />
      <path d="M9.5 12l1.8 1.8L15 10" />
    </svg>
  );
}
