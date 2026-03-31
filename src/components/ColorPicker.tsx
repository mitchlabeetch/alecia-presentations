import { useState, useRef, useEffect } from "react";

interface Props {
  value: string;
  onChange: (color: string) => void;
  label?: string;
}

const PRESET_COLORS = [
  "#1a3a5c", "#152e4a", "#0f2035", "#1e3a5f", "#2d4a6e",
  "#c9a84c", "#f59e0b", "#d97706", "#b45309", "#92400e",
  "#6b1a2a", "#9b2335", "#dc2626", "#b91c1c", "#991b1b",
  "#1a4a2e", "#166534", "#15803d", "#16a34a", "#22c55e",
  "#111827", "#1f2937", "#374151", "#4b5563", "#6b7280",
  "#06b6d4", "#0891b2", "#0e7490", "#155e75", "#164e63",
  "#7c3aed", "#6d28d9", "#5b21b6", "#4c1d95", "#3b0764",
  "#db2777", "#be185d", "#9d174d", "#831843", "#500724",
];

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

function rgbToHex(r: number, g: number, b: number) {
  return "#" + [r, g, b].map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0")).join("");
}

function hexToHsl(hex: string) {
  let { r, g, b } = hexToRgb(hex);
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToHex(h: number, s: number, l: number) {
  h /= 360; s /= 100; l /= 100;
  let r, g, b;
  if (s === 0) { r = g = b = l; }
  else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1; if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  return rgbToHex(r * 255, g * 255, b * 255);
}

export function ColorPicker({ value, onChange, label }: Props) {
  const [open, setOpen] = useState(false);
  const [hexInput, setHexInput] = useState(value);
  const [hsl, setHsl] = useState(() => hexToHsl(value));
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setHexInput(value);
    setHsl(hexToHsl(value));
  }, [value]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function applyHex(hex: string) {
    if (/^#[0-9a-fA-F]{6}$/.test(hex)) {
      onChange(hex);
      setHsl(hexToHsl(hex));
    }
  }

  function handleHslChange(key: "h" | "s" | "l", val: number) {
    const newHsl = { ...hsl, [key]: val };
    setHsl(newHsl);
    const hex = hslToHex(newHsl.h, newHsl.s, newHsl.l);
    setHexInput(hex);
    onChange(hex);
  }

  return (
    <div className="relative" ref={ref}>
      {label && <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors w-full"
      >
        <div className="w-5 h-5 rounded-md shadow-sm border border-white/20 flex-shrink-0" style={{ background: value }} />
        <span className="text-xs font-mono text-gray-600 flex-1 text-left">{value.toUpperCase()}</span>
        <svg className={`w-3 h-3 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
      </button>

      {open && (
        <div className="absolute z-50 top-full mt-1 left-0 bg-white rounded-xl shadow-xl border border-gray-200 p-3 w-64">
          {/* Color preview */}
          <div className="w-full h-10 rounded-lg mb-3 border border-gray-100" style={{ background: value }} />

          {/* HSL sliders */}
          <div className="space-y-2 mb-3">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-[10px] text-gray-500 font-medium">Teinte</span>
                <span className="text-[10px] text-gray-400 font-mono">{hsl.h}°</span>
              </div>
              <input type="range" min={0} max={360} value={hsl.h}
                onChange={e => handleHslChange("h", +e.target.value)}
                className="w-full h-2 rounded-full cursor-pointer appearance-none"
                style={{ background: `linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)` }}
              />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-[10px] text-gray-500 font-medium">Saturation</span>
                <span className="text-[10px] text-gray-400 font-mono">{hsl.s}%</span>
              </div>
              <input type="range" min={0} max={100} value={hsl.s}
                onChange={e => handleHslChange("s", +e.target.value)}
                className="w-full h-2 rounded-full cursor-pointer appearance-none"
                style={{ background: `linear-gradient(to right, hsl(${hsl.h},0%,${hsl.l}%), hsl(${hsl.h},100%,${hsl.l}%))` }}
              />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-[10px] text-gray-500 font-medium">Luminosité</span>
                <span className="text-[10px] text-gray-400 font-mono">{hsl.l}%</span>
              </div>
              <input type="range" min={0} max={100} value={hsl.l}
                onChange={e => handleHslChange("l", +e.target.value)}
                className="w-full h-2 rounded-full cursor-pointer appearance-none"
                style={{ background: `linear-gradient(to right, #000, hsl(${hsl.h},${hsl.s}%,50%), #fff)` }}
              />
            </div>
          </div>

          {/* Hex input */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs text-gray-400 font-mono">#</span>
            <input
              value={hexInput.replace("#", "")}
              onChange={e => {
                const v = "#" + e.target.value.replace(/[^0-9a-fA-F]/g, "").slice(0, 6);
                setHexInput(v);
                applyHex(v);
              }}
              className="flex-1 px-2 py-1.5 rounded-lg border border-gray-200 text-xs font-mono focus:outline-none focus:border-[#1a3a5c] uppercase"
              maxLength={6}
              placeholder="1a3a5c"
            />
          </div>

          {/* Presets */}
          <div className="grid grid-cols-8 gap-1">
            {PRESET_COLORS.map(c => (
              <button
                key={c}
                type="button"
                onClick={() => { onChange(c); setHexInput(c); setHsl(hexToHsl(c)); }}
                className={`w-6 h-6 rounded-md border-2 transition-transform hover:scale-110 ${value === c ? "border-gray-800 scale-110" : "border-transparent"}`}
                style={{ background: c }}
                title={c}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
