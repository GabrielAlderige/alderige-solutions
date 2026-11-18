import type { ServiceVisual as Kind } from '@/data/services'

/**
 * Composições gráficas próprias de cada serviço.
 * SVG animado via CSS (leve, pausado fora da tela e com reduced-motion).
 */
export function ServiceVisual({ kind }: { kind: Kind }) {
  switch (kind) {
    case 'web':
      return <WebVisual />
    case 'automation':
      return <AutomationVisual />
    case 'ai':
      return <AIVisual />
    case 'consulting':
      return <ConsultingVisual />
  }
}

const frame = 'h-full w-full text-graphite'

/** Estrutura de interface sendo montada: grid, blocos e cursor de layout. */
function WebVisual() {
  return (
    <svg viewBox="0 0 320 240" className={frame} aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="0.75" opacity="0.5">
        <rect x="20" y="20" width="280" height="200" rx="6" />
        <path d="M20 42h280" />
        {[0, 1, 2].map((i) => (
          <circle key={i} cx={34 + i * 10} cy="31" r="2.5" />
        ))}
        {Array.from({ length: 7 }).map((_, i) => (
          <path key={i} d={`M${60 + i * 34} 42v178`} strokeDasharray="1 4" opacity="0.6" />
        ))}
      </g>
      <g>
        <rect x="40" y="60" width="150" height="14" rx="2" fill="#F5F7FA" className="block-shift" style={{ ['--shift' as string]: '18px' }} />
        <rect x="40" y="82" width="96" height="14" rx="2" fill="#F5F7FA" opacity="0.35" />
        <rect x="40" y="112" width="70" height="22" rx="11" fill="#0066FF" />
        <rect x="118" y="112" width="58" height="22" rx="11" fill="none" stroke="#8993A4" strokeWidth="0.75" />
        <rect x="200" y="60" width="80" height="140" rx="4" fill="none" stroke="#00D9FF" strokeWidth="0.75" />
        <rect x="208" y="68" width="64" height="64" rx="2" fill="#00D9FF" opacity="0.12" className="block-shift" style={{ ['--shift' as string]: '-6px' }} />
        <rect x="40" y="150" width="140" height="50" rx="3" fill="none" stroke="#8993A4" strokeWidth="0.75" />
        <path d="M48 186 l20 -14 l18 8 l22 -18 l20 10 l20 -12 l24 6" fill="none" stroke="#00D9FF" strokeWidth="1" />
      </g>
      <text x="300" y="234" textAnchor="end" className="font-mono" fontSize="7" fill="#8993A4">
        GRID 12 · RESPONSIVE
      </text>
    </svg>
  )
}

/** Nós conectados com dados fluindo entre etapas. */
function AutomationVisual() {
  const nodes = [
    { x: 40, y: 120, l: 'TRIGGER' },
    { x: 125, y: 60, l: 'CRM' },
    { x: 125, y: 180, l: 'API' },
    { x: 210, y: 120, l: 'RULES' },
    { x: 285, y: 120, l: 'NOTIFY' },
  ]
  const paths = [
    'M52 120 C 90 120, 90 60, 113 60',
    'M52 120 C 90 120, 90 180, 113 180',
    'M137 60 C 175 60, 175 120, 198 120',
    'M137 180 C 175 180, 175 120, 198 120',
    'M222 120 L 273 120',
  ]
  return (
    <svg viewBox="0 0 320 240" className={frame} aria-hidden="true">
      <g fill="none" strokeWidth="1">
        {paths.map((d, i) => (
          <g key={i}>
            <path d={d} stroke="currentColor" opacity="0.3" />
            <path d={d} stroke="#00D9FF" className="flow-path" style={{ animationDelay: `${i * -0.4}s` }} />
          </g>
        ))}
      </g>
      {nodes.map((n, i) => (
        <g key={n.l}>
          <rect
            x={n.x - 12}
            y={n.y - 12}
            width="24"
            height="24"
            rx={i === 0 ? 12 : 4}
            fill={i === 3 ? '#0066FF' : '#101827'}
            stroke={i === 3 ? '#0066FF' : '#8993A4'}
            strokeWidth="0.75"
          />
          <text x={n.x} y={n.y + 28} textAnchor="middle" className="font-mono" fontSize="6.5" fill="#8993A4" letterSpacing="1">
            {n.l}
          </text>
        </g>
      ))}
      <text x="20" y="28" className="font-mono" fontSize="7" fill="#8993A4">
        FLOW_01 · 5 ETAPAS · EVENTO → AÇÃO
      </text>
    </svg>
  )
}

/** Campo de pontos que se reorganiza em ondas: contexto sendo processado. */
function AIVisual() {
  const cols = 15
  const rows = 11
  const dots = []
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const dx = c - 9.5
      const dy = r - 4.5
      const d = Math.sqrt(dx * dx + dy * dy)
      dots.push(
        <circle
          key={`${r}-${c}`}
          cx={30 + c * 18.5}
          cy={30 + r * 18}
          r="2.4"
          fill={d < 2.2 ? '#00D9FF' : d < 4.5 ? '#0066FF' : '#8993A4'}
          className="field-dot"
          style={{ animationDelay: `${(d * 0.18).toFixed(2)}s` }}
        />,
      )
    }
  }
  return (
    <svg viewBox="0 0 320 240" className={frame} aria-hidden="true">
      {dots}
      <circle cx={30 + 9.5 * 18.5} cy={30 + 4.5 * 18} r="46" fill="none" stroke="#00D9FF" strokeWidth="0.6" strokeDasharray="2 4" opacity="0.6" />
    </svg>
  )
}

/** Diagrama de diagnóstico: retícula, cotas e arco de varredura. */
function ConsultingVisual() {
  return (
    <svg viewBox="0 0 320 240" className={frame} aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="0.75">
        <circle cx="160" cy="120" r="92" opacity="0.35" />
        <circle cx="160" cy="120" r="64" opacity="0.5" />
        <circle cx="160" cy="120" r="34" opacity="0.7" />
        <path d="M160 16v208M56 120h208" opacity="0.35" strokeDasharray="1 3" />
        <path d="M70 40 L250 200" opacity="0.25" />
      </g>
      <g className="slow-spin">
        <path d="M160 28 A 92 92 0 0 1 252 120" fill="none" stroke="#00D9FF" strokeWidth="1.5" />
        <circle cx="252" cy="120" r="3" fill="#00D9FF" />
      </g>
      <g fill="#F5F7FA">
        <circle cx="196" cy="88" r="3.5" />
        <circle cx="122" cy="146" r="2.5" opacity="0.6" />
        <circle cx="178" cy="170" r="2.5" opacity="0.6" />
      </g>
      <rect x="190" y="82" width="12" height="12" fill="none" stroke="#0066FF" strokeWidth="1" />
      <g className="font-mono" fontSize="7" fill="#8993A4">
        <text x="206" y="80">OPORTUNIDADE</text>
        <text x="20" y="232">MAPA · PROCESSOS · PRIORIDADES</text>
      </g>
    </svg>
  )
}
