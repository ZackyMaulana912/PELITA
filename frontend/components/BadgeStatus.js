// Badge status aktif/ditutup. Status dihitung dari tenggat, bukan disimpan.
export default function BadgeStatus({ status }) {
  const aktif = status === "aktif";
  const warna = aktif
    ? { bg: "#DCFCE7", text: "#16A34A" }
    : { bg: "#FEE2E2", text: "#DC2626" };
  const label = aktif ? "Aktif" : "Ditutup";

  return (
    <span
      className="inline-block rounded-[5px] px-2 py-[3px] text-[11px] font-bold"
      style={{ background: warna.bg, color: warna.text }}
    >
      {label}
    </span>
  );
}
