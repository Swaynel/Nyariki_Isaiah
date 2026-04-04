'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { StageBotBehavior } from '@/components/sayan/types';

type SkillsPhase = 'idle' | 'throwing' | 'orbiting' | 'clapping' | 'done';

const THROW_BATCH_SIZE = 2;
const INITIAL_THROW_DELAY_MS = 220;
const THROW_STEP_DELAY_MS = 190;
const ORBIT_START_DELAY_MS = 260;
const CLAP_START_DELAY_MS = 900;
const CLAP_DURATION_MS = 1000;

function getBotBehaviorForPhase(phase: SkillsPhase): StageBotBehavior {
  switch (phase) {
    case 'throwing':
      return { state: 'active', gesture: 'throw' };
    case 'orbiting':
      return { state: 'thinking', gesture: 'analyze' };
    case 'clapping':
      return { state: 'idle', gesture: 'clap' };
    case 'done':
      return { state: 'idle', gesture: 'present' };
    default:
      return { state: 'thinking', gesture: 'analyze' };
  }
}

export function useSkillsOrbitSequence(
  skills: string[],
  onBotChange?: (behavior: StageBotBehavior) => void
) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isInView, setIsInView] = useState(false);
  const [phase, setPhase] = useState<SkillsPhase>('idle');
  const [visibleCount, setVisibleCount] = useState(0);
  const hasStartedRef = useRef(false);

  const layout = useMemo(() => {
    const total = Math.max(skills.length, 1);

    return skills.map((_, index) => {
      const pairIndex = Math.floor(index / THROW_BATCH_SIZE);
      const fromUpperHand = index % THROW_BATCH_SIZE === 0;
      const scatterColumn = index % 4;
      const scatterRow = Math.floor(index / 4);
      const scatterX = 18 + scatterColumn * 18 + (scatterRow % 2) * 4;
      const scatterY = 18 + scatterRow * 18 + (index % 2) * 4;
      const angle = (-Math.PI / 2) + (Math.PI * 2 * index) / total;
      const circleX = 50 + Math.cos(angle) * 32;
      const circleY = 50 + Math.sin(angle) * 32;

      return {
        launchX: 11 + Math.min(pairIndex, 4) * 1.8 + (fromUpperHand ? 0 : 2.4),
        launchY: fromUpperHand ? 36 : 58,
        scatterX,
        scatterY,
        circleX,
        circleY,
        rotation: (index % 2 === 0 ? -1 : 1) * (4 + (index % 3) * 3),
      };
    });
  }, [skills]);

  useEffect(() => {
    const element = sectionRef.current;
    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      {
        threshold: 0.45,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!isInView || hasStartedRef.current) {
      return;
    }

    hasStartedRef.current = true;
    setVisibleCount(0);
    setPhase('throwing');
  }, [isInView]);

  useEffect(() => {
    if (phase === 'idle') {
      return;
    }

    const behavior = getBotBehaviorForPhase(phase);
    onBotChange?.(behavior);
  }, [onBotChange, phase]);

  useEffect(() => {
    if (!hasStartedRef.current) {
      return;
    }

    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    if (phase === 'throwing') {
      if (visibleCount < skills.length) {
        timeoutId = setTimeout(
          () =>
            setVisibleCount((count) => Math.min(count + THROW_BATCH_SIZE, skills.length)),
          visibleCount === 0 ? INITIAL_THROW_DELAY_MS : THROW_STEP_DELAY_MS
        );
      } else {
        timeoutId = setTimeout(() => setPhase('orbiting'), ORBIT_START_DELAY_MS);
      }
    }

    if (phase === 'orbiting') {
      timeoutId = setTimeout(() => setPhase('clapping'), CLAP_START_DELAY_MS);
    }

    if (phase === 'clapping') {
      timeoutId = setTimeout(() => setPhase('done'), CLAP_DURATION_MS);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [phase, skills.length, visibleCount]);

  return {
    sectionRef,
    layout,
    phase,
    visibleCount,
    isOrbiting: phase === 'orbiting' || phase === 'clapping' || phase === 'done',
  };
}
