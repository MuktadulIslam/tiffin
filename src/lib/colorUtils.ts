/** Parse a hex color string into [r, g, b] components (0–255). */
function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/** Blend a color toward white by `ratio` (0 = original, 1 = white). */
function tint(hex: string, ratio: number): string {
  const [r, g, b] = hexToRgb(hex);
  const t = (c: number) => Math.round(c + (255 - c) * ratio);
  return `#${[t(r), t(g), t(b)].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}

export interface BookColors {
  accent: string;      // base color — buttons, text highlights
  accentLight: string; // ~85% tint — chip/tag backgrounds
  bgMid: string;       // ~70% tint — blobs, mid-tone fills
  bgLight: string;     // ~93% tint — page/card background
}

/** Derive all theme colors from a single base hex color. */
export function deriveColors(color: string): BookColors {
  return {
    accent: color,
    accentLight: tint(color, 0.85),
    bgMid: tint(color, 0.70),
    bgLight: tint(color, 0.93),
  };
}
