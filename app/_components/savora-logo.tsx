type SavoraLogoProps = {
  className?: string;
  showWordmark?: boolean;
};

/**
 * Savora's mark pairs an ascending savings path with a sheltering outer arc.
 * The open center keeps the small-size silhouette recognisable, while the two
 * rising terminals imply flexibility and forward momentum.
 */
export function SavoraLogo({
  className = "",
  showWordmark = true,
}: SavoraLogoProps) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg
        viewBox="0 0 40 40"
        className="h-9 w-9 shrink-0"
        role="img"
        aria-label="Savora"
      >
        <defs>
          <linearGradient id="savora-mark" x1="7" y1="5" x2="34" y2="36" gradientUnits="userSpaceOnUse">
            <stop stopColor="#14B8A6" />
            <stop offset="1" stopColor="#0F766E" />
          </linearGradient>
        </defs>
        <rect width="40" height="40" rx="12" fill="#0F172A" />
        <path
          d="M29.7 10.2c-2.3-1.9-5.2-2.9-8.5-2.9-6.8 0-11.8 3.7-11.8 8.8 0 5.4 4.8 7.1 10.1 8.4 3.9 1 6 1.7 6 3.9 0 1.8-1.9 3.1-4.6 3.1-3.1 0-5.8-1.3-8-3.6l-3 3.1c2.8 3 6.7 4.6 11.2 4.6 7 0 11.9-3.9 11.9-9.3 0-5.7-4.9-7.3-10.3-8.7-3.7-.9-5.8-1.6-5.8-3.7 0-1.7 1.8-2.8 4.3-2.8 2.3 0 4.5.8 6.4 2.5l2.1-3.4Z"
          fill="url(#savora-mark)"
        />
        <path
          d="M28.2 8.8 34 10.3l-1.5 5.8"
          fill="none"
          stroke="#A7F3D0"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2.1"
        />
      </svg>
      {showWordmark && (
        <span className="text-xl font-extrabold tracking-[-0.055em] text-slate-950 dark:text-white">
          Savora<span className="text-teal-600 dark:text-emerald-400">.</span>
        </span>
      )}
    </span>
  );
}
