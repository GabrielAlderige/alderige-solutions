/**
 * Ponte leve entre a página (scroll, seções) e o motor 3D.
 * Não importa three.js — o motor é carregado sob demanda.
 */

export interface SceneTarget {
  /** Posição em unidades de mundo (câmera em z=7, altura visível ≈ 4.4). */
  x: number
  y: number
  scale: number
  /** Rotação extra guiada pelo scroll (radianos). */
  spin: number
  /** 0–1. Abaixo de ~0.02 o render é pausado. */
  opacity: number
  /** Intensidade da luz ciano dinâmica, 0–1. */
  glow: number
}

type Listener = (t: SceneTarget) => void

let target: SceneTarget = { x: 1.55, y: 0.05, scale: 1, spin: 0, opacity: 1, glow: 1 }
const listeners = new Set<Listener>()

export const sceneStore = {
  get: () => target,
  set(partial: Partial<SceneTarget>) {
    target = { ...target, ...partial }
    listeners.forEach((l) => l(target))
  },
  subscribe(l: Listener) {
    listeners.add(l)
    return () => {
      listeners.delete(l)
    }
  },
}

/** Ponteiro normalizado (-1..1). */
export const pointer = { x: 0, y: 0 }
