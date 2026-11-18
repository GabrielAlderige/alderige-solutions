/**
 * Fallback leve (SVG + CSS) exibido enquanto o 3D carrega,
 * ou de forma permanente quando não há suporte a WebGL.
 * Mantém a direção de arte: formas em fita, brilho azul localizado.
 */
export function SceneFallback({ visible }: { visible: boolean }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 transition-opacity duration-1000"
      style={{ opacity: visible ? 1 : 0 }}
    >
      <svg
        className="absolute top-1/2 left-1/2 h-[min(80vh,80vw)] w-[min(80vh,80vw)] -translate-x-1/2 -translate-y-[58%] md:left-[68%] md:-translate-y-1/2"
        viewBox="0 0 400 400"
      >
        <defs>
          <radialGradient id="fb-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0066ff" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#0066ff" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="fb-chrome" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f5f7fa" />
            <stop offset="35%" stopColor="#5c8dff" />
            <stop offset="60%" stopColor="#0b1a3a" />
            <stop offset="85%" stopColor="#00d9ff" />
            <stop offset="100%" stopColor="#f5f7fa" />
          </linearGradient>
        </defs>
        <circle cx="200" cy="200" r="190" fill="url(#fb-glow)" />
        <g fill="none" strokeLinecap="round">
          <path
            d="M200 70 C 300 60, 340 170, 260 230 S 90 320, 110 220 S 250 90, 300 210 S 190 350, 140 270 S 110 120, 200 70 Z"
            stroke="url(#fb-chrome)"
            strokeWidth="16"
            opacity="0.9"
          />
          <ellipse cx="200" cy="205" rx="168" ry="58" stroke="#00d9ff" strokeOpacity="0.35" transform="rotate(-18 200 205)" />
          <ellipse cx="200" cy="200" rx="185" ry="120" stroke="#8993a4" strokeOpacity="0.18" transform="rotate(24 200 200)" />
        </g>
      </svg>
    </div>
  )
}
