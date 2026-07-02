"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import LogoPelita from "@/components/LogoPelita";
import { supabase } from "@/lib/supabaseClient";

export default function HalamanLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [kataSandi, setKataSandi] = useState("");
  const [lihatSandi, setLihatSandi] = useState(false);
  const [pesanError, setPesanError] = useState("");
  const [memproses, setMemproses] = useState(false);

  // Kalau sudah ada sesi aktif, langsung arahkan ke dashboard.
  useEffect(() => {
    let aktif = true;
    supabase.auth.getSession().then(({ data }) => {
      if (aktif && data.session) router.replace("/admin");
    });
    return () => {
      aktif = false;
    };
  }, [router]);

  async function tanganiMasuk(e) {
    e.preventDefault();
    setPesanError("");
    setMemproses(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: kataSandi,
    });

    if (error) {
      setPesanError("Email atau kata sandi salah. Silakan coba lagi.");
      setMemproses(false);
      return;
    }

    router.replace("/admin");
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-navy-dark to-navy-light px-4">
      <div className="pointer-events-none absolute -left-16 -top-16 h-[280px] w-[280px] rounded-full bg-white/[0.03]" />
      <div className="pointer-events-none absolute -bottom-20 -right-10 h-[320px] w-[320px] rounded-full bg-amber/[0.06]" />

      <div className="relative w-full max-w-[400px] rounded-[18px] bg-white p-9 shadow-[0_24px_64px_rgba(0,0,0,0.28)]">
        <div className="mb-8 flex flex-col items-center">
          <LogoPelita size={52} radius={14} />
          <div className="mt-[14px] text-[20px] font-extrabold tracking-[-0.4px] text-navy">
            PELITA
          </div>
          <div className="mt-1 text-[12px] font-medium text-[#9BAAB8]">
            Masuk ke Panel Admin HIMATIFA
          </div>
        </div>

        <form onSubmit={tanganiMasuk}>
          <div className="mb-[18px]">
            <label className="mb-[6px] block text-[13px] font-semibold text-[#374151]">
              Email
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <svg viewBox="0 0 16 16" className="h-[14px] w-[14px]" fill="none" stroke="#9BAAB8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1.5" y="4" width="13" height="9" rx="1.5" />
                  <path d="M1.5 5l6.5 5 6.5-5" />
                </svg>
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@himatifa.ac.id"
                className="w-full rounded-[9px] border-[1.5px] border-[#DDE3ED] py-[11px] pl-9 pr-[14px] text-[14px] text-[#1C2B3A] outline-none focus:border-navy"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="mb-[6px] block text-[13px] font-semibold text-[#374151]">
              Kata Sandi
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <svg viewBox="0 0 16 16" className="h-[14px] w-[14px]" fill="none" stroke="#9BAAB8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="7" width="10" height="7" rx="1.5" />
                  <path d="M5 7V5a3 3 0 016 0v2" />
                </svg>
              </div>
              <input
                type={lihatSandi ? "text" : "password"}
                required
                value={kataSandi}
                onChange={(e) => setKataSandi(e.target.value)}
                placeholder="Kata sandi"
                className="w-full rounded-[9px] border-[1.5px] border-[#DDE3ED] py-[11px] pl-9 pr-10 text-[14px] text-[#1C2B3A] outline-none focus:border-navy"
              />
              <button
                type="button"
                onClick={() => setLihatSandi((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                aria-label={lihatSandi ? "Sembunyikan kata sandi" : "Lihat kata sandi"}
              >
                <svg viewBox="0 0 16 16" className="h-[14px] w-[14px]" fill="none" stroke="#9BAAB8" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" />
                  <circle cx="8" cy="8" r="2" />
                </svg>
              </button>
            </div>
          </div>

          {pesanError && (
            <div className="mb-4 rounded-[9px] border border-[#FECDD3] bg-[#FFF1F2] px-[14px] py-[10px] text-[12.5px] font-medium text-[#BE123C]">
              {pesanError}
            </div>
          )}

          <button
            type="submit"
            disabled={memproses}
            className="w-full rounded-[9px] bg-amber py-[13px] text-[14.5px] font-bold text-white shadow-[0_2px_8px_rgba(245,168,35,0.3)] transition-all hover:-translate-y-[2px] hover:bg-amber-hover hover:shadow-[0_8px_18px_rgba(245,168,35,0.42)] disabled:translate-y-0 disabled:opacity-70"
          >
            {memproses ? "Memproses..." : "Masuk"}
          </button>
        </form>

        <Link
          href="/"
          className="mt-6 flex items-center justify-center gap-[6px] text-[13px] font-semibold text-[#6B7A90] transition-colors hover:text-navy"
        >
          <svg viewBox="0 0 16 16" className="h-[13px] w-[13px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 4L6 8l4 4M6 8h8" />
          </svg>
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
