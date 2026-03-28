export function VoucherIcon({ size = 24, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Ticket/Voucher borda */}
      <path
        d="M19 14.5C17.6193 14.5 16.5 13.3807 16.5 12C16.5 10.6193 17.6193 9.5 19 9.5V6C19 4.89543 18.1046 4 17 4H7C5.89543 4 5 4.89543 5 6V9.5C6.38071 9.5 7.5 10.6193 7.5 12C7.5 13.3807 6.38071 14.5 5 14.5V18C5 19.1046 5.89543 20 7 20H17C18.1046 20 19 19.1046 19 18V14.5Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Linha pontilhada no lado esquerdo ou meio indicando corte */}
      <path
        d="M10 4V20"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray="2 3"
        strokeLinecap="round"
      />
      {/* Símbolo de porcentagem para cupons */}
      <circle cx="13" cy="10" r="1.2" fill="currentColor" />
      <circle cx="16" cy="14" r="1.2" fill="currentColor" />
      <path
        d="M16 10L13 14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
