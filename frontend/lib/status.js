// Status peluang tidak disimpan di database, dihitung dari tanggal tenggat
// dibandingkan tanggal hari ini. Peluang dianggap masih aktif sampai akhir
// hari tenggatnya (inklusif).

export function hitungStatus(tenggat) {
  const hariIni = new Date();
  hariIni.setHours(0, 0, 0, 0);

  const batas = new Date(tenggat);
  batas.setHours(0, 0, 0, 0);

  return batas >= hariIni ? "aktif" : "ditutup";
}

const NAMA_BULAN = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

const NAMA_BULAN_SINGKAT = [
  "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
  "Jul", "Agt", "Sep", "Okt", "Nov", "Des",
];

// Format tanggal Indonesia, contoh: 31 Juli 2024
export function formatTanggal(tenggat) {
  const d = new Date(tenggat);
  return `${d.getDate()} ${NAMA_BULAN[d.getMonth()]} ${d.getFullYear()}`;
}

// Format tanggal ringkas untuk tabel, contoh: 31 Jul 2024
export function formatTanggalSingkat(tenggat) {
  const d = new Date(tenggat);
  return `${d.getDate()} ${NAMA_BULAN_SINGKAT[d.getMonth()]} ${d.getFullYear()}`;
}
