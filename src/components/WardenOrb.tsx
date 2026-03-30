'use client';

import { Suspense, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { cn } from '@/lib/utils';

const orbThemes = {
  blue: {
    shell: '#93c5fd',
    core: '#7dd3fc',
    emissive: '#2563eb',
    light: '#60a5fa',
    sparkles: '#dbeafe',
    shellGlow: 'rgba(96, 165, 250, 0.28)',
    aura: 'rgba(37, 99, 235, 0.18)',
  },
  purple: {
    shell: '#c4b5fd',
    core: '#d8b4fe',
    emissive: '#9333ea',
    light: '#c084fc',
    sparkles: '#f3e8ff',
    shellGlow: 'rgba(192, 132, 252, 0.28)',
    aura: 'rgba(126, 34, 206, 0.2)',
  },
  green: {
    shell: '#86efac',
    core: '#6ee7b7',
    emissive: '#059669',
    light: '#34d399',
    sparkles: '#dcfce7',
    shellGlow: 'rgba(52, 211, 153, 0.28)',
    aura: 'rgba(5, 150, 105, 0.18)',
  },
} as const;

type OrbColor = keyof typeof orbThemes;
type BotState = 'idle' | 'active' | 'thinking';

interface WardenBotProps {
  color?: OrbColor;
  className?: string;
  state?: BotState;
  fullBleed?: boolean;
  /** Which side of the viewport the bot occupies in fullBleed mode. Default: 'right' */
  side?: 'left' | 'right';
}

interface WardenBotSceneProps {
  color: OrbColor;
  state?: BotState;
  offset?: [number, number, number];
  pointingSide?: 'left' | 'right';
}

// ── Three expanding rings that emanate from the bot face when speaking ────────
function SpeechRing({
  color,
  delay,
  speaking,
}: {
  color: string;
  delay: number;
  speaking: boolean;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const mat = ref.current.material as THREE.MeshStandardMaterial;
    if (!speaking) {
      mat.opacity = 0;
      return;
    }
    const t = (state.clock.getElapsedTime() * 0.85 + delay) % 1;
    ref.current.scale.setScalar(1 + t * 2.8);
    mat.opacity = (1 - t) * 0.2;
  });

  return (
    <mesh ref={ref} position={[0, 0.06, 0.52]}>
      <ringGeometry args={[0.54, 0.58, 40]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={1.4}
        transparent
        opacity={0}
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// ── Mouth bar that animates width to simulate speech ─────────────────────────
function MouthBar({
  theme,
  speaking,
}: {
  theme: (typeof orbThemes)[OrbColor];
  speaking: boolean;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const mat = ref.current.material as THREE.MeshStandardMaterial;
    const t = state.clock.getElapsedTime();

    if (speaking) {
      // Layered sines for organic-feeling speech rhythm
      const w =
        0.2 +
        Math.abs(Math.sin(t * 8.4)) * 0.32 +
        Math.abs(Math.sin(t * 5.3 + 1.1)) * 0.16;
      ref.current.scale.x = THREE.MathUtils.lerp(ref.current.scale.x, w, 0.2);
      mat.emissiveIntensity = THREE.MathUtils.lerp(
        mat.emissiveIntensity,
        1.6 + Math.abs(Math.sin(t * 7.2)) * 1.4,
        0.16
      );
    } else {
      ref.current.scale.x = THREE.MathUtils.lerp(ref.current.scale.x, 0.55, 0.07);
      mat.emissiveIntensity = THREE.MathUtils.lerp(mat.emissiveIntensity, 0.7, 0.07);
    }
  });

  return (
    <mesh ref={ref} position={[0, -0.36, 0.485]}>
      {/* Base geometry is 0.48 wide; scale.x is driven above */}
      <boxGeometry args={[0.48, 0.055, 0.035]} />
      <meshStandardMaterial
        color={theme.light}
        emissive={theme.light}
        emissiveIntensity={0.9}
        roughness={0.12}
        metalness={0.25}
      />
    </mesh>
  );
}

function ArmAssembly({
  side,
  theme,
  speaking,
  pointingSide,
}: {
  side: 'left' | 'right';
  theme: (typeof orbThemes)[OrbColor];
  speaking: boolean;
  pointingSide: 'left' | 'right';
}) {
  const direction = side === 'left' ? -1 : 1;
  const armRef = useRef<THREE.Group>(null);
  const handRef = useRef<THREE.Group>(null);
  const leadArm = side === pointingSide;

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    const targetDirection = pointingSide === 'right' ? 1 : -1;
    const idleArmZ = direction * 0.22;
    const targetArmZ = speaking
      ? targetDirection * (leadArm ? 1.05 : 0.46)
      : idleArmZ;
    const targetArmX = speaking ? -0.18 : 0;
    const targetHandZ = speaking
      ? targetDirection * (leadArm ? -0.32 : -0.12)
      : 0;
    const targetHandY = speaking && leadArm ? -0.71 : -0.68;
    const emphasisLift = speaking ? Math.sin(elapsed * 9.4) * 0.018 : 0;

    if (armRef.current) {
      armRef.current.rotation.z = THREE.MathUtils.lerp(
        armRef.current.rotation.z,
        targetArmZ,
        0.12
      );
      armRef.current.rotation.x = THREE.MathUtils.lerp(
        armRef.current.rotation.x,
        targetArmX,
        0.12
      );
    }

    if (handRef.current) {
      handRef.current.rotation.z = THREE.MathUtils.lerp(
        handRef.current.rotation.z,
        targetHandZ,
        0.16
      );
      handRef.current.position.y = THREE.MathUtils.lerp(
        handRef.current.position.y,
        targetHandY + emphasisLift,
        0.16
      );
    }
  });

  return (
    <group ref={armRef} position={[0.57 * direction, 0.08, 0]}>
      <mesh position={[0, 0.02, 0]}>
        <boxGeometry args={[0.18, 0.18, 0.2]} />
        <meshStandardMaterial color="#202938" roughness={0.34} metalness={0.36} />
      </mesh>

      <mesh position={[0, -0.24, 0.01]}>
        <boxGeometry args={[0.15, 0.34, 0.17]} />
        <meshStandardMaterial color="#202938" roughness={0.36} metalness={0.34} />
      </mesh>

      <mesh position={[0, -0.48, 0.03]}>
        <boxGeometry args={[0.13, 0.22, 0.15]} />
        <meshStandardMaterial color="#1b2432" roughness={0.34} metalness={0.36} />
      </mesh>

      <group ref={handRef} position={[0, -0.68, 0.05]}>
        <mesh position={[0, -0.01, 0.02]}>
          <boxGeometry args={[0.18, 0.16, 0.18]} />
          <meshStandardMaterial color="#1a2230" roughness={0.3} metalness={0.32} />
        </mesh>

        <mesh position={[0, 0, 0.12]}>
          <boxGeometry args={[0.09, 0.04, 0.03]} />
          <meshStandardMaterial
            color={theme.light}
            emissive={theme.light}
            emissiveIntensity={0.55}
            roughness={0.12}
            metalness={0.22}
          />
        </mesh>

        <mesh position={[-0.04, -0.13, 0.1]}>
          <boxGeometry args={[0.04, 0.13, 0.04]} />
          <meshStandardMaterial color="#202938" roughness={0.28} metalness={0.3} />
        </mesh>

        <mesh position={[0.04, -0.13, 0.1]}>
          <boxGeometry args={[0.04, 0.13, 0.04]} />
          <meshStandardMaterial color="#202938" roughness={0.28} metalness={0.3} />
        </mesh>

        <mesh position={[0.08 * direction, -0.03, 0.05]} rotation={[0, 0, direction * 0.55]}>
          <boxGeometry args={[0.04, 0.12, 0.04]} />
          <meshStandardMaterial color="#202938" roughness={0.28} metalness={0.3} />
        </mesh>
      </group>
    </group>
  );
}

function LegAssembly({
  side,
  speaking,
  pointingSide,
}: {
  side: 'left' | 'right';
  speaking: boolean;
  pointingSide: 'left' | 'right';
}) {
  const direction = side === 'left' ? -1 : 1;
  const baseX = 0.22 * direction;
  const legRef = useRef<THREE.Group>(null);
  const shinRef = useRef<THREE.Mesh>(null);
  const footRef = useRef<THREE.Mesh>(null);
  const leadLeg = side === pointingSide;

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    const targetDirection = pointingSide === 'right' ? 1 : -1;
    const stanceOffset = speaking ? targetDirection * (leadLeg ? 0.07 : -0.02) : 0;
    const targetLegZ = speaking ? targetDirection * (leadLeg ? -0.16 : 0.08) : 0;
    const targetShinZ = speaking ? targetDirection * (leadLeg ? 0.14 : -0.05) : 0;
    const targetFootZ = speaking ? targetDirection * (leadLeg ? -0.12 : 0.04) : 0;
    const footLift = speaking && leadLeg ? Math.sin(elapsed * 9.4) * 0.01 : 0;

    if (legRef.current) {
      legRef.current.position.x = THREE.MathUtils.lerp(
        legRef.current.position.x,
        baseX + stanceOffset,
        0.14
      );
      legRef.current.rotation.z = THREE.MathUtils.lerp(
        legRef.current.rotation.z,
        targetLegZ,
        0.14
      );
    }

    if (shinRef.current) {
      shinRef.current.rotation.z = THREE.MathUtils.lerp(
        shinRef.current.rotation.z,
        targetShinZ,
        0.14
      );
    }

    if (footRef.current) {
      footRef.current.rotation.z = THREE.MathUtils.lerp(
        footRef.current.rotation.z,
        targetFootZ,
        0.14
      );
      footRef.current.position.y = THREE.MathUtils.lerp(
        footRef.current.position.y,
        -0.56 + footLift,
        0.14
      );
      footRef.current.position.x = THREE.MathUtils.lerp(
        footRef.current.position.x,
        speaking ? targetDirection * (leadLeg ? 0.03 : -0.01) : 0,
        0.14
      );
    }
  });

  return (
    <group ref={legRef} position={[baseX, -0.66, 0]}>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.18, 0.42, 0.18]} />
        <meshStandardMaterial color="#202938" roughness={0.34} metalness={0.36} />
      </mesh>
      <mesh ref={shinRef} position={[0, -0.36, 0.02]}>
        <boxGeometry args={[0.16, 0.34, 0.16]} />
        <meshStandardMaterial color="#202938" roughness={0.34} metalness={0.36} />
      </mesh>
      <mesh ref={footRef} position={[0, -0.56, 0.11]}>
        <boxGeometry args={[0.24, 0.08, 0.34]} />
        <meshStandardMaterial color="#1a2230" roughness={0.32} metalness={0.3} />
      </mesh>
    </group>
  );
}

function WardenBotScene({
  color,
  state: botState,
  offset = [0, 0, 0],
  pointingSide = 'right',
}: WardenBotSceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const outerRef = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Group>(null);
  const leftEyeRef = useRef<THREE.Mesh>(null);
  const rightEyeRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const [hovered, setHovered] = useState(false);
  const theme = orbThemes[color];
  const speaking = botState === 'active';

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    const pulse = (Math.sin(elapsed * 2.4) + 1) * 0.5;
    const thinking = botState === 'thinking' || (!botState && Math.sin(elapsed * 0.6) > 0.7);
    const aware = hovered || botState === 'active' || botState === 'thinking';
    const motionSpeed = botState === 'active' ? 1.15 : botState === 'thinking' ? 0.9 : 1;
    const targetDirection = pointingSide === 'right' ? 1 : -1;
    const jumpCycle = Math.max(0, Math.sin(elapsed * (2.1 * motionSpeed)));
    const jumpHeight = Math.pow(jumpCycle, 1.55) * 0.34;

    if (groupRef.current) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, 0, 0.08);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, 0, 0.08);
      groupRef.current.position.x = THREE.MathUtils.lerp(
        groupRef.current.position.x,
        offset[0] + Math.sin(elapsed * 3) * 0.002,
        0.08
      );
      groupRef.current.position.y = THREE.MathUtils.lerp(
        groupRef.current.position.y,
        offset[1] + jumpHeight,
        0.12
      );
      groupRef.current.position.z = THREE.MathUtils.lerp(
        groupRef.current.position.z,
        offset[2] + Math.cos(elapsed * 2.5) * 0.002,
        0.08
      );

      const currentScale = groupRef.current.scale.x;
      const targetScale = hovered ? 1.08 : aware ? 1.03 : 1;
      groupRef.current.scale.setScalar(THREE.MathUtils.lerp(currentScale, targetScale, 0.08));
    }

    if (outerRef.current) {
      outerRef.current.rotation.y = THREE.MathUtils.lerp(
        outerRef.current.rotation.y,
        speaking ? targetDirection * 0.2 : 0,
        0.08
      );
      outerRef.current.rotation.x = THREE.MathUtils.lerp(
        outerRef.current.rotation.x,
        speaking ? -0.06 : 0,
        0.08
      );
      outerRef.current.rotation.z = THREE.MathUtils.lerp(
        outerRef.current.rotation.z,
        speaking ? targetDirection * -0.07 : 0,
        0.05
      );
    }

    if (coreRef.current) {
      coreRef.current.position.x = THREE.MathUtils.lerp(
        coreRef.current.position.x,
        speaking ? targetDirection * 0.05 : 0,
        0.1
      );
      coreRef.current.position.y = THREE.MathUtils.lerp(
        coreRef.current.position.y,
        speaking ? 0.1 : 0.08,
        0.1
      );
    }

    const baseGlow = hovered ? 4.4 : 2.8;
    const thinkingBoost = thinking ? 1.2 : 0;
    for (const eye of [leftEyeRef.current, rightEyeRef.current]) {
      if (eye?.material instanceof THREE.MeshStandardMaterial) {
        eye.material.emissiveIntensity = THREE.MathUtils.lerp(
          eye.material.emissiveIntensity,
          baseGlow + pulse * 0.8 + thinkingBoost,
          0.08
        );
      }
    }

    if (lightRef.current && coreRef.current) {
      lightRef.current.intensity = THREE.MathUtils.lerp(
        lightRef.current.intensity,
        (aware ? 5 : 3.6) + pulse * 0.75 + (thinking ? 0.35 : 0),
        0.08
      );
      lightRef.current.position.x = THREE.MathUtils.lerp(
        lightRef.current.position.x,
        coreRef.current.position.x,
        0.12
      );
      lightRef.current.position.y = THREE.MathUtils.lerp(
        lightRef.current.position.y,
        coreRef.current.position.y + 0.5,
        0.12
      );
      lightRef.current.position.z = THREE.MathUtils.lerp(
        lightRef.current.position.z,
        coreRef.current.position.z + 0.42,
        0.12
      );
    }
  });

  return (
    <>
      <ambientLight intensity={0.7} />

      <group
        ref={groupRef}
        position={offset}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        {/* ── Head ── */}
        <mesh ref={outerRef} position={[0, 0.48, 0]}>
          <boxGeometry args={[1.44, 1.08, 0.92]} />
          <meshStandardMaterial
            color="#131923"
            roughness={0.34}
            metalness={0.42}
            emissive="#080d16"
            emissiveIntensity={0.3}
          />

          {/* Eye rig */}
          <group ref={coreRef} position={[0, 0.08, 0.49]}>
            <mesh ref={leftEyeRef} position={[-0.23, 0, 0]}>
              <boxGeometry args={[0.22, 0.18, 0.06]} />
              <meshStandardMaterial
                color={theme.core}
                emissive={theme.emissive}
                emissiveIntensity={2.8}
                roughness={0.18}
                metalness={0.22}
              />
            </mesh>
            <mesh ref={rightEyeRef} position={[0.23, 0, 0]}>
              <boxGeometry args={[0.22, 0.18, 0.06]} />
              <meshStandardMaterial
                color={theme.core}
                emissive={theme.emissive}
                emissiveIntensity={2.8}
                roughness={0.18}
                metalness={0.22}
              />
            </mesh>
            <mesh position={[0, 0, 0.005]}>
              <boxGeometry args={[0.14, 0.045, 0.04]} />
              <meshStandardMaterial
                color={theme.light}
                emissive={theme.light}
                emissiveIntensity={0.7}
                roughness={0.14}
                metalness={0.22}
              />
            </mesh>
          </group>

          <pointLight
            ref={lightRef}
            position={[0, 0.56, 0.91]}
            intensity={3.6}
            distance={6}
            color={theme.light}
          />

          {/* Animated mouth */}
          <MouthBar theme={theme} speaking={speaking} />

          {/* Speech ripple rings */}
          <SpeechRing color={theme.light} delay={0} speaking={speaking} />
          <SpeechRing color={theme.light} delay={0.33} speaking={speaking} />
          <SpeechRing color={theme.light} delay={0.66} speaking={speaking} />
        </mesh>

        {/* ── Neck connector ── */}
        <mesh position={[0, -0.03, 0]}>
          <cylinderGeometry args={[0.12, 0.15, 0.32, 12]} />
          <meshStandardMaterial color="#1a2230" roughness={0.34} metalness={0.38} />
        </mesh>

        {/* ── Body frame ── */}
        <group position={[0, -0.56, 0]}>
          <mesh position={[0, 0.12, 0]}>
            <boxGeometry args={[0.98, 0.78, 0.58]} />
            <meshStandardMaterial color="#1b2432" roughness={0.38} metalness={0.36} />
          </mesh>

          <mesh position={[0, 0.43, 0]}>
            <boxGeometry args={[1.18, 0.12, 0.26]} />
            <meshStandardMaterial color="#202938" roughness={0.34} metalness={0.38} />
          </mesh>

          <mesh position={[0, -0.34, 0]}>
            <boxGeometry args={[0.76, 0.18, 0.42]} />
            <meshStandardMaterial color="#202938" roughness={0.36} metalness={0.36} />
          </mesh>

          <ArmAssembly side="left" theme={theme} speaking={speaking} pointingSide={pointingSide} />
          <ArmAssembly side="right" theme={theme} speaking={speaking} pointingSide={pointingSide} />

          <LegAssembly side="left" speaking={speaking} pointingSide={pointingSide} />
          <LegAssembly side="right" speaking={speaking} pointingSide={pointingSide} />
        </group>

        {/* ── Neck ring ── */}
        <mesh position={[0, -0.06, -0.08]} rotation={[Math.PI / 2.8, 0, 0]}>
          <torusGeometry args={[0.92, 0.025, 10, 48]} />
          <meshStandardMaterial
            color={theme.light}
            emissive={theme.light}
            emissiveIntensity={0.55}
            transparent
            opacity={0.32}
            roughness={0.18}
            metalness={0.22}
          />
        </mesh>

        <Sparkles
          count={6}
          scale={[1.9, 1.7, 1.4]}
          size={1.4}
          speed={0.18}
          opacity={hovered ? 0.55 : 0.35}
          color={theme.sparkles}
          noise={0.55}
        />
      </group>
    </>
  );
}

export default function WardenBot({
  color = 'blue',
  className,
  state,
  fullBleed = false,
  side = 'right',
}: WardenBotProps) {
  const theme = orbThemes[color];
  const xOffset = side === 'left' ? -1.6 : 1.6;
  const pointingSide = side === 'left' ? 'right' : 'left';

  if (fullBleed) {
    return (
      <div className={cn('pointer-events-none', className)}>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              side === 'left'
                ? `radial-gradient(ellipse 60% 70% at 28% 52%, ${theme.shellGlow}, transparent 60%)`
                : `radial-gradient(ellipse 60% 70% at 72% 52%, ${theme.shellGlow}, transparent 60%)`,
          }}
        />
        <Canvas
          className="!h-full !w-full"
          dpr={[1, 1.5]}
          camera={{ position: [0, 0, 5.8], fov: 42 }}
          gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
          style={{ background: 'transparent' }}
        >
          <Suspense fallback={null}>
            <WardenBotScene
              color={color}
              state={state}
              offset={[xOffset, 0, 0]}
              pointingSide={pointingSide}
            />
          </Suspense>
        </Canvas>
      </div>
    );
  }

  // ── Contained / card mode ────────────────────────────────────────────────
  return (
    <div
      className={cn(
        'relative h-[340px] w-full overflow-hidden rounded-[2rem] border border-white/10 bg-[#0a0a0a] shadow-[0_32px_120px_rgba(2,6,23,0.78)] sm:h-[420px] lg:h-[520px]',
        className
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-90"
        style={{
          backgroundImage: `radial-gradient(circle at top, ${theme.shellGlow}, transparent 46%), radial-gradient(circle at bottom, rgba(255,255,255,0.06), transparent 58%)`,
        }}
      />
      <div
        className="pointer-events-none absolute inset-10 rounded-full blur-3xl"
        style={{ background: theme.aura }}
      />

      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 4.6], fov: 36 }}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      >
        <color attach="background" args={['#0a0a0a']} />
        <fog attach="fog" args={['#0a0a0a', 3, 7]} />
        <Suspense
          fallback={
            <Html center>
              <div className="h-16 w-16 animate-pulse rounded-full border border-white/15 bg-white/5 backdrop-blur-sm" />
            </Html>
          }
        >
          <WardenBotScene color={color} state={state} pointingSide="right" />
        </Suspense>
      </Canvas>
    </div>
  );
}
