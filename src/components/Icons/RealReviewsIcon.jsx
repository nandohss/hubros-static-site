export function RealReviewsIcon({ size = 24, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Estrela principal */}
      <path
        d="M12 4L14.472 9.006L20 9.81L16 13.708L16.944 19.19L12 16.59L7.05601 19.19L8 13.708L4 9.81L9.528 9.006L12 4Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Detalhe de estrelas menores ou sparkles de inteligência */}
      <circle cx="9" cy="8" r="1.5" fill="currentColor" />
      <circle cx="15" cy="12" r="1.5" fill="currentColor" />
    </svg>
  );
}
