import type { Project } from '@/data/projects'
import { cx } from '@/utils/links'

/**
 * Capa do projeto: usa a primeira imagem real quando existir;
 * caso contrário, um visual gerado (nunca uma imagem de banco).
 */
export function ProjectVisual({ project, className, eager }: { project: Project; className?: string; eager?: boolean }) {
  const img = project.images[0]
  return (
    <div className={cx('relative overflow-hidden bg-navy ring-1 ring-line', className)}>
      {img ? (
        <img
          src={img.src}
          alt={img.alt}
          width={img.width}
          height={img.height}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          className="h-full w-full object-cover"
        />
      ) : (
        <GeneratedVisual kind={project.visual} />
      )}
    </div>
  )
}

function GeneratedVisual({ kind }: { kind: Project['visual'] }) {
  return (
    <div aria-hidden="true" className="absolute inset-0">
      <div className="absolute inset-0 bg-[radial-gradient(80%_70%_at_70%_30%,rgba(0,102,255,0.22),transparent_65%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(137,147,164,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(137,147,164,0.07)_1px,transparent_1px)] bg-[size:32px_32px]" />
      <svg viewBox="0 0 400 260" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
        {kind === 'interface' && <InterfaceArt />}
        {kind === 'signal' && <SignalArt />}
        {kind === 'flow' && <FlowArt />}
      </svg>
    </div>
  )
}

function InterfaceArt() {
  return (
    <g>
      <defs>
        <linearGradient id="pv-chrome" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F5F7FA" />
          <stop offset="0.4" stopColor="#3D7BFF" />
          <stop offset="0.7" stopColor="#0B1630" />
          <stop offset="1" stopColor="#00D9FF" />
        </linearGradient>
      </defs>
      <path
        d="M265 50 C 345 45, 370 140, 300 170 S 180 220, 200 150 S 330 70, 345 160 S 250 250, 230 190"
        fill="none"
        stroke="url(#pv-chrome)"
        strokeWidth="11"
        strokeLinecap="round"
      />
      <g fill="#F5F7FA">
        <rect x="32" y="120" width="150" height="16" rx="1" />
        <rect x="52" y="142" width="120" height="16" rx="1" fill="none" stroke="#F5F7FA" strokeWidth="0.8" />
        <rect x="32" y="164" width="140" height="16" rx="1" />
        <rect x="32" y="200" width="60" height="12" rx="6" fill="#0066FF" />
      </g>
      <text x="32" y="44" fontFamily="IBM Plex Mono, monospace" fontSize="8" fill="#8993A4" letterSpacing="1.5">
        ALDERIGE · REACT · WEBGL
      </text>
    </g>
  )
}

function SignalArt() {
  const bubbles = [
    { y: 58, w: 110, tag: 'HORÁRIOS' },
    { y: 96, w: 140, tag: 'CONVÊNIO' },
    { y: 134, w: 90, tag: 'HUMANO' },
    { y: 172, w: 124, tag: 'PREPARO' },
  ]
  return (
    <g fontFamily="IBM Plex Mono, monospace" fontSize="7" letterSpacing="1">
      {bubbles.map((b, i) => (
        <g key={i}>
          <rect x="34" y={b.y} width={b.w} height="22" rx="11" fill="#101827" stroke="#8993A4" strokeWidth="0.6" />
          <path d={`M${34 + b.w + 6} ${b.y + 11} C 230 ${b.y + 11}, 230 130, 262 130`} fill="none" stroke={i === 2 ? '#00D9FF' : '#3a4a66'} strokeWidth="0.9" />
          <text x={34 + 14} y={b.y + 14} fill="#8993A4">
            {b.tag}
          </text>
        </g>
      ))}
      <circle cx="292" cy="130" r="30" fill="none" stroke="#0066FF" strokeWidth="1.2" />
      <circle cx="292" cy="130" r="18" fill="#0066FF" opacity="0.25" />
      <circle cx="292" cy="130" r="5" fill="#00D9FF" />
      <text x="262" y="182" fill="#F5F7FA">INTENÇÃO</text>
    </g>
  )
}

function FlowArt() {
  const steps = ['CRM', 'MODELO', 'REVISÃO', 'ENVIO', 'FOLLOW-UP']
  return (
    <g fontFamily="IBM Plex Mono, monospace" fontSize="7" letterSpacing="1">
      <path d="M40 130 H 360" stroke="#3a4a66" strokeWidth="1" />
      <path d="M40 130 H 250" stroke="#00D9FF" strokeWidth="1.2" />
      {steps.map((s, i) => {
        const x = 40 + i * 80
        const done = i <= 2
        return (
          <g key={s}>
            <rect x={x - 14} y="116" width="28" height="28" rx={i === 0 ? 14 : 3} fill={done ? '#0066FF' : '#101827'} stroke={done ? '#0066FF' : '#8993A4'} strokeWidth="0.8" />
            <text x={x} y="162" textAnchor="middle" fill="#8993A4">
              {s}
            </text>
          </g>
        )
      })}
      <g transform="translate(200 40)">
        <rect width="62" height="56" rx="2" fill="#F5F7FA" opacity="0.92" />
        <rect x="8" y="10" width="34" height="4" fill="#080B12" />
        <rect x="8" y="20" width="46" height="2" fill="#8993A4" />
        <rect x="8" y="26" width="40" height="2" fill="#8993A4" />
        <rect x="8" y="32" width="44" height="2" fill="#8993A4" />
        <rect x="8" y="44" width="20" height="5" fill="#0066FF" />
      </g>
    </g>
  )
}
