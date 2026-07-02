"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import AdminShell from "@/components/AdminShell";
import FormPeluang from "@/components/FormPeluang";
import { supabase } from "@/lib/supabaseClient";

export default function HalamanUbahPeluang() {
  const { id } = useParams();
  const [peluang, setPeluang] = useState(null);
  const [memuat, setMemuat] = useState(true);

  useEffect(() => {
    supabase
      .from("peluang")
      .select("*")
      .eq("id", id)
      .maybeSingle()
      .then(({ data }) => {
        setPeluang(data);
        setMemuat(false);
      });
  }, [id]);

  return (
    <AdminShell
      title="Ubah Peluang"
      subtitle="Kelola Peluang - Ubah Data"
      backHref="/admin"
    >
      {memuat ? (
        <div className="rounded-xl bg-white p-10 text-center text-[14px] text-[#6B7A90] shadow-[0_1px_4px_rgba(0,0,0,0.07)]">
          Memuat data peluang...
        </div>
      ) : !peluang ? (
        <div className="rounded-xl bg-white p-10 text-center shadow-[0_1px_4px_rgba(0,0,0,0.07)]">
          <p className="text-[15px] font-bold text-[#1C2B3A]">
            Peluang tidak ditemukan
          </p>
          <p className="mt-1 text-[13.5px] text-[#6B7A90]">
            Data mungkin sudah dihapus.
          </p>
          <Link
            href="/admin"
            className="mt-4 inline-block rounded-[9px] bg-amber px-5 py-[10px] text-[13.5px] font-bold text-white transition-colors hover:bg-amber-hover"
          >
            Kembali ke daftar
          </Link>
        </div>
      ) : (
        <FormPeluang peluang={peluang} />
      )}
    </AdminShell>
  );
}
