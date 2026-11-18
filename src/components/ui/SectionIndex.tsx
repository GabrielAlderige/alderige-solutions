import { cx } from '@/utils/links'

/** Marcador editorial de seção: (02) — SOBRE ———— */
export function SectionIndex({ index, label, className }: { index: string; label: string; className?: string }) {
  return (
    <div className={cx('flex items-center gap-4', className)}>
      <span className="font-mono text-[0.6875rem] tracking-[0.14em] text-cyan">({index})</span>
      <span className="mono-label">{label}</span>
      <span aria-hidden="true" className="h-px flex-1 bg-line" />
    </div>
  )
}
