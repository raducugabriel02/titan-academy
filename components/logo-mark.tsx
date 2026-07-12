/**
 * Simbolul Titan Academy — placă ember cu colțuri teșite (geometria .chamfer)
 * și T oblic ca titlurile display. Aceeași grafică cu app/icon.svg și iconițele PWA.
 */
export default function LogoMark({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true" focusable="false">
      <polygon fill="#f97316" points="14,0 64,0 64,50 50,64 0,64 0,14" />
      <path
        fill="#060606"
        transform="translate(32 32) skewX(-12) translate(-32 -32)"
        d="M12 15h40v13H39v22H25V28H12z"
      />
    </svg>
  );
}
