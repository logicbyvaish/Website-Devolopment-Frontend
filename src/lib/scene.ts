import * as THREE from 'three'

/**
 * StackScene — the "tech stack dimension".
 * A single Three.js scene laid out along the Z axis. The camera flies
 * backwards through 7 zones (hero → HTML → CSS → JS → Frameworks →
 * Advanced → Finale) driven purely by page scroll progress.
 *
 * Pedagogy note: each zone's geometry is a literal metaphor for the
 * concept being taught (tag islands, box-model shells, neural paths,
 * component tree, optimizing city) so the 3D space *is* the lesson.
 */

export const ZONE_SPACING = 90
export const NUM_ZONES = 7

const COLORS = {
  cyan: 0x22d3ee,
  magenta: 0xff2ec4,
  gold: 0xffd60a,
  violet: 0xa78bfa,
  deep: 0x7c3aed,
  white: 0xe8e8ff,
}

function makeTextSprite(text: string, color: string, size = 256): THREE.Sprite {
  const canvas = document.createElement('canvas')
  const scale = text.length > 6 ? 2.2 : 1.4
  canvas.width = size * scale
  canvas.height = size * 0.5
  const ctx = canvas.getContext('2d')!
  ctx.font = `bold ${size * 0.22}px "JetBrains Mono", monospace`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.shadowColor = color
  ctx.shadowBlur = 24
  ctx.fillStyle = color
  ctx.fillText(text, canvas.width / 2, canvas.height / 2)
  ctx.shadowBlur = 8
  ctx.fillText(text, canvas.width / 2, canvas.height / 2)
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false })
  const sprite = new THREE.Sprite(mat)
  sprite.scale.set(8 * scale, 4, 1)
  return sprite
}

interface PathParticle {
  mesh: THREE.Mesh
  curve: THREE.CatmullRomCurve3
  t: number
  speed: number
}

export class StackScene {
  renderer: THREE.WebGLRenderer
  scene: THREE.Scene
  camera: THREE.PerspectiveCamera
  private zones: THREE.Group[] = []
  private clock = new THREE.Clock()
  private progress = 0
  private raf = 0
  private disposed = false
  private reducedMotion: boolean
  private ambientParticles!: THREE.Points
  private tunnelSprites: THREE.Sprite[] = []
  private orbiters: { obj: THREE.Object3D; r: number; speed: number; phase: number; y: number }[] = []
  private bobbers: { obj: THREE.Object3D; base: number; amp: number; phase: number; spin: number }[] = []
  private pathParticles: PathParticle[] = []
  private glowTips: THREE.Mesh[] = []
  private train?: THREE.Mesh
  private trainCurve?: THREE.CatmullRomCurve3
  private cityBoxes: THREE.Mesh[] = []
  private cityShrink = 0
  private cityShrinkTarget = 0
  private portalRing?: THREE.Mesh
  quality: 'high' | 'low' = 'high'

  constructor(canvas: HTMLCanvasElement) {
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.setSize(window.innerWidth, window.innerHeight)

    this.scene = new THREE.Scene()
    this.scene.fog = new THREE.FogExp2(0x0a0a0f, 0.011)

    this.camera = new THREE.PerspectiveCamera(
      62,
      window.innerWidth / window.innerHeight,
      0.1,
      220
    )
    this.camera.position.set(0, 0, 14)

    const ambient = new THREE.AmbientLight(0x404060, 1.4)
    this.scene.add(ambient)

    this.buildAmbientParticles()
    this.buildTunnel()
    this.buildHero()
    this.buildHtmlZone()
    this.buildCssZone()
    this.buildJsZone()
    this.buildFrameworkZone()
    this.buildAdvancedZone()
    this.buildFinaleZone()

    window.addEventListener('resize', this.onResize)
    this.animate()
  }

  private zoneZ(i: number) {
    return -i * ZONE_SPACING
  }

  private addZone(i: number): THREE.Group {
    const g = new THREE.Group()
    g.position.z = this.zoneZ(i)
    this.scene.add(g)
    this.zones[i] = g
    return g
  }

  // ---- ambient starfield along the whole journey ----
  private buildAmbientParticles() {
    const count = 1400
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)
    const palette = [COLORS.cyan, COLORS.magenta, COLORS.gold, COLORS.violet]
    const c = new THREE.Color()
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 120
      pos[i * 3 + 1] = (Math.random() - 0.5) * 80
      pos[i * 3 + 2] = -Math.random() * ZONE_SPACING * NUM_ZONES - 10
      c.setHex(palette[Math.floor(Math.random() * palette.length)])
      col[i * 3] = c.r
      col[i * 3 + 1] = c.g
      col[i * 3 + 2] = c.b
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3))
    const mat = new THREE.PointsMaterial({
      size: 0.35,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      depthWrite: false,
    })
    this.ambientParticles = new THREE.Points(geo, mat)
    this.scene.add(this.ambientParticles)
  }

  // ---- warp tunnel of code symbols between zones ----
  private buildTunnel() {
    const symbols = ['</>', '{}', '=>', ';', '()', '#', '&&']
    const colors = ['#22d3ee', '#ff2ec4', '#ffd60a', '#a78bfa']
    for (let z = 20; z < ZONE_SPACING * (NUM_ZONES - 0.5); z += 9) {
      const n = 3
      for (let k = 0; k < n; k++) {
        const angle = Math.random() * Math.PI * 2
        const r = 22 + Math.random() * 14
        const s = makeTextSprite(
          symbols[Math.floor(Math.random() * symbols.length)],
          colors[Math.floor(Math.random() * colors.length)]
        )
        s.position.set(Math.cos(angle) * r, Math.sin(angle) * r * 0.6, -z)
        s.scale.multiplyScalar(0.45)
        ;(s.material as THREE.SpriteMaterial).opacity = 0.5
        this.scene.add(s)
        this.tunnelSprites.push(s)
        this.bobbers.push({ obj: s, base: s.position.y, amp: 0.8, phase: Math.random() * 6, spin: 0 })
      }
    }
  }

  // ---- Zone 0: hero ----
  private buildHero() {
    const g = this.addZone(0)
    const knot = new THREE.Mesh(
      new THREE.TorusKnotGeometry(4.2, 1.1, 140, 20),
      new THREE.MeshBasicMaterial({ color: COLORS.cyan, wireframe: true, transparent: true, opacity: 0.34 })
    )
    knot.position.set(0, 0, -14)
    g.add(knot)
    this.bobbers.push({ obj: knot, base: 0, amp: 0.6, phase: 0, spin: 0.12 })

    const shapes: [THREE.BufferGeometry, number, THREE.Vector3][] = [
      [new THREE.IcosahedronGeometry(1.6), COLORS.magenta, new THREE.Vector3(-11, 4, -8)],
      [new THREE.OctahedronGeometry(1.5), COLORS.gold, new THREE.Vector3(11, -3, -10)],
      [new THREE.TetrahedronGeometry(1.4), COLORS.violet, new THREE.Vector3(-9, -5, -5)],
      [new THREE.DodecahedronGeometry(1.2), COLORS.cyan, new THREE.Vector3(9, 5, -6)],
    ]
    for (const [geo, color, p] of shapes) {
      const m = new THREE.Mesh(
        geo,
        new THREE.MeshBasicMaterial({ color, wireframe: true, transparent: true, opacity: 0.55 })
      )
      m.position.copy(p)
      g.add(m)
      this.bobbers.push({ obj: m, base: p.y, amp: 0.9, phase: Math.random() * 6, spin: 0.3 + Math.random() * 0.4 })
    }
  }

  // ---- Zone 1: HTML tag islands ----
  private buildHtmlZone() {
    const g = this.addZone(1)
    const tags = ['<html>', '<body>', '<div>', '<h1>', '<a>', '<img>', '<nav>', '<p>']
    tags.forEach((tag, i) => {
      const island = new THREE.Group()
      const r = 10 + (i % 3) * 4.5
      const phase = (i / tags.length) * Math.PI * 2
      const y = ((i % 4) - 1.5) * 3.2

      const disc = new THREE.Mesh(
        new THREE.CylinderGeometry(2.6, 3.1, 0.5, 6),
        new THREE.MeshBasicMaterial({ color: COLORS.cyan, wireframe: true, transparent: true, opacity: 0.4 })
      )
      island.add(disc)
      const label = makeTextSprite(tag, '#22d3ee')
      label.position.y = 2.2
      island.add(label)
      g.add(island)
      this.orbiters.push({ obj: island, r, speed: 0.05 + (i % 3) * 0.02, phase, y })
    })

    // central DOM tree — trunk of connected wireframe cubes
    const treeMat = new THREE.MeshBasicMaterial({ color: COLORS.cyan, wireframe: true, transparent: true, opacity: 0.6 })
    const lineMat = new THREE.LineBasicMaterial({ color: COLORS.cyan, transparent: true, opacity: 0.35 })
    const nodePositions: THREE.Vector3[][] = [
      [new THREE.Vector3(0, 6, -6)],
      [new THREE.Vector3(-4, 2, -6), new THREE.Vector3(4, 2, -6)],
      [new THREE.Vector3(-6.5, -2.5, -6), new THREE.Vector3(-1.5, -2.5, -6), new THREE.Vector3(1.5, -2.5, -6), new THREE.Vector3(6.5, -2.5, -6)],
    ]
    nodePositions.forEach((row, ri) => {
      row.forEach((p, ci) => {
        const cube = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.5, 1.5), treeMat)
        cube.position.copy(p)
        g.add(cube)
        this.bobbers.push({ obj: cube, base: p.y, amp: 0.25, phase: ri + ci, spin: 0.2 })
        if (ri > 0) {
          const parent = nodePositions[ri - 1][Math.floor(ci / 2) % nodePositions[ri - 1].length]
          const geo = new THREE.BufferGeometry().setFromPoints([parent, p])
          g.add(new THREE.Line(geo, lineMat))
        }
      })
    })
  }

  // ---- Zone 2: CSS box model + grid floor ----
  private buildCssZone() {
    const g = this.addZone(2)
    // exploded box model shells
    const shells: [number, number, string][] = [
      [7.5, COLORS.magenta, 'margin'],
      [5.6, 0xff6ad5, 'border'],
      [4.0, 0xffa3e5, 'padding'],
      [2.4, COLORS.white, 'content'],
    ]
    shells.forEach(([size, color], i) => {
      const box = new THREE.Mesh(
        new THREE.BoxGeometry(size, size, size),
        new THREE.MeshBasicMaterial({
          color,
          wireframe: i < 3,
          transparent: true,
          opacity: i < 3 ? 0.45 : 0.9,
        })
      )
      box.position.set(-7, 1, -8)
      g.add(box)
      this.bobbers.push({ obj: box, base: 1, amp: 0.35, phase: i * 0.9, spin: 0.08 + i * 0.03 })
    })

    // holographic grid floor
    const grid = new THREE.GridHelper(70, 26, COLORS.magenta, 0x551144)
    grid.position.y = -8
    ;(grid.material as THREE.Material).transparent = true
    ;(grid.material as THREE.Material).opacity = 0.5
    g.add(grid)

    // flexbox row — items that slide and grow
    for (let i = 0; i < 4; i++) {
      const m = new THREE.Mesh(
        new THREE.BoxGeometry(2, 2 + i * 0.7, 2),
        new THREE.MeshBasicMaterial({ color: COLORS.magenta, wireframe: true, transparent: true, opacity: 0.65 })
      )
      m.position.set(4 + i * 3.2, -2, -8)
      g.add(m)
      this.bobbers.push({ obj: m, base: -2, amp: 0.5, phase: i * 0.7, spin: 0 })
    }
    const label = makeTextSprite('display: flex', '#ff2ec4')
    label.position.set(9, 2.5, -8)
    g.add(label)
  }

  // ---- Zone 3: JS neural pathways ----
  private buildJsZone() {
    const g = this.addZone(3)
    const nodeMat = new THREE.MeshBasicMaterial({ color: COLORS.gold, transparent: true, opacity: 0.9 })
    const nodes: THREE.Vector3[] = []
    for (let i = 0; i < 14; i++) {
      const p = new THREE.Vector3(
        (Math.random() - 0.5) * 26,
        (Math.random() - 0.5) * 14,
        -4 - Math.random() * 12
      )
      nodes.push(p)
      const s = new THREE.Mesh(new THREE.SphereGeometry(0.45, 12, 12), nodeMat)
      s.position.copy(p)
      g.add(s)
      this.bobbers.push({ obj: s, base: p.y, amp: 0.3, phase: i, spin: 0 })
    }
    const lineMat = new THREE.LineBasicMaterial({ color: COLORS.gold, transparent: true, opacity: 0.22 })
    const particleGeo = new THREE.SphereGeometry(0.22, 8, 8)
    const particleMat = new THREE.MeshBasicMaterial({ color: 0xfff3b0 })
    for (let i = 0; i < 16; i++) {
      const a = nodes[Math.floor(Math.random() * nodes.length)]
      const b = nodes[Math.floor(Math.random() * nodes.length)]
      if (a === b) continue
      const mid = a.clone().lerp(b, 0.5).add(new THREE.Vector3(0, 2 + Math.random() * 2, 0))
      const curve = new THREE.CatmullRomCurve3([a, mid, b])
      const pts = curve.getPoints(24)
      g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), lineMat))
      const pm = new THREE.Mesh(particleGeo, particleMat)
      g.add(pm)
      this.pathParticles.push({ mesh: pm, curve, t: Math.random(), speed: 0.1 + Math.random() * 0.25 })
    }
    const labels = ['let', 'const', '=>', 'await']
    labels.forEach((l, i) => {
      const s = makeTextSprite(l, '#ffd60a')
      s.position.set(-12 + i * 8, 8.5, -8)
      g.add(s)
      this.bobbers.push({ obj: s, base: 8.5, amp: 0.5, phase: i * 1.4, spin: 0 })
    })
  }

  // ---- Zone 4: React component tree + Node train ----
  private buildFrameworkZone() {
    const g = this.addZone(4)
    const branchMat = new THREE.MeshBasicMaterial({ color: COLORS.violet, wireframe: true, transparent: true, opacity: 0.5 })
    const tipMat = () => new THREE.MeshBasicMaterial({ color: COLORS.violet, transparent: true, opacity: 0.9 })

    const buildBranch = (from: THREE.Vector3, dir: THREE.Vector3, len: number, depth: number) => {
      const to = from.clone().add(dir.clone().multiplyScalar(len))
      const geo = new THREE.CylinderGeometry(0.1 + depth * 0.07, 0.14 + depth * 0.09, len, 5)
      const mesh = new THREE.Mesh(geo, branchMat)
      mesh.position.copy(from.clone().lerp(to, 0.5))
      mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize())
      g.add(mesh)
      if (depth === 0) {
        const tip = new THREE.Mesh(new THREE.SphereGeometry(0.55, 10, 10), tipMat())
        tip.position.copy(to)
        g.add(tip)
        this.glowTips.push(tip)
        return
      }
      const n = 2 + (depth > 1 ? 1 : 0)
      for (let i = 0; i < n; i++) {
        const spread = 0.9
        const nd = dir
          .clone()
          .add(new THREE.Vector3((Math.random() - 0.5) * spread, 0.4, (Math.random() - 0.5) * spread))
          .normalize()
        buildBranch(to, nd, len * 0.72, depth - 1)
      }
    }
    buildBranch(new THREE.Vector3(-6, -9, -8), new THREE.Vector3(0, 1, 0), 5.5, 3)
    const appLabel = makeTextSprite('<App />', '#a78bfa')
    appLabel.position.set(-6, 4.5, -8)
    g.add(appLabel)

    // Node.js request/response train loop
    const loopPts = []
    for (let i = 0; i <= 40; i++) {
      const a = (i / 40) * Math.PI * 2
      loopPts.push(new THREE.Vector3(9 + Math.cos(a) * 6, -2 + Math.sin(a) * 3.2, -8 + Math.sin(a * 2) * 1.5))
    }
    this.trainCurve = new THREE.CatmullRomCurve3(loopPts, true)
    const trackGeo = new THREE.TubeGeometry(this.trainCurve, 60, 0.06, 6, true)
    g.add(new THREE.Mesh(trackGeo, new THREE.MeshBasicMaterial({ color: COLORS.violet, transparent: true, opacity: 0.4 })))
    this.train = new THREE.Mesh(
      new THREE.BoxGeometry(0.9, 0.6, 0.6),
      new THREE.MeshBasicMaterial({ color: 0xd6c7ff })
    )
    g.add(this.train)
    const serverLabel = makeTextSprite('req → res', '#a78bfa')
    serverLabel.position.set(9, 3, -8)
    g.add(serverLabel)
  }

  // ---- Zone 5: performance city ----
  private buildAdvancedZone() {
    const g = this.addZone(5)
    const city = new THREE.Group()
    city.position.set(0, -8, -8)
    for (let x = -4; x <= 4; x++) {
      for (let z = -2; z <= 2; z++) {
        if (Math.random() < 0.18) continue
        const h = 2 + Math.random() * 9
        const geo = new THREE.BoxGeometry(1.6, h, 1.6)
        geo.translate(0, h / 2, 0)
        const mesh = new THREE.Mesh(
          geo,
          new THREE.MeshBasicMaterial({
            color: Math.random() < 0.5 ? COLORS.deep : COLORS.violet,
            wireframe: true,
            transparent: true,
            opacity: 0.55,
          })
        )
        mesh.position.set(x * 2.6, 0, z * 2.6)
        mesh.userData.baseH = 1
        city.add(mesh)
        this.cityBoxes.push(mesh)
      }
    }
    g.add(city)
    this.bobbers.push({ obj: city, base: -8, amp: 0, phase: 0, spin: 0.05 })
    const grid = new THREE.GridHelper(40, 16, COLORS.deep, 0x2a1a4a)
    grid.position.set(0, -8.05, -8)
    g.add(grid)
    const label = makeTextSprite('bundle.js — shrink me', '#a78bfa')
    label.position.set(0, 6, -8)
    g.add(label)
  }

  // ---- Zone 6: finale portal ----
  private buildFinaleZone() {
    const g = this.addZone(6)
    this.portalRing = new THREE.Mesh(
      new THREE.TorusGeometry(7, 0.5, 16, 80),
      new THREE.MeshBasicMaterial({ color: COLORS.cyan, transparent: true, opacity: 0.85 })
    )
    this.portalRing.position.set(0, 0, -10)
    g.add(this.portalRing)
    const inner = new THREE.Mesh(
      new THREE.TorusGeometry(5.4, 0.25, 12, 60),
      new THREE.MeshBasicMaterial({ color: COLORS.magenta, transparent: true, opacity: 0.7 })
    )
    inner.position.set(0, 0, -10)
    g.add(inner)
    this.bobbers.push({ obj: inner, base: 0, amp: 0, phase: 0, spin: -0.4 })
    const inner2 = new THREE.Mesh(
      new THREE.TorusGeometry(3.8, 0.18, 12, 50),
      new THREE.MeshBasicMaterial({ color: COLORS.gold, transparent: true, opacity: 0.7 })
    )
    inner2.position.set(0, 0, -10)
    g.add(inner2)
    this.bobbers.push({ obj: inner2, base: 0, amp: 0, phase: 1, spin: 0.6 })
  }

  // ---- public API ----
  setProgress(p: number) {
    this.progress = Math.max(0, Math.min(1, p))
  }

  /** Perf city: 0 = bloated, 1 = fully optimized (buildings shrink) */
  setCityOptimization(v: number) {
    this.cityShrinkTarget = Math.max(0, Math.min(1, v))
  }

  setQuality(q: 'high' | 'low') {
    this.quality = q
    this.renderer.setPixelRatio(q === 'high' ? Math.min(window.devicePixelRatio, 2) : 1)
    this.ambientParticles.visible = q === 'high'
    this.tunnelSprites.forEach((s) => (s.visible = q === 'high'))
  }

  private onResize = () => {
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(window.innerWidth, window.innerHeight)
  }

  private animate = () => {
    if (this.disposed) return
    this.raf = requestAnimationFrame(this.animate)
    const t = this.clock.getElapsedTime()
    const dt = Math.min(this.clock.getDelta() + 0.016, 0.05)

    // camera flight along Z with gentle sway
    const targetZ = 14 - this.progress * (ZONE_SPACING * (NUM_ZONES - 1) + 4)
    this.camera.position.z += (targetZ - this.camera.position.z) * 0.08
    if (!this.reducedMotion) {
      this.camera.position.x = Math.sin(t * 0.18) * 1.2
      this.camera.position.y = Math.cos(t * 0.14) * 0.8
      this.camera.rotation.z = Math.sin(t * 0.1) * 0.015
    }

    // cull zones far from camera (poor man's LOD)
    for (let i = 0; i < this.zones.length; i++) {
      const z = this.zones[i]
      if (!z) continue
      z.visible = Math.abs(this.camera.position.z - z.position.z) < ZONE_SPACING * 1.7
    }

    if (!this.reducedMotion) {
      for (const b of this.bobbers) {
        if (b.amp > 0) b.obj.position.y = b.base + Math.sin(t * 0.8 + b.phase) * b.amp
        if (b.spin) b.obj.rotation.y += b.spin * dt
      }
      for (const o of this.orbiters) {
        const a = t * o.speed + o.phase
        o.obj.position.set(Math.cos(a) * o.r, o.y + Math.sin(t * 0.6 + o.phase) * 0.8, Math.sin(a) * o.r * 0.5 - 6)
      }
      for (const p of this.pathParticles) {
        p.t = (p.t + p.speed * dt) % 1
        p.curve.getPointAt(p.t, p.mesh.position)
      }
      if (this.train && this.trainCurve) {
        const tt = (t * 0.07) % 1
        this.trainCurve.getPointAt(tt, this.train.position)
        ;(this.train.material as THREE.MeshBasicMaterial).color.setHex(tt < 0.5 ? 0x86f7ff : 0xd6c7ff)
      }
      for (let i = 0; i < this.glowTips.length; i++) {
        const tip = this.glowTips[i]
        const pulse = 0.6 + Math.sin(t * 2 + i * 1.3) * 0.4
        ;(tip.material as THREE.MeshBasicMaterial).opacity = 0.4 + pulse * 0.6
        tip.scale.setScalar(0.8 + pulse * 0.5)
      }
      if (this.portalRing) this.portalRing.rotation.z += dt * 0.25
    }

    // city shrink easing
    this.cityShrink += (this.cityShrinkTarget - this.cityShrink) * 0.06
    for (const b of this.cityBoxes) {
      b.scale.y = 1 - this.cityShrink * 0.72
    }

    this.renderer.render(this.scene, this.camera)
  }

  dispose() {
    this.disposed = true
    cancelAnimationFrame(this.raf)
    window.removeEventListener('resize', this.onResize)
    this.scene.traverse((o) => {
      const m = o as THREE.Mesh
      if (m.geometry) m.geometry.dispose()
      const mat = (m as THREE.Mesh).material as THREE.Material | THREE.Material[] | undefined
      if (Array.isArray(mat)) mat.forEach((x) => x.dispose())
      else if (mat) mat.dispose()
    })
    this.renderer.dispose()
  }
}
