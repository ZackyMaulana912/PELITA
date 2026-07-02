"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoPelita from "./LogoPelita";

// Daftar menu admin. Desain awal hanya memuat "Kelola Peluang", tetapi fitur
// Kelola Kategori juga wajib ada sehingga ditambahkan di sini.
const MENU = [
  {
    href: "/admin",
    label: "Kelola Peluang",
    cocok: (path) => path === "/admin" || path.startsWith("/admin/peluang"),
    ikon: (
      <path d="M3 4h10M3 8h10M3 12h10" />
    ),
  },
  {
    href: "/admin/kategori",
    label: "Kelola Kategori",
    cocok: (path) => path.startsWith("/admin/kategori"),
    ikon: (
      <>
        <path d="M2 4.5h5v5H2zM9 4.5h5v5H9zM2 11.5h5M9 11.5h5" />
      </>
    ),
  },
];

function DaftarMenu({ pathname, arah = "kolom" }) {
  return (
    <nav
      className={
        arah === "kolom"
          ? "flex flex-1 flex-col gap-1 p-[10px] pt-4"
          : "flex items-center gap-1"
      }
    >
      {MENU.map((m) => {
        const aktif = m.cocok(pathname);
        return (
          <Link
            key={m.href}
            href={m.href}
            className={`flex items-center gap-[10px] rounded-lg px-3 py-[10px] text-[13.5px] font-bold transition-colors ${
              aktif
                ? "bg-amber/[0.15] text-amber"
                : "text-white/70 hover:bg-white/[0.07] hover:text-white"
            }`}
          >
            <svg
              viewBox="0 0 16 16"
              className="h-[15px] w-[15px] flex-shrink-0"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {m.ikon}
            </svg>
            {m.label}
          </Link>
        );
      })}
    </nav>
  );
}

export default function NavbarAdmin({ userEmail, onLogout }) {
  const pathname = usePathname();

  return (
    <>
      {/* Sidebar untuk layar sedang ke atas */}
      <aside className="hidden w-60 flex-shrink-0 flex-col bg-navy md:flex">
        <div className="border-b border-white/10 px-5 pb-5 pt-6">
          <div className="flex items-center gap-[9px]">
            <LogoPelita size={28} radius={7} />
            <div>
              <div className="text-[14px] font-extrabold leading-[1.1] tracking-[-0.2px] text-white">
                PELITA
              </div>
              <div className="text-[9px] font-semibold uppercase tracking-[0.06em] text-white/45">
                Admin Panel
              </div>
            </div>
          </div>
        </div>

        <DaftarMenu pathname={pathname} />

        <div className="border-t border-white/10 px-[18px] py-4">
          <div className="mb-3 flex items-center gap-[10px]">
            <div className="flex h-[34px] w-[34px] flex-shrink-0 items-center justify-center rounded-full bg-white/15">
              <svg viewBox="0 0 16 16" className="h-[15px] w-[15px]" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" strokeLinecap="round">
                <circle cx="8" cy="5.5" r="3" />
                <path d="M2 14c0-3.3 2.7-6 6-6s6 2.7 6 6" />
              </svg>
            </div>
            <div className="min-w-0">
              <div className="text-[13px] font-bold leading-[1.2] text-white">
                Admin HIMATIFA
              </div>
              <div className="mt-[2px] truncate text-[11px] text-white/45">
                {userEmail || ""}
              </div>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="flex w-full items-center gap-[7px] rounded-[7px] bg-white/[0.07] px-[10px] py-2 text-left transition-colors hover:bg-white/15"
          >
            <svg viewBox="0 0 16 16" className="h-[13px] w-[13px] flex-shrink-0" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 3H3a1 1 0 00-1 1v8a1 1 0 001 1h3" />
              <path d="M10 11l3-3-3-3M13 8H6" />
            </svg>
            <span className="text-[12.5px] font-medium text-white/50">Keluar</span>
          </button>
        </div>
      </aside>

      {/* Bar atas untuk layar kecil */}
      <div className="flex flex-col gap-3 bg-navy px-4 py-3 md:hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-[9px]">
            <LogoPelita size={26} radius={7} />
            <span className="text-[14px] font-extrabold text-white">PELITA</span>
            <span className="text-[9px] font-semibold uppercase tracking-[0.06em] text-white/45">
              Admin
            </span>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-[6px] rounded-[7px] bg-white/[0.07] px-3 py-[6px] transition-colors hover:bg-white/15"
          >
            <svg viewBox="0 0 16 16" className="h-[13px] w-[13px]" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 3H3a1 1 0 00-1 1v8a1 1 0 001 1h3" />
              <path d="M10 11l3-3-3-3M13 8H6" />
            </svg>
            <span className="text-[12px] font-medium text-white/60">Keluar</span>
          </button>
        </div>
        <div className="overflow-x-auto">
          <DaftarMenu pathname={pathname} arah="baris" />
        </div>
      </div>
    </>
  );
}
