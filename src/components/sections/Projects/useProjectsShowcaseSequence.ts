'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { Project } from '@/types';
import type { StageBotBehavior } from '@/components/sayan/types';

type ProjectsPhase = 'idle' | 'presenting' | 'complete';

const INITIAL_PRESENT_DELAY_MS = 260;
const PROJECT_STEP_DELAY_MS = 520;

function getBotBehaviorForPhase(phase: ProjectsPhase): StageBotBehavior {
  switch (phase) {
    case 'presenting':
      return { state: 'active', gesture: 'showcase' };
    case 'complete':
      return { state: 'idle', gesture: 'present' };
    default:
      return { state: 'thinking', gesture: 'none' };
  }
}

export function useProjectsShowcaseSequence(
  visibleProjects: Project[],
  onBotChange?: (behavior: StageBotBehavior) => void
) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isInView, setIsInView] = useState(false);
  const [phase, setPhase] = useState<ProjectsPhase>('idle');
  const [visibleCount, setVisibleCount] = useState(0);
  const [activeProjectIndex, setActiveProjectIndex] = useState(-1);
  const startedSequenceKeyRef = useRef<string | null>(null);
  const sequenceKey = useMemo(
    () => visibleProjects.map((project) => project.id).join('|'),
    [visibleProjects]
  );

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
        threshold: 0.42,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    startedSequenceKeyRef.current = null;
    setPhase('idle');
    setVisibleCount(0);
    setActiveProjectIndex(-1);
  }, [sequenceKey]);

  useEffect(() => {
    if (!isInView || visibleProjects.length === 0 || startedSequenceKeyRef.current === sequenceKey) {
      return;
    }

    startedSequenceKeyRef.current = sequenceKey;
    setPhase('presenting');
    setVisibleCount(0);
    setActiveProjectIndex(-1);
  }, [isInView, sequenceKey, visibleProjects.length]);

  useEffect(() => {
    if (!isInView || visibleProjects.length === 0) {
      return;
    }

    onBotChange?.(getBotBehaviorForPhase(phase));
  }, [isInView, onBotChange, phase, visibleProjects.length]);

  useEffect(() => {
    if (phase !== 'presenting') {
      return;
    }

    if (visibleCount >= visibleProjects.length) {
      setPhase('complete');
      setActiveProjectIndex(-1);
      return;
    }

    const timeoutId = setTimeout(() => {
      setVisibleCount((count) => Math.min(count + 1, visibleProjects.length));
      setActiveProjectIndex(visibleCount);
    }, visibleCount === 0 ? INITIAL_PRESENT_DELAY_MS : PROJECT_STEP_DELAY_MS);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [phase, visibleCount, visibleProjects.length]);

  return {
    sectionRef,
    phase,
    visibleCount,
    activeProjectIndex,
  };
}
