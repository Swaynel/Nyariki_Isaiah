'use client';

import { Suspense, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { cn } from '@/lib/utils';
import type { BotGesture, BotState } from '@/components/sayan/types';

// ── Amber/editorial palette replacing blue/purple/green ──────────────────────
const orbThemes = {
  blue: {
    shell: '#fcd34d',
    core: '#fbbf24',
    emissive: '#b45309',
    light: '#f59e0b',
    sparkles: '#fef3c7',
    shellGlow: 'rgba(245, 158, 11, 0.22)',
    aura: 'rgba(180, 83, 9, 0.15)',
  },
  purple: {
    shell: '#fcd34d',
    core: '#fbbf24',
    emissive: '#92400e',
    light: '#f59e0b',
    sparkles: '#fef3c7',
    shellGlow: 'rgba(245, 158, 11, 0.18)',
    aura: 'rgba(120, 53, 15, 0.18)',
  },
  green: {
    shell: '#fcd34d',
    core: '#fbbf24',
    emissive: '#b45309',
    light: '#f59e0b',
    sparkles: '#fef9c3',
    shellGlow: 'rgba(245, 158, 11, 0.2)',
    aura: 'rgba(180, 83, 9, 0.14)',
  },
} as const;

type OrbColor = keyof typeof orbThemes;

interface WardenBotProps {
  color?: OrbColor;
  className?: string;
  state?: BotState;
  gesture?: BotGesture;
  fullBleed?: boolean;
  fullBleedOffsetX?: number;
  side?: 'left' | 'right';
}

interface WardenBotSceneProps {
  color: OrbColor;
  state?: BotState;
  gesture?: BotGesture;
  offset?: [number, number, number];
  pointingSide?: 'left' | 'right';
}

// ── Speech rings ─────────────────────────────────────────────────────────────
function SpeechRing({ color, delay, speaking }: { color: string; delay: number; speaking: boolean }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const mat = ref.current.material as THREE.MeshStandardMaterial;
    if (!speaking) { mat.opacity = 0; return; }
    const t = (state.clock.getElapsedTime() * 0.85 + delay) % 1;
    ref.current.scale.setScalar(1 + t * 2.8);
    mat.opacity = (1 - t) * 0.18;
  });
  return (
    <mesh ref={ref} position={[0, 0.06, 0.52]}>
      <ringGeometry args={[0.54, 0.58, 40]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.2} transparent opacity={0} depthWrite={false} side={THREE.DoubleSide} />
    </mesh>
  );
}

// ── Mouth bar ─────────────────────────────────────────────────────────────────
function MouthBar({ theme, speaking }: { theme: (typeof orbThemes)[OrbColor]; speaking: boolean }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const mat = ref.current.material as THREE.MeshStandardMaterial;
    const t = state.clock.getElapsedTime();
    if (speaking) {
      const w = 0.2 + Math.abs(Math.sin(t * 8.4)) * 0.32 + Math.abs(Math.sin(t * 5.3 + 1.1)) * 0.16;
      ref.current.scale.x = THREE.MathUtils.lerp(ref.current.scale.x, w, 0.2);
      mat.emissiveIntensity = THREE.MathUtils.lerp(mat.emissiveIntensity, 1.6 + Math.abs(Math.sin(t * 7.2)) * 1.4, 0.16);
    } else {
      ref.current.scale.x = THREE.MathUtils.lerp(ref.current.scale.x, 0.55, 0.07);
      mat.emissiveIntensity = THREE.MathUtils.lerp(mat.emissiveIntensity, 0.7, 0.07);
    }
  });
  return (
    <mesh ref={ref} position={[0, -0.36, 0.485]}>
      <boxGeometry args={[0.48, 0.055, 0.035]} />
      <meshStandardMaterial color={theme.light} emissive={theme.light} emissiveIntensity={0.9} roughness={0.12} metalness={0.25} />
    </mesh>
  );
}

// ── Arm assembly ─────────────────────────────────────────────────────────────
function ArmAssembly({ side, theme, speaking, gesture, pointingSide }: {
  side: 'left' | 'right';
  theme: (typeof orbThemes)[OrbColor];
  speaking: boolean;
  gesture: BotGesture;
  pointingSide: 'left' | 'right';
}) {
  const direction = side === 'left' ? -1 : 1;
  const armRef = useRef<THREE.Group>(null);
  const handRef = useRef<THREE.Group>(null);
  const thumbRef = useRef<THREE.Mesh>(null);
  const leadArm = side === pointingSide;

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    const targetDirection = pointingSide === 'right' ? 1 : -1;
    const greeting = gesture === 'greeting' && leadArm;
    const presenting = gesture === 'present';
    const analyzing = gesture === 'analyze';
    const showcasing = gesture === 'showcase';
    const throwing = gesture === 'throw';
    const clapping = gesture === 'clap';
    const throwPulse = throwing ? Math.max(0, Math.sin(elapsed * 9.2)) : 0;
    const clapPulse = clapping ? (Math.sin(elapsed * 10.4) + 1) * 0.5 : 0;
    const idleArmZ = direction * 0.22;
    let targetArmZ = idleArmZ, targetArmX = 0, targetHandZ = 0, targetHandY = -0.68, targetHandX = 0;

    if (greeting) { targetArmZ = targetDirection * 0.72; targetArmX = -0.28; targetHandZ = targetDirection * 0.46; targetHandY = -0.56; targetHandX = targetDirection * 0.05; }
    else if (clapping) { targetArmZ = -direction * (0.44 + clapPulse * 0.16); targetArmX = -0.32; targetHandZ = -direction * (0.24 + clapPulse * 0.2); targetHandY = -0.56 + clapPulse * 0.015; targetHandX = -direction * (0.11 + clapPulse * 0.04); }
    else if (throwing) { targetArmZ = targetDirection * (leadArm ? 1.18 + throwPulse * 0.14 : 0.88 + throwPulse * 0.1); targetArmX = leadArm ? -0.42 : -0.36; targetHandZ = targetDirection * (leadArm ? -0.56 - throwPulse * 0.08 : -0.42 - throwPulse * 0.06); targetHandY = leadArm ? -0.82 + throwPulse * 0.03 : -0.69 + throwPulse * 0.02; targetHandX = targetDirection * (leadArm ? 0.14 + throwPulse * 0.02 : 0.09 + throwPulse * 0.02); }
    else if (showcasing) { targetArmZ = targetDirection * (leadArm ? 1.18 : 0.62); targetArmX = -0.26; targetHandZ = targetDirection * (leadArm ? -0.44 : -0.18); targetHandY = leadArm ? -0.78 : -0.66; targetHandX = targetDirection * (leadArm ? 0.06 : 0.02); }
    else if (presenting) { targetArmZ = direction * 0.4 + targetDirection * 0.32; targetArmX = -0.14; targetHandZ = targetDirection * (leadArm ? -0.08 : 0.08); targetHandY = -0.62; }
    else if (analyzing) { targetArmZ = direction * 0.16; targetArmX = -0.32; targetHandZ = direction * -0.16; targetHandY = -0.58; targetHandX = direction * -0.03; }
    else if (speaking) { targetArmZ = targetDirection * (leadArm ? 1.05 : 0.46); targetArmX = -0.18; targetHandZ = targetDirection * (leadArm ? -0.32 : -0.12); targetHandY = leadArm ? -0.71 : -0.68; }

    const emphasisLift = greeting ? Math.sin(elapsed * 10.8) * 0.012 : clapping ? clapPulse * 0.014 : throwing ? throwPulse * 0.024 : showcasing ? Math.sin(elapsed * 7.6) * 0.02 : analyzing ? Math.sin(elapsed * 6.1) * 0.01 : speaking ? Math.sin(elapsed * 9.4) * 0.018 : 0;

    if (armRef.current) { armRef.current.rotation.z = THREE.MathUtils.lerp(armRef.current.rotation.z, targetArmZ, 0.12); armRef.current.rotation.x = THREE.MathUtils.lerp(armRef.current.rotation.x, targetArmX, 0.12); }
    if (handRef.current) { handRef.current.rotation.z = THREE.MathUtils.lerp(handRef.current.rotation.z, targetHandZ, 0.16); handRef.current.position.y = THREE.MathUtils.lerp(handRef.current.position.y, targetHandY + emphasisLift, 0.16); handRef.current.position.x = THREE.MathUtils.lerp(handRef.current.position.x, targetHandX, 0.16); }
    if (thumbRef.current) { thumbRef.current.scale.y = THREE.MathUtils.lerp(thumbRef.current.scale.y, greeting ? 1.4 : throwing && leadArm ? 1.12 : showcasing && leadArm ? 1.16 : 1, 0.16); }
  });

  return (
    <group ref={armRef} position={[0.57 * direction, 0.08, 0]}>
      <mesh position={[0, 0.02, 0]}><boxGeometry args={[0.18, 0.18, 0.2]} /><meshStandardMaterial color="#1a1a1a" roughness={0.34} metalness={0.5} /></mesh>
      <mesh position={[0, -0.24, 0.01]}><boxGeometry args={[0.15, 0.34, 0.17]} /><meshStandardMaterial color="#1a1a1a" roughness={0.36} metalness={0.48} /></mesh>
      <mesh position={[0, -0.48, 0.03]}><boxGeometry args={[0.13, 0.22, 0.15]} /><meshStandardMaterial color="#141414" roughness={0.34} metalness={0.5} /></mesh>
      <group ref={handRef} position={[0, -0.68, 0.05]}>
        <mesh position={[0, -0.01, 0.02]}><boxGeometry args={[0.18, 0.16, 0.18]} /><meshStandardMaterial color="#111111" roughness={0.3} metalness={0.45} /></mesh>
        <mesh position={[0, 0, 0.12]}><boxGeometry args={[0.09, 0.04, 0.03]} /><meshStandardMaterial color={theme.light} emissive={theme.light} emissiveIntensity={0.55} roughness={0.12} metalness={0.22} /></mesh>
        <mesh position={[-0.04, -0.13, 0.1]}><boxGeometry args={[0.04, 0.13, 0.04]} /><meshStandardMaterial color="#1a1a1a" roughness={0.28} metalness={0.4} /></mesh>
        <mesh position={[0.04, -0.13, 0.1]}><boxGeometry args={[0.04, 0.13, 0.04]} /><meshStandardMaterial color="#1a1a1a" roughness={0.28} metalness={0.4} /></mesh>
        <mesh ref={thumbRef} position={[0.08 * direction, -0.03, 0.05]} rotation={[0, 0, direction * 0.55]}><boxGeometry args={[0.04, 0.12, 0.04]} /><meshStandardMaterial color="#1a1a1a" roughness={0.28} metalness={0.4} /></mesh>
      </group>
    </group>
  );
}

// ── Leg assembly ─────────────────────────────────────────────────────────────
function LegAssembly({ side, speaking, gesture, pointingSide }: {
  side: 'left' | 'right';
  speaking: boolean;
  gesture: BotGesture;
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
    const throwing = gesture === 'throw';
    const clapping = gesture === 'clap';
    const throwPulse = throwing ? Math.max(0, Math.sin(elapsed * 9.2)) : 0;
    const clapPulse = clapping ? (Math.sin(elapsed * 10.4) + 1) * 0.5 : 0;
    const stanceOffset = throwing ? targetDirection * (leadLeg ? 0.11 : -0.05) : clapping ? direction * 0.02 : speaking ? targetDirection * (leadLeg ? 0.07 : -0.02) : 0;
    const targetLegZ = throwing ? targetDirection * (leadLeg ? -0.22 : 0.14) : clapping ? -direction * (0.08 + clapPulse * 0.04) : speaking ? targetDirection * (leadLeg ? -0.16 : 0.08) : 0;
    const targetShinZ = throwing ? targetDirection * (leadLeg ? 0.2 : -0.08) : clapping ? direction * (0.08 + clapPulse * 0.06) : speaking ? targetDirection * (leadLeg ? 0.14 : -0.05) : 0;
    const targetFootZ = throwing ? targetDirection * (leadLeg ? -0.18 : 0.08) : clapping ? -direction * 0.06 : speaking ? targetDirection * (leadLeg ? -0.12 : 0.04) : 0;
    const footLift = throwing ? (leadLeg ? throwPulse * 0.018 : 0) : clapping ? clapPulse * 0.01 : speaking && leadLeg ? Math.sin(elapsed * 9.4) * 0.01 : 0;

    if (legRef.current) { legRef.current.position.x = THREE.MathUtils.lerp(legRef.current.position.x, baseX + stanceOffset, 0.14); legRef.current.rotation.z = THREE.MathUtils.lerp(legRef.current.rotation.z, targetLegZ, 0.14); }
    if (shinRef.current) { shinRef.current.rotation.z = THREE.MathUtils.lerp(shinRef.current.rotation.z, targetShinZ, 0.14); }
    if (footRef.current) { footRef.current.rotation.z = THREE.MathUtils.lerp(footRef.current.rotation.z, targetFootZ, 0.14); footRef.current.position.y = THREE.MathUtils.lerp(footRef.current.position.y, -0.56 + footLift, 0.14); footRef.current.position.x = THREE.MathUtils.lerp(footRef.current.position.x, throwing ? targetDirection * (leadLeg ? 0.06 : -0.03) : clapping ? -direction * 0.015 : speaking ? targetDirection * (leadLeg ? 0.03 : -0.01) : 0, 0.14); }
  });

  return (
    <group ref={legRef} position={[baseX, -0.66, 0]}>
      <mesh position={[0, 0, 0]}><boxGeometry args={[0.18, 0.42, 0.18]} /><meshStandardMaterial color="#1a1a1a" roughness={0.34} metalness={0.5} /></mesh>
      <mesh ref={shinRef} position={[0, -0.36, 0.02]}><boxGeometry args={[0.16, 0.34, 0.16]} /><meshStandardMaterial color="#1a1a1a" roughness={0.34} metalness={0.5} /></mesh>
      <mesh ref={footRef} position={[0, -0.56, 0.11]}><boxGeometry args={[0.24, 0.08, 0.34]} /><meshStandardMaterial color="#111111" roughness={0.32} metalness={0.45} /></mesh>
    </group>
  );
}

// ── Scene ─────────────────────────────────────────────────────────────────────
function WardenBotScene({ color, state: botState, gesture = 'none', offset = [0, 0, 0], pointingSide = 'right' }: WardenBotSceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const outerRef = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Group>(null);
  const leftEyeRef = useRef<THREE.Mesh>(null);
  const rightEyeRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const [hovered, setHovered] = useState(false);
  const theme = orbThemes[color];
  const speaking = botState === 'active';
  const greeting = gesture === 'greeting';
  const bowing = gesture === 'bow';
  const presenting = gesture === 'present';
  const analyzing = gesture === 'analyze';
  const showcasing = gesture === 'showcase';
  const throwing = gesture === 'throw';
  const clapping = gesture === 'clap';

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    const pulse = (Math.sin(elapsed * 2.4) + 1) * 0.5;
    const thinking = botState === 'thinking' || (!botState && Math.sin(elapsed * 0.6) > 0.7);
    const aware = hovered || botState === 'active' || botState === 'thinking' || greeting || bowing || presenting || analyzing || showcasing || throwing || clapping;
    const motionSpeed = botState === 'active' ? 1.15 : botState === 'thinking' ? 0.9 : 1;
    const targetDirection = pointingSide === 'right' ? 1 : -1;
    const throwPulse = throwing ? Math.max(0, Math.sin(elapsed * 9.2)) : 0;
    const clapPulse = clapping ? (Math.sin(elapsed * 10.4) + 1) * 0.5 : 0;
    const jumpCycle = bowing ? 0 : Math.max(0, Math.sin(elapsed * (2.1 * motionSpeed)));
    const bowLean = bowing ? 0.38 : 0; const bowDrop = bowing ? -0.14 : 0; const bowReach = bowing ? 0.08 : 0;
    const baseJumpHeight = Math.pow(jumpCycle, 1.55) * 0.34;
    const hoverBias = presenting ? 0.06 : showcasing ? 0.08 : throwing ? 0.04 : 0;
    const analyzeSweep = analyzing ? Math.sin(elapsed * 1.8) * 0.04 : 0;
    const jumpHeight = bowing ? bowDrop : baseJumpHeight + hoverBias + throwPulse * 0.05 + clapPulse * 0.06;

    const targetGroupYRotation = analyzing ? analyzeSweep : throwing ? targetDirection * 0.08 : 0;
    const targetGroupXRotation = bowLean + (throwing ? -0.06 : 0) + (clapping ? -0.04 : 0);
    const targetHeadYRotation = clapping ? 0 : throwing ? targetDirection * 0.34 : showcasing ? targetDirection * 0.26 : presenting ? targetDirection * 0.1 : analyzing ? analyzeSweep * 1.8 : speaking ? targetDirection * 0.2 : 0;
    const targetHeadXRotation = greeting ? -0.09 : clapping ? -0.08 - clapPulse * 0.03 : throwing ? -0.12 - throwPulse * 0.03 : presenting ? -0.03 : analyzing ? -0.04 : speaking ? -0.06 : 0;
    const targetHeadZRotation = greeting ? targetDirection * -0.1 : clapping ? 0 : throwing ? targetDirection * -0.14 : showcasing ? targetDirection * -0.1 : presenting ? targetDirection * -0.04 : analyzing ? Math.sin(elapsed * 1.4) * 0.04 : speaking ? targetDirection * -0.07 : 0;
    const targetCoreX = greeting ? 0 : clapping ? 0 : throwing ? targetDirection * 0.12 : showcasing ? targetDirection * 0.07 : analyzing ? Math.sin(elapsed * 1.9) * 0.05 : speaking ? targetDirection * 0.05 : 0;
    const targetCoreY = greeting ? 0.1 : clapping ? 0.1 + clapPulse * 0.015 : throwing ? 0.12 + throwPulse * 0.02 : presenting ? 0.09 : speaking ? 0.1 : 0.08;

    if (groupRef.current) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetGroupYRotation, 0.08);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetGroupXRotation, 0.08);
      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, offset[0] + Math.sin(elapsed * 3) * 0.002, 0.08);
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, offset[1] + jumpHeight, 0.12);
      groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, offset[2] + bowReach + (throwing ? 0.05 : 0) + Math.cos(elapsed * 2.5) * 0.002, 0.08);
      groupRef.current.scale.setScalar(THREE.MathUtils.lerp(groupRef.current.scale.x, hovered ? 1.08 : aware ? 1.03 : 1, 0.08));
    }
    if (outerRef.current) { outerRef.current.rotation.y = THREE.MathUtils.lerp(outerRef.current.rotation.y, targetHeadYRotation, 0.08); outerRef.current.rotation.x = THREE.MathUtils.lerp(outerRef.current.rotation.x, targetHeadXRotation, 0.08); outerRef.current.rotation.z = THREE.MathUtils.lerp(outerRef.current.rotation.z, targetHeadZRotation, 0.05); }
    if (coreRef.current) { coreRef.current.position.x = THREE.MathUtils.lerp(coreRef.current.position.x, targetCoreX, 0.1); coreRef.current.position.y = THREE.MathUtils.lerp(coreRef.current.position.y, targetCoreY, 0.1); }

    const baseGlow = hovered ? 4.4 : 2.8;
    for (const eye of [leftEyeRef.current, rightEyeRef.current]) {
      if (eye?.material instanceof THREE.MeshStandardMaterial) {
        eye.material.emissiveIntensity = THREE.MathUtils.lerp(eye.material.emissiveIntensity, baseGlow + pulse * 0.8 + (thinking ? 1.2 : 0), 0.08);
      }
    }

    const winkEyeRef = pointingSide === 'right' ? rightEyeRef.current : leftEyeRef.current;
    const openEyeRef = pointingSide === 'right' ? leftEyeRef.current : rightEyeRef.current;
    if (winkEyeRef) { winkEyeRef.scale.y = THREE.MathUtils.lerp(winkEyeRef.scale.y, greeting ? 0.16 : 1, 0.18); winkEyeRef.position.y = THREE.MathUtils.lerp(winkEyeRef.position.y, greeting ? 0.02 : 0, 0.18); }
    if (openEyeRef) { openEyeRef.scale.y = THREE.MathUtils.lerp(openEyeRef.scale.y, 1, 0.18); openEyeRef.position.y = THREE.MathUtils.lerp(openEyeRef.position.y, 0, 0.18); }

    if (lightRef.current && coreRef.current) {
      lightRef.current.intensity = THREE.MathUtils.lerp(lightRef.current.intensity, (aware ? 5 : 3.6) + pulse * 0.75 + (thinking ? 0.35 : 0), 0.08);
      lightRef.current.position.x = THREE.MathUtils.lerp(lightRef.current.position.x, coreRef.current.position.x, 0.12);
      lightRef.current.position.y = THREE.MathUtils.lerp(lightRef.current.position.y, coreRef.current.position.y + 0.5, 0.12);
      lightRef.current.position.z = THREE.MathUtils.lerp(lightRef.current.position.z, coreRef.current.position.z + 0.42, 0.12);
    }
  });

  return (
    <>
      <ambientLight intensity={0.5} color="#1a1206" />
      <group ref={groupRef} position={offset} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>

        {/* Head */}
        <mesh ref={outerRef} position={[0, 0.48, 0]}>
          <boxGeometry args={[1.44, 1.08, 0.92]} />
          {/* Darker, near-black chassis with slight warm tint */}
          <meshStandardMaterial color="#111008" roughness={0.28} metalness={0.55} emissive="#0a0802" emissiveIntensity={0.4} />

          {/* Eyes */}
          <group ref={coreRef} position={[0, 0.08, 0.49]}>
            <mesh ref={leftEyeRef} position={[-0.23, 0, 0]}>
              <boxGeometry args={[0.22, 0.18, 0.06]} />
              <meshStandardMaterial color={theme.core} emissive={theme.emissive} emissiveIntensity={2.8} roughness={0.14} metalness={0.18} />
            </mesh>
            <mesh ref={rightEyeRef} position={[0.23, 0, 0]}>
              <boxGeometry args={[0.22, 0.18, 0.06]} />
              <meshStandardMaterial color={theme.core} emissive={theme.emissive} emissiveIntensity={2.8} roughness={0.14} metalness={0.18} />
            </mesh>
            <mesh position={[0, 0, 0.005]}>
              <boxGeometry args={[0.14, 0.045, 0.04]} />
              <meshStandardMaterial color={theme.light} emissive={theme.light} emissiveIntensity={0.8} roughness={0.1} metalness={0.2} />
            </mesh>
          </group>

          <pointLight ref={lightRef} position={[0, 0.56, 0.91]} intensity={3.6} distance={6} color={theme.light} />
          <MouthBar theme={theme} speaking={speaking} />
          <SpeechRing color={theme.light} delay={0} speaking={speaking} />
          <SpeechRing color={theme.light} delay={0.33} speaking={speaking} />
          <SpeechRing color={theme.light} delay={0.66} speaking={speaking} />
        </mesh>

        {/* Neck */}
        <mesh position={[0, -0.03, 0]}>
          <cylinderGeometry args={[0.12, 0.15, 0.32, 12]} />
          <meshStandardMaterial color="#111008" roughness={0.3} metalness={0.52} />
        </mesh>

        {/* Body */}
        <group position={[0, -0.56, 0]}>
          <mesh position={[0, 0.12, 0]}><boxGeometry args={[0.98, 0.78, 0.58]} /><meshStandardMaterial color="#141208" roughness={0.32} metalness={0.5} /></mesh>
          <mesh position={[0, 0.43, 0]}><boxGeometry args={[1.18, 0.12, 0.26]} /><meshStandardMaterial color="#1a1710" roughness={0.28} metalness={0.52} /></mesh>
          <mesh position={[0, -0.34, 0]}><boxGeometry args={[0.76, 0.18, 0.42]} /><meshStandardMaterial color="#1a1710" roughness={0.3} metalness={0.5} /></mesh>
          <ArmAssembly side="left" theme={theme} speaking={speaking} gesture={gesture} pointingSide={pointingSide} />
          <ArmAssembly side="right" theme={theme} speaking={speaking} gesture={gesture} pointingSide={pointingSide} />
          <LegAssembly side="left" speaking={speaking} gesture={gesture} pointingSide={pointingSide} />
          <LegAssembly side="right" speaking={speaking} gesture={gesture} pointingSide={pointingSide} />
        </group>

        {/* Neck ring — amber tint */}
        <mesh position={[0, -0.06, -0.08]} rotation={[Math.PI / 2.8, 0, 0]}>
          <torusGeometry args={[0.92, 0.025, 10, 48]} />
          <meshStandardMaterial color={theme.light} emissive={theme.light} emissiveIntensity={0.6} transparent opacity={0.28} roughness={0.14} metalness={0.2} />
        </mesh>

        <Sparkles count={6} scale={[1.9, 1.7, 1.4]} size={1.4} speed={0.18} opacity={hovered ? 0.5 : 0.28} color={theme.sparkles} noise={0.55} />
      </group>
    </>
  );
}

// ── Public component ──────────────────────────────────────────────────────────
export default function WardenBot({ color = 'blue', className, state, gesture = 'none', fullBleed = false, fullBleedOffsetX, side = 'right' }: WardenBotProps) {
  const theme = orbThemes[color];
  const xOffset = fullBleedOffsetX ?? (side === 'left' ? -1.6 : 1.6);
  const pointingSide = side === 'left' ? 'right' : 'left';

  if (fullBleed) {
    return (
      <div className={cn('pointer-events-none', className)}>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: side === 'left'
              ? `radial-gradient(ellipse 60% 70% at 28% 52%, ${theme.shellGlow}, transparent 60%)`
              : `radial-gradient(ellipse 60% 70% at 72% 52%, ${theme.shellGlow}, transparent 60%)`,
          }}
        />
        <Canvas className="!h-full !w-full" dpr={[1, 1.5]} camera={{ position: [0, 0, 5.8], fov: 42 }} gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }} style={{ background: 'transparent' }}>
          <Suspense fallback={null}>
            <WardenBotScene color={color} state={state} gesture={gesture} offset={[xOffset, 0, 0]} pointingSide={pointingSide} />
          </Suspense>
        </Canvas>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'relative h-[340px] w-full overflow-hidden border border-white/[0.06] bg-[#0e0e0e] shadow-[0_32px_120px_rgba(0,0,0,0.85)] sm:h-[420px] lg:h-[520px]',
        className
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-80"
        style={{ backgroundImage: `radial-gradient(circle at top, ${theme.shellGlow}, transparent 46%), radial-gradient(circle at bottom, rgba(255,255,255,0.03), transparent 58%)` }}
      />
      <div className="pointer-events-none absolute inset-10 rounded-full blur-3xl" style={{ background: theme.aura }} />

      <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 4.6], fov: 36 }} gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}>
        <color attach="background" args={['#0e0e0e']} />
        <fog attach="fog" args={['#0e0e0e', 3, 7]} />
        <Suspense fallback={<Html center><div className="h-16 w-16 animate-pulse border border-white/10 bg-white/[0.03]" /></Html>}>
          <WardenBotScene color={color} state={state} gesture={gesture} pointingSide="right" />
        </Suspense>
      </Canvas>
    </div>
  );
}