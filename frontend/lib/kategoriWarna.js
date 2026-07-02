// Kategori disimpan sebagai data dinamis di database, jadi warnanya tidak bisa
// dipatok mati per nama. Tiga kategori bawaan memakai warna sesuai desain,
// kategori lain memakai palet cadangan yang dipilih stabil dari nama agar
// warnanya konsisten setiap kali dirender.

const WARNA_KHUSUS = {
  Magang: { bg: "#FEF3C7", text: "#B45309", titik: "#B45309" },
  Beasiswa: { bg: "#E0F2FE", text: "#0369A1", titik: "#0369A1" },
  "Double Degree": { bg: "#EDE9FE", text: "#6D28D9", titik: "#6D28D9" },
};

const PALET_CADANGAN = [
  { bg: "#DCFCE7", text: "#15803D", titik: "#15803D" },
  { bg: "#FFE4E6", text: "#BE123C", titik: "#BE123C" },
  { bg: "#E0E7FF", text: "#4338CA", titik: "#4338CA" },
  { bg: "#FEF9C3", text: "#A16207", titik: "#A16207" },
  { bg: "#CFFAFE", text: "#0E7490", titik: "#0E7490" },
];

export function warnaKategori(nama) {
  if (!nama) {
    return { bg: "#EEF2F7", text: "#4A5A6E", titik: "#8A9AB0" };
  }
  if (WARNA_KHUSUS[nama]) {
    return WARNA_KHUSUS[nama];
  }
  let jumlah = 0;
  for (let i = 0; i < nama.length; i++) {
    jumlah = (jumlah + nama.charCodeAt(i)) % PALET_CADANGAN.length;
  }
  return PALET_CADANGAN[jumlah];
}
