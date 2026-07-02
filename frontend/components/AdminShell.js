"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import NavbarAdmin from "./NavbarAdmin";

// Kerangka semua halaman admin. Mengecek sesi login di awal dan mengarahkan ke
// halaman login bila belum masuk. Pengecekan ini adalah gerbang pengalaman
// pengguna; keamanan tulis data yang sebenarnya tetap ditegakkan oleh RLS.
export default function AdminShell({ title, subtitle, actions, backHref, children }) {
  const router = useRouter();
  const [memuat, setMemuat] = useState(true);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    let aktif = true;

    async function cekSesi() {
      const { data } = await supabase.auth.getSession();
      if (!aktif) return;
      if (!data.session) {
        router.replace("/admin/login");
        return;
      }
      setUserEmail(data.session.user.email || "");
      setMemuat(false);
    }

    cekSesi();
    return () => {
      aktif = false;
    };
  }, [router]);

  async function keluar() {
    await supabase.auth.signOut();
    router.replace("/admin/login");
  }

  if (memuat) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F5F6F8]">
        <span className="text-[14px] font-medium text-[#6B7A90]">Memuat...</span>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-white md:flex-row">
      <NavbarAdmin userEmail={userEmail} onLogout={keluar} />

      <main className="flex-1 bg-[#F5F6F8]">
        <div className="px-5 py-6 sm:px-9 sm:py-8">
          <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-center gap-3">
              {backHref && (
                <Link
                  href={backHref}
                  className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border-[1.5px] border-[#DDE3ED] bg-white transition-colors hover:bg-[#F5F6F8]"
                >
                  <svg viewBox="0 0 16 16" className="h-[13px] w-[13px]" fill="none" stroke="#6B7A90" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10 4L6 8l4 4M6 8h8" />
                  </svg>
                </Link>
              )}
              <div>
                <h1 className="text-[20px] font-extrabold tracking-[-0.3px] text-[#1C2B3A] sm:text-[22px]">
                  {title}
                </h1>
                {subtitle && (
                  <p className="mt-[2px] text-[13.5px] text-[#6B7A90]">{subtitle}</p>
                )}
              </div>
            </div>
            {actions && <div className="flex-shrink-0">{actions}</div>}
          </div>

          {children}
        </div>
      </main>
    </div>
  );
}
