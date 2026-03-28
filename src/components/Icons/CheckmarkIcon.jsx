export function CheckmarkIcon({ size = 24, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="18" cy="15" r="1.5" fill="currentColor"/>
      <circle cx="7" cy="7" r="1" fill="currentColor"/>
    </svg>
  );
}
