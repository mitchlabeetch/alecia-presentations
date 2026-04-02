interface AleciaLogoProps {
  className?: string;
}

export function AleciaLogo({ className = '' }: AleciaLogoProps) {
  return (
    <svg
      viewBox="0 0 120 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Stylized ampersand / Alecia mark */}
      <text
        x="0"
        y="30"
        fontFamily="Georgia, serif"
        fontSize="32"
        fontWeight="bold"
        fill="currentColor"
      >
        &amp;
      </text>
      <text
        x="35"
        y="30"
        fontFamily="Inter, system-ui, sans-serif"
        fontSize="24"
        fontWeight="600"
        fill="currentColor"
        letterSpacing="-0.02em"
      >
        alecia
      </text>
    </svg>
  );
}
