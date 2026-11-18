import {
  BoxGeometry,
  BufferAttribute,
  BufferGeometry,
  Color,
  Curve,
  DoubleSide,
  Group,
  InstancedMesh,
  LineBasicMaterial,
  LineLoop,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  NeutralToneMapping,
  Object3D,
  PerspectiveCamera,
  PlaneGeometry,
  PMREMGenerator,
  PointLight,
  Scene,
  SRGBColorSpace,
  Texture,
  TorusGeometry,
  Vector3,
  WebGLRenderer,
  type WebGLProgramParametersWithUniforms,
} from 'three'
import type { SceneTarget } from './sceneStore'

/**
 * Escultura Alderige â€” fita cromada contÃ­nua, sem inÃ­cio nem fim:
 * um Ãºnico gesto que se dobra sobre si mesmo (conexÃ£o, construÃ§Ã£o, transformaÃ§Ã£o).
 * Geometria e ambiente de reflexo sÃ£o 100% procedurais: zero downloads de modelo ou HDRI.
 */

export type Quality = 'high' | 'low'

export interface SculptureOptions {
  canvas: HTMLCanvasElement
  quality: Quality
  /** false = prefers-reduced-motion: sem animaÃ§Ã£o contÃ­nua, apenas quadros estÃ¡ticos. */
  animate: boolean
  initial: SceneTarget
}

const TAU = Math.PI * 2

/** Curva fechada derivada de um nÃ³ trifÃ³lio, achatada e assimÃ©trica. */
class RibbonCurve extends Curve<Vector3> {
  constructor() {
    super()
  }
  getPoint(t: number, target = new Vector3()) {
    const a = t * TAU
    const x = Math.sin(a) + 2 * Math.sin(2 * a)
    const y = Math.cos(a) - 2 * Math.cos(2 * a)
    const z = -Math.sin(3 * a) * 1.25
    return target.set(x * 1.05, y * 0.86, z).multiplyScalar(0.44)
  }
}

/**
 * Varre um perfil elÃ­ptico ao longo da curva, com espessura variÃ¡vel e torÃ§Ã£o.
 * Ãndices com wrap (sem vÃ©rtices duplicados na emenda) â†’ normais suaves contÃ­nuas.
 */
function buildRibbon(segments: number, radial: number) {
  const curve = new RibbonCurve()
  const frames = curve.computeFrenetFrames(segments, true)
  const positions = new Float32Array(segments * radial * 3)
  const p = new Vector3()
  let k = 0

  for (let i = 0; i < segments; i++) {
    const u = i / segments
    curve.getPointAt(u, p)
    const n = frames.normals[i]
    const b = frames.binormals[i]
    const w = 0.2 + 0.09 * Math.sin(u * TAU * 3 + 0.7)
    const h = 0.085 + 0.025 * Math.cos(u * TAU * 2)
    const tw = u * TAU // torÃ§Ã£o total de 2Ï€ mantÃ©m a emenda contÃ­nua
    const ct = Math.cos(tw)
    const st = Math.sin(tw)
    for (let j = 0; j < radial; j++) {
      const v = (j / radial) * TAU
      const c = Math.cos(v) * w
      const s = Math.sin(v) * h
      const cr = c * ct - s * st
      const sr = c * st + s * ct
      positions[k++] = p.x + n.x * cr + b.x * sr
      positions[k++] = p.y + n.y * cr + b.y * sr
      positions[k++] = p.z + n.z * cr + b.z * sr
    }
  }

  const indices: number[] = []
  for (let i = 0; i < segments; i++) {
    const i1 = (i + 1) % segments
    for (let j = 0; j < radial; j++) {
      const j1 = (j + 1) % radial
      const a = i * radial + j
      const b = i1 * radial + j
      const c = i1 * radial + j1
      const d = i * radial + j1
      indices.push(a, d, b, b, d, c)
    }
  }

  const geo = new BufferGeometry()
  geo.setAttribute('position', new BufferAttribute(positions, 3))
  geo.setIndex(indices)
  geo.computeVertexNormals()
  return geo
}

/** EstÃºdio de luz procedural: faixas emissivas brancas, azul elÃ©trico e ciano. */
function buildEnvironment(renderer: WebGLRenderer): Texture {
  const env = new Scene()
  env.background = new Color('#04060b')
  const plane = new PlaneGeometry(1, 1)
  const panels: Mesh[] = []
  const add = (hex: string, intensity: number, pos: [number, number, number], scale: [number, number]) => {
    const mat = new MeshBasicMaterial({ color: new Color(hex).multiplyScalar(intensity), side: DoubleSide })
    const m = new Mesh(plane, mat)
    m.position.set(...pos)
    m.scale.set(scale[0], scale[1], 1)
    m.lookAt(0, 0, 0)
    env.add(m)
    panels.push(m)
  }
  add('#ffffff', 7, [0.5, 6, 3], [9, 1.1]) // faixa superior â€” highlight principal
  add('#e8f3ff', 3.5, [4, 2.5, 6], [2.6, 3.4]) // softbox frontal
  add('#0a6cff', 4.2, [-6.5, 0.5, 1.5], [2.2, 11]) // parede azul elÃ©trico
  add('#00d9ff', 5, [6.5, -1, -1.5], [1.4, 9]) // recorte ciano
  add('#0757d9', 1.6, [0, -6, 0.5], [14, 14]) // rebatimento inferior
  add('#ffffff', 2.5, [-2, 1, -6], [6, 0.6]) // linha traseira

  const pmrem = new PMREMGenerator(renderer)
  const rt = pmrem.fromScene(env, 0.035)
  pmrem.dispose()
  plane.dispose()
  panels.forEach((m) => (m.material as MeshBasicMaterial).dispose())
  return rt.texture
}

export class Sculpture {
  private renderer: WebGLRenderer
  private scene = new Scene()
  private camera = new PerspectiveCamera(32, 1, 0.1, 50)
  private root = new Group()
  private ribbonPivot = new Group()
  private ribbon: Mesh
  private glass: Mesh
  private orbits: LineLoop[] = []
  private modules: InstancedMesh
  private moduleSeeds: { r: number; speed: number; phase: number; tilt: number; size: number }[] = []
  private keyLight = new PointLight('#00d9ff', 0, 9, 2)
  private rimLight = new PointLight('#0066ff', 18, 10, 2)
  private last = 0
  private time = 0
  private uTime = { value: 0 }
  private raf = 0
  private running = false
  private disposed = false
  private animate: boolean
  private canvas: HTMLCanvasElement
  private target: SceneTarget
  private current: SceneTarget
  private ptr = { x: 0, y: 0 }
  private ptrSmooth = { x: 0, y: 0 }
  private envTex: Texture
  private dummy = new Object3D()
  private isPortrait = false

  constructor(opts: SculptureOptions) {
    this.canvas = opts.canvas
    this.animate = opts.animate
    this.target = { ...opts.initial }
    this.current = { ...opts.initial, opacity: opts.animate ? 0 : opts.initial.opacity }
    const high = opts.quality === 'high'

    this.renderer = new WebGLRenderer({
      canvas: opts.canvas,
      antialias: high,
      alpha: true,
      powerPreference: high ? 'high-performance' : 'low-power',
    })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, high ? 1.75 : 1.35))
    this.renderer.outputColorSpace = SRGBColorSpace
    this.renderer.toneMapping = NeutralToneMapping
    this.renderer.toneMappingExposure = 1.0
    this.renderer.setClearColor(0x000000, 0)

    this.envTex = buildEnvironment(this.renderer)
    this.scene.environment = this.envTex

    this.camera.position.set(0, 0, 7)

    // --- Fita cromada principal
    const chrome = new MeshPhysicalMaterial({
      color: new Color('#e4eeff'),
      metalness: 1,
      roughness: 0.14,
      clearcoat: 1,
      clearcoatRoughness: 0.06,
      envMapIntensity: 1.25,
    })
    chrome.onBeforeCompile = (shader: WebGLProgramParametersWithUniforms) => {
      shader.uniforms.uTime = this.uTime
      shader.vertexShader = `uniform float uTime;\n${shader.vertexShader}`.replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
        float wave = sin(position.x * 2.1 + uTime * 0.8) * cos(position.y * 1.9 - uTime * 0.6)
                   + 0.5 * sin(position.z * 3.0 + uTime * 1.1);
        transformed += objectNormal * wave * 0.028;`,
      )
    }
    this.ribbon = new Mesh(buildRibbon(high ? 640 : 300, high ? 36 : 20), chrome)
    this.ribbonPivot.add(this.ribbon)
    this.root.add(this.ribbonPivot)

    // --- Anel de vidro translÃºcido (falso vidro: sem passe extra de transmissÃ£o)
    const glassMat = new MeshPhysicalMaterial({
      color: new Color('#bfeaff'),
      metalness: 0.1,
      roughness: 0.04,
      clearcoat: 1,
      clearcoatRoughness: 0.02,
      transparent: true,
      opacity: 0.22,
      envMapIntensity: 2.4,
      depthWrite: false,
    })
    this.glass = new Mesh(new TorusGeometry(1.32, 0.045, high ? 32 : 16, high ? 220 : 120), glassMat)
    this.glass.rotation.set(1.15, 0.35, 0)
    this.root.add(this.glass)

    // --- Ã“rbitas tÃ©cnicas (linhas finas)
    const orbitMat = new LineBasicMaterial({ color: '#00d9ff', transparent: true, opacity: 0.32 })
    const orbitMat2 = new LineBasicMaterial({ color: '#8993a4', transparent: true, opacity: 0.22 })
    const circle = (r: number, seg = 180) => {
      const g = new BufferGeometry()
      const pts = new Float32Array(seg * 3)
      for (let i = 0; i < seg; i++) {
        const a = (i / seg) * TAU
        pts[i * 3] = Math.cos(a) * r
        pts[i * 3 + 1] = Math.sin(a) * r
      }
      g.setAttribute('position', new BufferAttribute(pts, 3))
      return g
    }
    const o1 = new LineLoop(circle(1.78), orbitMat)
    o1.rotation.set(1.32, -0.2, 0.1)
    const o2 = new LineLoop(circle(2.05), orbitMat2)
    o2.rotation.set(0.4, 0.9, 0.3)
    this.orbits.push(o1, o2)
    this.root.add(o1, o2)

    // --- MÃ³dulos flutuantes (estrutura modular)
    const count = high ? 9 : 5
    const modMat = new MeshPhysicalMaterial({ color: '#9fb2cc', metalness: 1, roughness: 0.28, envMapIntensity: 1.1 })
    this.modules = new InstancedMesh(new BoxGeometry(1, 1, 1), modMat, count)
    for (let i = 0; i < count; i++) {
      this.moduleSeeds.push({
        r: 1.45 + (i % 3) * 0.16,
        speed: 0.08 + (i % 4) * 0.025,
        phase: (i / count) * TAU,
        tilt: ((i * 37) % 11) / 11 - 0.5,
        size: 0.045 + ((i * 13) % 5) * 0.014,
      })
    }
    this.root.add(this.modules)

    // --- Luzes dinÃ¢micas
    this.keyLight.position.set(1.5, 1.5, 3)
    this.rimLight.position.set(-3, -1.5, -2)
    this.scene.add(this.keyLight, this.rimLight, this.root)

    this.resize()
    this.applyFrame(0)
  }

  setTarget(t: SceneTarget) {
    this.target = { ...t }
    if (!this.animate) {
      this.current = { ...t }
      this.renderStatic()
    } else if (!this.running && t.opacity > 0.02) {
      this.start()
    }
  }

  setPointer(x: number, y: number) {
    this.ptr.x = x
    this.ptr.y = y
  }

  resize() {
    const w = this.canvas.clientWidth || window.innerWidth
    const h = this.canvas.clientHeight || window.innerHeight
    this.renderer.setSize(w, h, false)
    this.camera.aspect = w / h
    this.isPortrait = w / h < 0.9
    // Em telas estreitas, recua a cÃ¢mera para a escultura caber
    this.camera.position.z = this.isPortrait ? 9.4 : 7
    this.camera.updateProjectionMatrix()
    if (!this.animate || !this.running) this.renderStatic()
  }

  start() {
    if (this.running || this.disposed || !this.animate) return
    this.running = true
    this.last = performance.now()
    const loop = () => {
      if (!this.running) return
      const now = performance.now()
      const dt = Math.min((now - this.last) / 1000, 0.05)
      this.last = now
      this.time += dt
      this.applyFrame(dt)
      this.renderer.render(this.scene, this.camera)
      // Pausa automÃ¡tica quando invisÃ­vel â€” economia de GPU
      if (this.current.opacity < 0.02 && this.target.opacity < 0.02) {
        this.running = false
        return
      }
      this.raf = requestAnimationFrame(loop)
    }
    this.raf = requestAnimationFrame(loop)
  }

  stop() {
    this.running = false
    cancelAnimationFrame(this.raf)
  }

  renderStatic() {
    if (this.disposed) return
    this.applyFrame(0)
    this.renderer.render(this.scene, this.camera)
  }

  private applyFrame(dt: number) {
    const c = this.current
    const t = this.target
    const k = this.animate ? 1 - Math.exp(-dt * 3.2) : 1
    c.x += (t.x - c.x) * k
    c.y += (t.y - c.y) * k
    c.scale += (t.scale - c.scale) * k
    c.spin += (t.spin - c.spin) * k
    c.opacity += (t.opacity - c.opacity) * k
    c.glow += (t.glow - c.glow) * k

    const kp = this.animate ? 1 - Math.exp(-dt * 2.4) : 1
    this.ptrSmooth.x += (this.ptr.x - this.ptrSmooth.x) * kp
    this.ptrSmooth.y += (this.ptr.y - this.ptrSmooth.y) * kp

    const time = this.time
    this.uTime.value = time

    const portraitScale = this.isPortrait ? 0.92 : 1
    this.root.position.set(c.x, c.y + Math.sin(time * 0.6) * 0.04, 0)
    this.root.scale.setScalar(c.scale * portraitScale)
    this.root.rotation.x = -0.18 + this.ptrSmooth.y * 0.28
    this.root.rotation.y = 0.35 + c.spin + this.ptrSmooth.x * 0.42

    this.ribbonPivot.rotation.z = time * 0.07
    this.ribbonPivot.rotation.y = Math.sin(time * 0.21) * 0.25
    this.glass.rotation.z = -time * 0.05
    this.orbits[0].rotation.z = time * 0.04
    this.orbits[1].rotation.z = -time * 0.03

    for (let i = 0; i < this.moduleSeeds.length; i++) {
      const s = this.moduleSeeds[i]
      const a = s.phase + time * s.speed
      this.dummy.position.set(Math.cos(a) * s.r, Math.sin(a) * s.r * 0.55 + s.tilt, Math.sin(a) * s.r * 0.6)
      this.dummy.rotation.set(time * 0.3 + i, time * 0.2 + i * 0.5, 0)
      this.dummy.scale.setScalar(s.size)
      this.dummy.updateMatrix()
      this.modules.setMatrixAt(i, this.dummy.matrix)
    }
    this.modules.instanceMatrix.needsUpdate = true

    // Luz ciano acompanha o cursor â€” iluminaÃ§Ã£o dinÃ¢mica
    this.keyLight.position.set(this.ptrSmooth.x * 3.2 + c.x, this.ptrSmooth.y * 2.4 + 0.6, 2.8)
    this.keyLight.intensity = 26 * c.glow

    this.canvas.style.opacity = String(Math.max(0, Math.min(1, c.opacity)))
  }

  dispose() {
    this.disposed = true
    this.stop()
    this.scene.traverse((o) => {
      const m = o as Mesh
      if (m.geometry) m.geometry.dispose()
      const mat = m.material as { dispose?: () => void } | undefined
      mat?.dispose?.()
    })
    this.envTex.dispose()
    this.renderer.dispose()
  }
}
