"use client";

import AdminShell from "@/components/AdminShell";
import FormPeluang from "@/components/FormPeluang";

export default function HalamanTambahPeluang() {
  return (
    <AdminShell
      title="Tambah Peluang Baru"
      subtitle="Kelola Peluang - Tambah Baru"
      backHref="/admin"
    >
      <FormPeluang peluang={null} />
    </AdminShell>
  );
}
