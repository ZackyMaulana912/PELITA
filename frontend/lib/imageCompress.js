// Kompresi gambar di sisi klien sebelum diunggah ke Supabase Storage.
// Wajib dijalankan dari Client Component karena memakai Canvas API dan File API
// yang hanya tersedia di browser. Target: lebar maksimum 1200px, ukuran akhir
// diusahakan di bawah 500KB, format JPEG kualitas menurun bertahap bila perlu.

const LEBAR_MAKS = 1200;
const UKURAN_TARGET = 500 * 1024;

export async function kompresGambar(file) {
  const bitmap = await bacaSebagaiBitmap(file);

  let lebar = bitmap.width;
  let tinggi = bitmap.height;
  if (lebar > LEBAR_MAKS) {
    tinggi = Math.round((tinggi * LEBAR_MAKS) / lebar);
    lebar = LEBAR_MAKS;
  }

  const canvas = document.createElement("canvas");
  canvas.width = lebar;
  canvas.height = tinggi;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(bitmap, 0, 0, lebar, tinggi);

  let kualitas = 0.8;
  let blob = await keBlob(canvas, kualitas);

  // Turunkan kualitas bertahap sampai ukuran memenuhi target atau mentok.
  while (blob.size > UKURAN_TARGET && kualitas > 0.4) {
    kualitas -= 0.1;
    blob = await keBlob(canvas, kualitas);
  }

  const namaDasar = file.name.replace(/\.[^.]+$/, "");
  return new File([blob], `${namaDasar}.jpg`, { type: "image/jpeg" });
}

function bacaSebagaiBitmap(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Gambar tidak dapat dibaca"));
    };
    img.src = url;
  });
}

function keBlob(canvas, kualitas) {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), "image/jpeg", kualitas);
  });
}
