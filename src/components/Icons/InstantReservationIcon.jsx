export function InstantReservationIcon({ size = 24, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Corpo do calendário */}
      <rect
        x="4"
        y="5"
        width="16"
        height="16"
        rx="2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Clipes / Aros do calendário */}
      <path
        d="M16 3V7M8 3V7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Linha horizontal */}
      <path
        d="M4 11H20"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Relógio/Raio indicando instantâneo e moderno (sparkle style) */}
      <path
        d="M11 14L13 14L12 17L15 13H13L14 10L11 14Z"
        fill="currentColor"
      />
      {/* Pequeno detalhe brilhante similar ao smart search */}
      <circle cx="17" cy="14" r="0.8" fill="currentColor" />
    </svg>
  );
}
