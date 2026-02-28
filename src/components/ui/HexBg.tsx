interface HexBgProps {
  color: string;
}

export default function HexBg({ color }: HexBgProps) {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ opacity: 0.06 }}
    >
      <defs>
        <pattern id="hxl" x="0" y="0" width="80" height="70" patternUnits="userSpaceOnUse">
          <polygon
            points="40,5 75,25 75,55 40,75 5,55 5,25"
            fill="none"
            stroke={color}
            strokeWidth="1.2"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#hxl)" />
    </svg>
  );
}
