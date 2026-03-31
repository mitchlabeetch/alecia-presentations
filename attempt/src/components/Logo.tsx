// PitchForge SVG Logo — custom brand mark
export function PitchForgeLogo({ size = 32, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="200" height="200" rx="32" fill="#1a3a5c"/>
      <path d="M55 155 L55 45" stroke="#c9a84c" strokeWidth="14" strokeLinecap="round"/>
      <path d="M55 45 L110 45 Q145 45 145 80 Q145 115 110 115 L55 115" stroke="#c9a84c" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <path d="M120 140 L155 105" stroke="white" strokeWidth="8" strokeLinecap="round" opacity="0.7"/>
      <path d="M140 105 L155 105 L155 120" stroke="white" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.7"/>
    </svg>
  );
}

export function PitchForgeLogoFull({ height = 36, className = "" }: { height?: number; className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <PitchForgeLogo size={height} />
      <span className="font-bold text-[#1a3a5c]" style={{ fontSize: height * 0.55 }}>PitchForge</span>
    </div>
  );
}

// The custom SVG logo from spec (for drop-in slide element)
export const CUSTOM_LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 80" width="300" height="80">
  <rect width="300" height="80" rx="8" fill="#1a3a5c"/>
  <path d="M20 62 L20 18" stroke="#c9a84c" stroke-width="5.5" stroke-linecap="round"/>
  <path d="M20 18 L44 18 Q58 18 58 32 Q58 46 44 46 L20 46" stroke="#c9a84c" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <path d="M48 56 L62 42" stroke="white" stroke-width="3" stroke-linecap="round" opacity="0.7"/>
  <path d="M56 42 L62 42 L62 48" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity="0.7"/>
  <text x="78" y="50" font-family="Inter,Arial,sans-serif" font-weight="800" font-size="28" fill="white">PitchForge</text>
  <text x="78" y="66" font-family="Inter,Arial,sans-serif" font-weight="400" font-size="11" fill="#c9a84c" opacity="0.9">M&amp;A Advisory Platform</text>
</svg>`;

export const PITCHFORGE_LOGO_SVG = CUSTOM_LOGO_SVG;
