interface LeafBgProps {
  color: string;
}

export default function LeafBg({ color }: LeafBgProps) {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ opacity: 0.07 }}
    >
      <defs>
        <pattern id="lp" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
          <ellipse cx="25" cy="25" rx="16" ry="8" fill={color} transform="rotate(-35 25 25)" />
          <line x1="25" y1="17" x2="25" y2="33" stroke={color} strokeWidth="1.2" />
          <ellipse cx="90" cy="75" rx="16" ry="8" fill={color} transform="rotate(25 90 75)" />
          <line x1="90" y1="67" x2="90" y2="83" stroke={color} strokeWidth="1.2" />
          <ellipse cx="55" cy="100" rx="12" ry="6" fill={color} transform="rotate(-55 55 100)" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#lp)" />
    </svg>
  );
}
