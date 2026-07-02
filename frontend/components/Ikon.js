// Kumpulan ikon garis kecil yang dipakai berulang di beberapa halaman.
// Dikumpulkan di satu tempat agar tidak menulis ulang path SVG yang sama.

export function IkonGedung({ className = "h-3 w-3" }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={`flex-shrink-0 ${className}`}
      fill="none"
      stroke="#B0BCCC"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 7l6-4 6 4v7H2V7z" />
      <path d="M7 14v-3h2v3" />
    </svg>
  );
}

export function IkonKalender({ className = "h-3 w-3", stroke = "#B0BCCC" }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={`flex-shrink-0 ${className}`}
      fill="none"
      stroke={stroke}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="3" width="12" height="11" rx="1.5" />
      <path d="M5 1.5v3M11 1.5v3M2 7.5h12" />
    </svg>
  );
}

export function IkonTelepon({ className = "h-[13px] w-[13px]", stroke = "#9BAAB8" }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={`flex-shrink-0 ${className}`}
      fill="none"
      stroke={stroke}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="4" y="1" width="8" height="14" rx="2" />
      <path d="M7.5 12h1" />
    </svg>
  );
}

export function IkonAmplop({ className = "h-[13px] w-[13px]", stroke = "#9BAAB8" }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={`flex-shrink-0 ${className}`}
      fill="none"
      stroke={stroke}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="1.5" y="4" width="13" height="9" rx="1.5" />
      <path d="M1.5 5l6.5 5 6.5-5" />
    </svg>
  );
}
