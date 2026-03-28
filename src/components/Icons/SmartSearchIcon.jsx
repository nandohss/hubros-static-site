export function SmartSearchIcon({ size = 24, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Lupa (círculo principal) */}
      <circle
        cx="10"
        cy="10"
        r="6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      
      {/* Cabo da lupa */}
      <path
        d="M14.5 14.5L20 20"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      
      {/* Elemento de inteligência - sparkles/estrelas dentro da lupa */}
      <circle
        cx="10"
        cy="8"
        r="1"
        fill="currentColor"
      />
      <circle
        cx="8"
        cy="11"
        r="0.8"
        fill="currentColor"
      />
      <circle
        cx="12"
        cy="11"
        r="0.8"
        fill="currentColor"
      />
      
      {/* Detalhe adicional - pequena estrela no canto superior direito */}
      <path
        d="M18 4L18 6M17 5L19 5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
