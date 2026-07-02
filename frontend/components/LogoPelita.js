// Logo obor PELITA dengan latar gradien amber. Ukuran diatur lewat prop size.
export default function LogoPelita({ size = 30, radius = 8 }) {
  const iconSize = Math.round(size * 0.53);
  return (
    <div
      className="flex flex-shrink-0 items-center justify-center bg-gradient-to-br from-amber-light to-amber shadow-[0_2px_8px_rgba(245,168,35,0.38)]"
      style={{ width: size, height: size, borderRadius: radius }}
    >
      <svg
        viewBox="0 0 24 24"
        fill="white"
        style={{ width: iconSize, height: iconSize, display: "block" }}
      >
        <path d="M12 3C12 3 18 10.5 18 15C18 18.6 15.3 21 12 21C8.7 21 6 18.6 6 15C6 10.5 12 3 12 3Z" />
        <path
          d="M12 9.5C12 9.5 14.5 13 14.5 15.3C14.5 16.8 13.4 18 12 18C10.6 18 9.5 16.8 9.5 15.3C9.5 13 12 9.5 12 9.5Z"
          fillOpacity="0.35"
        />
      </svg>
    </div>
  );
}
