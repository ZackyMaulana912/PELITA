// Nama bucket penyimpanan gambar peluang.
export const BUCKET_GAMBAR = "peluang-images";

// Mengambil path file di dalam bucket dari URL publik Supabase Storage.
// URL publik berbentuk: https://<proj>.supabase.co/storage/v1/object/public/peluang-images/<path>
// Mengembalikan null bila URL tidak cocok dengan pola tersebut.
export function pathGambarDariUrl(url) {
  if (!url) return null;
  const penanda = `/public/${BUCKET_GAMBAR}/`;
  const posisi = url.indexOf(penanda);
  if (posisi === -1) return null;
  return url.slice(posisi + penanda.length);
}
