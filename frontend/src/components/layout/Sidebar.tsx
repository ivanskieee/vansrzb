'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, ContactShadows, Environment, Text } from '@react-three/drei'
import { useRef, useState, useEffect } from 'react'
import * as THREE from 'three'

// ─── Types ────────────────────────────────────────────────────────────────────
type Phase = 'walking' | 'knocking' | 'opening' | 'entering' | 'exiting' | 'rejected'

// ─── Constants ────────────────────────────────────────────────────────────────
// Building front face sits at z = +0.11 (half depth 0.22/2 = 0.11)
// Door center x is at 0 within building local space
// We place character in WORLD space, buildings are at BUILDING_X[i]
const BUILDING_X = [-0.5, 0, 0.5]
// How far in front of the building door the character stands (world z offset from building z-front)
const STAND_Z    = 0.18   // character z when standing at door (world)
const INSIDE_Z   = -0.06  // character z when fully "inside" (world) — behind building front face

const COMPANIES = [
  { name: 'TechCorp', color: '#3b82f6' },
  { name: 'StartupX', color: '#10b981' },
  { name: 'DevInc',   color: '#f59e0b' },
]

const MESSAGES = [
  '"We\'ll keep your résumé on file…"',
  '"Not the right fit at this time."',
  '"We went with another candidate."',
]

const PHASE_DURATIONS: Record<Phase, number> = {
  walking:  1400,
  knocking:  900,
  opening:   600,   // door swings open + brief pause
  entering: 1000,   // walk into building, shrink away
  exiting:   900,   // shoved back out, grow back
  rejected: 1400,
}
const PHASE_ORDER: Phase[] = ['walking','knocking','opening','entering','exiting','rejected']

function elerp(a: number, b: number, speed: number, dt: number) {
  return THREE.MathUtils.lerp(a, b, 1 - Math.pow(0.001, speed * dt))
}

// ─── Rejection Sign ───────────────────────────────────────────────────────────
function RejectionSign({ visible }: { visible: boolean }) {
  const ref = useRef<THREE.Group>(null)
  useFrame((s, dt) => {
    if (!ref.current) return
    const n = elerp(ref.current.scale.x, visible ? 1.15 : 0, 8, dt)
    ref.current.scale.setScalar(n)
    if (n > 0.05) ref.current.rotation.z = Math.sin(s.clock.elapsedTime * 6) * 0.07
  })
  return (
    <group ref={ref} position={[0.5, 0.85, 0]} scale={0}>
      <mesh>
        <circleGeometry args={[0.16, 32]} />
        <meshStandardMaterial color="#ef4444" />
      </mesh>
      <mesh position={[0, 0, 0.01]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[0.18, 0.036, 0.01]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0, 0, 0.01]} rotation={[0, 0, -Math.PI / 4]}>
        <boxGeometry args={[0.18, 0.036, 0.01]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <Text position={[0, -0.26, 0]} fontSize={0.09} color="#ef4444" anchorX="center" anchorY="middle">
        REJECTED
      </Text>
    </group>
  )
}

// ─── Animated Door ────────────────────────────────────────────────────────────
// Door is 0.07 wide, 0.09 tall. Hinge on left edge.
// Open = rotate -90° on Y so it swings into building (toward -z in building space)
function AnimatedDoor({ open }: { open: boolean }) {
  const ref = useRef<THREE.Group>(null)
  useFrame((_s, dt) => {
    if (!ref.current) return
    ref.current.rotation.y = elerp(ref.current.rotation.y, open ? -Math.PI / 2 : 0, 8, dt)
  })
  // Pivot group sits at left edge of door, on the front face of building
  // Building front face z = +0.11. Door left edge x = -0.035 from building center
  return (
    <group position={[-0.035, 0.045, 0.111]} ref={ref}>
      {/* Door panel — offset right by half width so pivot is at left edge */}
      <mesh position={[0.035, 0, 0]}>
        <boxGeometry args={[0.07, 0.09, 0.006]} />
        <meshStandardMaterial color="#5c3317" roughness={0.7} />
      </mesh>
      {/* Knob */}
      <mesh position={[0.062, 0, 0.005]}>
        <sphereGeometry args={[0.007, 8, 8]} />
        <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.1} />
      </mesh>
    </group>
  )
}

// ─── Company Building ─────────────────────────────────────────────────────────
function CompanyBuilding({
  position, color, doorOpen,
}: {
  position: [number, number, number]
  color: string
  doorOpen: boolean
}) {
  return (
    <group position={position}>
      {/* Body */}
      <mesh position={[0, 0.15, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.22, 0.3, 0.22]} />
        <meshStandardMaterial color={color} roughness={0.35} metalness={0.1} />
      </mesh>
      {/* Roof */}
      <mesh position={[0, 0.33, 0]} castShadow>
        <coneGeometry args={[0.16, 0.09, 4]} />
        <meshStandardMaterial color="#374151" roughness={0.6} />
      </mesh>
      {/* Window */}
      <mesh position={[0, 0.19, 0.112]}>
        <planeGeometry args={[0.12, 0.08]} />
        <meshStandardMaterial color="#bae6fd" emissive="#93c5fd" emissiveIntensity={0.25} roughness={0.1} />
      </mesh>
      {/* Door frame (dark surround) */}
      <mesh position={[0, 0.045, 0.1115]}>
        <planeGeometry args={[0.085, 0.1]} />
        <meshStandardMaterial color="#1a0a00" />
      </mesh>
      {/* Doorway interior — warm glow when open */}
      <mesh position={[0, 0.045, 0.1105]}>
        <planeGeometry args={[0.07, 0.09]} />
        <meshStandardMaterial
          color={doorOpen ? '#fcd9a0' : '#0a0608'}
          emissive={doorOpen ? '#f59e0b' : '#000000'}
          emissiveIntensity={doorOpen ? 0.4 : 0}
        />
      </mesh>
      {/* Animated door */}
      <AnimatedDoor open={doorOpen} />
    </group>
  )
}

// ─── Job Seeker ───────────────────────────────────────────────────────────────
function JobSeeker({
  targetIndex, phase,
}: {
  targetIndex: number
  phase: Phase
}) {
  const groupRef    = useRef<THREE.Group>(null)
  const leftLegRef  = useRef<THREE.Group>(null)
  const rightLegRef = useRef<THREE.Group>(null)
  const leftArmRef  = useRef<THREE.Group>(null)
  const rightArmRef = useRef<THREE.Group>(null)

  // Internal animated state stored in refs (avoids React re-renders)
  const charZ   = useRef(STAND_Z)
  const charScl = useRef(0.45)

  // X target: stand in front of the building
  const targetX = BUILDING_X[targetIndex] ?? 0

  useFrame((state, dt) => {
    if (!groupRef.current) return
    const t    = state.clock.elapsedTime
    const ease = 1 - Math.pow(0.01, dt * 6)

    // ── X ────────────────────────────────────────────────────────────────────
    const xSpeed = (phase === 'walking' || phase === 'exiting') ? 3.5 : 10
    const nx = elerp(groupRef.current.position.x, targetX, xSpeed, dt)
    groupRef.current.position.x = nx
    const movingX = Math.abs(nx - targetX) > 0.006

    // ── Z + Scale (entering / exiting building) ───────────────────────────────
    let zTarget: number
    let sclTarget: number

    if (phase === 'entering') {
      // Walk toward building front face then into it
      zTarget   = INSIDE_Z
      sclTarget = 0.08          // shrink to almost nothing
    } else if (phase === 'exiting') {
      zTarget   = STAND_Z       // come back out to standing position
      sclTarget = 0.45
    } else {
      zTarget   = STAND_Z
      sclTarget = 0.45
    }

    charZ.current   = elerp(charZ.current,   zTarget,   phase === 'entering' ? 2.5 : 4, dt)
    charScl.current = elerp(charScl.current, sclTarget, phase === 'entering' ? 2.5 : 4, dt)

    groupRef.current.position.z = charZ.current
    groupRef.current.scale.setScalar(Math.max(charScl.current, 0.001))

    // ── Limbs ─────────────────────────────────────────────────────────────────
    if ((phase === 'walking' && movingX) || phase === 'entering' || phase === 'exiting') {
      const freq = phase === 'entering' ? 12 : 10
      const leg  = Math.sin(t * freq) * 0.55
      const arm  = Math.sin(t * freq) * 0.35
      leftLegRef.current!.rotation.x  =  leg
      rightLegRef.current!.rotation.x = -leg
      leftArmRef.current!.rotation.x  = -arm
      rightArmRef.current!.rotation.x =  arm
      groupRef.current.position.y = Math.abs(Math.sin(t * freq * 0.5)) * 0.012
    } else if (phase === 'knocking' || phase === 'opening') {
      // Right arm knocking — rapid forward tap
      const knock = Math.max(Math.sin(t * 13), 0) * (phase === 'knocking' ? 1.0 : 0.3)
      rightArmRef.current!.rotation.x = -knock * 1.2
      leftArmRef.current!.rotation.x  = elerp(leftArmRef.current!.rotation.x, 0, 5, dt)
      leftLegRef.current!.rotation.x  = elerp(leftLegRef.current!.rotation.x, 0, 5, dt)
      rightLegRef.current!.rotation.x = elerp(rightLegRef.current!.rotation.x, 0, 5, dt)
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, 0, ease)
    } else if (phase === 'rejected') {
      leftLegRef.current!.rotation.x  = THREE.MathUtils.lerp(leftLegRef.current!.rotation.x, 0, ease)
      rightLegRef.current!.rotation.x = THREE.MathUtils.lerp(rightLegRef.current!.rotation.x, 0, ease)
      leftArmRef.current!.rotation.x  = THREE.MathUtils.lerp(leftArmRef.current!.rotation.x, 0.5, ease)
      rightArmRef.current!.rotation.x = THREE.MathUtils.lerp(rightArmRef.current!.rotation.x, 0.5, ease)
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, 0, ease)
    } else {
      leftLegRef.current!.rotation.x  = THREE.MathUtils.lerp(leftLegRef.current!.rotation.x, 0, ease)
      rightLegRef.current!.rotation.x = THREE.MathUtils.lerp(rightLegRef.current!.rotation.x, 0, ease)
      leftArmRef.current!.rotation.x  = THREE.MathUtils.lerp(leftArmRef.current!.rotation.x, 0, ease)
      rightArmRef.current!.rotation.x = THREE.MathUtils.lerp(rightArmRef.current!.rotation.x, 0, ease)
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, 0, ease)
    }
  })

  return (
    <group ref={groupRef} position={[BUILDING_X[0], 0, STAND_Z]} scale={0.45}>
      {/* Suit body */}
      <mesh position={[0, 0.35, 0]} castShadow>
        <boxGeometry args={[0.28, 0.35, 0.18]} />
        <meshStandardMaterial color="#1e293b" roughness={0.4} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 0.65, 0]} castShadow>
        <sphereGeometry args={[0.14, 20, 20]} />
        <meshStandardMaterial color="#f5d0c5" roughness={0.55} />
      </mesh>
      {/* Hair */}
      <mesh position={[0, 0.72, -0.015]}>
        <sphereGeometry args={[0.145, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#2d2d2d" roughness={0.8} />
      </mesh>
      {/* Eyes */}
      <mesh position={[-0.042, 0.655, 0.124]}>
        <sphereGeometry args={[0.019, 10, 10]} />
        <meshStandardMaterial color="#111111" />
      </mesh>
      <mesh position={[0.042, 0.655, 0.124]}>
        <sphereGeometry args={[0.019, 10, 10]} />
        <meshStandardMaterial color="#111111" />
      </mesh>
      {/* Eyebrows */}
      <mesh position={[-0.044, 0.695, 0.113]} rotation={[0, 0, 0.35]}>
        <boxGeometry args={[0.042, 0.011, 0.008]} />
        <meshStandardMaterial color="#2d2d2d" />
      </mesh>
      <mesh position={[0.044, 0.695, 0.113]} rotation={[0, 0, -0.35]}>
        <boxGeometry args={[0.042, 0.011, 0.008]} />
        <meshStandardMaterial color="#2d2d2d" />
      </mesh>
      {/* Collar */}
      <mesh position={[0, 0.52, 0.091]}>
        <boxGeometry args={[0.09, 0.045, 0.015]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      {/* Tie */}
      <mesh position={[0, 0.47, 0.1]}>
        <boxGeometry args={[0.027, 0.13, 0.015]} />
        <meshStandardMaterial color="#ef4444" />
      </mesh>
      {/* Left Arm */}
      <group position={[-0.19, 0.37, 0]} ref={leftArmRef}>
        <mesh position={[0, -0.09, 0]} castShadow>
          <boxGeometry args={[0.08, 0.19, 0.08]} />
          <meshStandardMaterial color="#1e293b" roughness={0.4} />
        </mesh>
        <mesh position={[0, -0.2, 0]}>
          <sphereGeometry args={[0.046, 10, 10]} />
          <meshStandardMaterial color="#f5d0c5" />
        </mesh>
      </group>
      {/* Right Arm */}
      <group position={[0.19, 0.37, 0]} ref={rightArmRef}>
        <mesh position={[0, -0.09, 0]} castShadow>
          <boxGeometry args={[0.08, 0.19, 0.08]} />
          <meshStandardMaterial color="#1e293b" roughness={0.4} />
        </mesh>
        <mesh position={[0, -0.2, 0]}>
          <sphereGeometry args={[0.046, 10, 10]} />
          <meshStandardMaterial color="#f5d0c5" />
        </mesh>
      </group>
      {/* Left Leg */}
      <group position={[-0.075, 0.115, 0]} ref={leftLegRef}>
        <mesh position={[0, -0.11, 0]} castShadow>
          <boxGeometry args={[0.09, 0.23, 0.09]} />
          <meshStandardMaterial color="#334155" roughness={0.5} />
        </mesh>
        <mesh position={[0, -0.235, 0.022]} castShadow>
          <boxGeometry args={[0.09, 0.04, 0.13]} />
          <meshStandardMaterial color="#0f0f0f" />
        </mesh>
      </group>
      {/* Right Leg */}
      <group position={[0.075, 0.115, 0]} ref={rightLegRef}>
        <mesh position={[0, -0.11, 0]} castShadow>
          <boxGeometry args={[0.09, 0.23, 0.09]} />
          <meshStandardMaterial color="#334155" roughness={0.5} />
        </mesh>
        <mesh position={[0, -0.235, 0.022]} castShadow>
          <boxGeometry args={[0.09, 0.04, 0.13]} />
          <meshStandardMaterial color="#0f0f0f" />
        </mesh>
      </group>
      {/* Rejection sign */}
      <RejectionSign visible={phase === 'rejected'} />
    </group>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Sidebar() {
  const [company, setCompany]           = useState(0)
  const [phase, setPhase]               = useState<Phase>('walking')
  const [rejectedCount, setRejectedCount] = useState(0)

  const doorOpen = phase === 'opening' || phase === 'entering' || phase === 'exiting'

  // Advance phases on a timer
  useEffect(() => {
    const ms = PHASE_DURATIONS[phase]
    const t  = setTimeout(() => {
      const idx  = PHASE_ORDER.indexOf(phase)
      const next = PHASE_ORDER[idx + 1] as Phase | undefined
      if (!next) {
        // Cycle done — go to next company
        setRejectedCount(c => c + 1)
        setCompany(c => (c + 1) % COMPANIES.length)
        setPhase('walking')
      } else {
        if (next === 'rejected') setRejectedCount(c => c + 1)
        setPhase(next)
      }
    }, ms)
    return () => clearTimeout(t)
  }, [phase, company])

  const statusText = () => {
    switch (phase) {
      case 'walking':  return <>Walking to <span className="font-semibold text-black dark:text-white">{COMPANIES[company].name}</span>…</>
      case 'knocking': return <>Knocking on the door…</>
      case 'opening':  return <>Door is opening… 🚪</>
      case 'entering': return <>Walking inside… 🤞</>
      case 'exiting':  return <>Being shown the door… 😔</>
      case 'rejected': return <span className="text-red-500">{MESSAGES[company]}</span>
    }
  }

  return (
    <div className="w-full">
      <div className="relative h-[280px] w-full overflow-hidden rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-black shadow-xl">

        {/* 3D Canvas */}
        <Canvas shadows camera={{ position: [0, 0.85, 2.2], fov: 48 }}>
          <ambientLight intensity={0.55} />
          <spotLight position={[2, 4, 2]} angle={0.4} penumbra={1} intensity={1.1} castShadow shadow-mapSize={512} />
          <pointLight position={[-2, 2, -1]} intensity={0.2} color="#ffffff" />

          {COMPANIES.map((c, i) => (
            <CompanyBuilding
              key={c.name}
              position={[BUILDING_X[i], 0, 0]}
              color={c.color}
              doorOpen={doorOpen && i === company}
            />
          ))}

          <JobSeeker targetIndex={company} phase={phase} />

          <ContactShadows position={[0, -0.01, 0]} opacity={0.3} scale={3} blur={2.5} far={1} />
          <Environment preset="city" />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            minPolarAngle={Math.PI / 3.2}
            maxPolarAngle={Math.PI / 2.1}
            autoRotate
            autoRotateSpeed={0.35}
          />
        </Canvas>

        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 p-3 pb-0 pointer-events-none">
          <div className="flex items-center justify-between rounded-lg bg-black/5 dark:bg-white/5 backdrop-blur-md border border-black/10 dark:border-white/10 px-3 py-2">
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-red-400" />
              <div className="h-2 w-2 rounded-full bg-yellow-400" />
              <div className="h-2 w-2 rounded-full bg-green-400" />
            </div>
            <span className="text-[10px] text-black/40 dark:text-white/40 font-mono tracking-wide">applications.log</span>
          </div>
        </div>

        {/* Bottom status card */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white dark:from-black via-white/95 dark:via-black/95 to-transparent p-3 pt-10">
          <div className="rounded-lg border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 backdrop-blur-md p-3">

            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-60" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
                </span>
                <span className="text-[10px] font-semibold text-amber-500 uppercase tracking-wider">Still Trying</span>
              </div>
              <span className="text-[10px] text-black/30 dark:text-white/30">{COMPANIES[company].name}</span>
            </div>

            <p className="text-xs text-black/60 dark:text-white/60 mb-2 min-h-[1rem]">{statusText()}</p>

            <div className="flex gap-1">
              {COMPANIES.map((_, i) => {
                const filled = (i === company && phase === 'rejected') || i < (rejectedCount % (COMPANIES.length + 1))
                return (
                  <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${filled ? 'bg-red-500/70' : 'bg-black/10 dark:bg-white/10'}`} />
                )
              })}
            </div>

            <p className="text-[10px] text-black/30 dark:text-white/30 mt-2 italic">
              "The market is tough, but I'm not done yet"
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}