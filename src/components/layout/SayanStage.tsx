'use client';

import { useEffect, useMemo, useState } from 'react';
import WardenBot from '@/components/WardenBot';
import type { BotGesture, BotState, HeroBotSnapshot, StageBotBehavior } from '@/components/sayan/types';
import { SECTION_BOT_BEHAVIOR, SECTION_STAGE_SIDE, type StageSectionId } from '@/components/sayan/sectionBehavior';

interface SectionMetric {
  height: number;
  top: number;
}

interface SayanStageProps {
  heroState: HeroBotSnapshot;
  sectionOverrides?: Partial<Record<Exclude<StageSectionId, 'hero'>, StageBotBehavior>>;
}

const STAGED_SECTIONS = Object.keys(SECTION_STAGE_SIDE) as StageSectionId[];
const STAGE_VISUAL_HEIGHT = 'clamp(30rem, 78svh, 52rem)';

export default function SayanStage({ heroState, sectionOverrides }: SayanStageProps) {
  const [activeSection, setActiveSection] = useState<StageSectionId | null>('hero');
  const [metrics, setMetrics] = useState<Partial<Record<StageSectionId, SectionMetric>>>({});

  useEffect(() => {
    let resizeObserver: ResizeObserver | undefined;

    const measureSections = () => {
      const main = document.getElementById('main-content');
      if (!main) {
        return;
      }

      const mainTop = main.getBoundingClientRect().top + window.scrollY;
      const nextMetrics: Partial<Record<StageSectionId, SectionMetric>> = {};

      for (const sectionId of STAGED_SECTIONS) {
        const element = document.getElementById(sectionId);
        if (!element) {
          continue;
        }

        const rect = element.getBoundingClientRect();
        nextMetrics[sectionId] = {
          height: rect.height,
          top: rect.top + window.scrollY - mainTop,
        };
      }

      setMetrics(nextMetrics);
    };

    measureSections();
    window.addEventListener('resize', measureSections);

    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        measureSections();
      });

      const main = document.getElementById('main-content');
      if (main) {
        resizeObserver.observe(main);
      }

      for (const sectionId of STAGED_SECTIONS) {
        const element = document.getElementById(sectionId);
        if (element) {
          resizeObserver.observe(element);
        }
      }
    }

    return () => {
      window.removeEventListener('resize', measureSections);
      resizeObserver?.disconnect();
    };
  }, []);

  useEffect(() => {
    if (Object.keys(metrics).length === 0) {
      return;
    }

    let frameId = 0;

    const updateActiveSection = () => {
      const main = document.getElementById('main-content');
      if (!main) {
        return;
      }

      const mainTop = main.getBoundingClientRect().top + window.scrollY;
      const anchor = window.scrollY + window.innerHeight * 0.52 - mainTop;
      let nextSection: StageSectionId | null = null;

      for (const sectionId of STAGED_SECTIONS) {
        const metric = metrics[sectionId];
        if (!metric) {
          continue;
        }

        if (anchor >= metric.top && anchor < metric.top + metric.height) {
          nextSection = sectionId;
          break;
        }
      }

      setActiveSection((current) => (current === nextSection ? current : nextSection));
    };

    const onScroll = () => {
      cancelAnimationFrame(frameId);
      frameId = window.requestAnimationFrame(updateActiveSection);
    };

    updateActiveSection();
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frameId);
    };
  }, [metrics]);

  const targetSection = useMemo<StageSectionId | null>(() => {
    if (activeSection === 'hero' && heroState.advanceToAbout) {
      return 'about';
    }

    return activeSection;
  }, [activeSection, heroState.advanceToAbout]);

  const targetMetric = targetSection ? metrics[targetSection] : undefined;
  const isVisible = Boolean(targetSection && targetMetric);
  const side = targetSection ? SECTION_STAGE_SIDE[targetSection] : 'left';
  const fullBleedOffsetX =
    targetSection === 'projects' && side === 'right' ? 2.15 : undefined;
  const activeSectionOverride =
    targetSection && targetSection !== 'hero' ? sectionOverrides?.[targetSection] : undefined;
  const botState: BotState =
    targetSection === 'hero'
      ? heroState.state
      : activeSectionOverride
        ? activeSectionOverride.state
        : targetSection
        ? SECTION_BOT_BEHAVIOR[targetSection].state
        : 'thinking';
  const botGesture: BotGesture =
    targetSection === 'hero'
      ? heroState.gesture
      : activeSectionOverride
        ? activeSectionOverride.gesture
        : targetSection
        ? SECTION_BOT_BEHAVIOR[targetSection].gesture
        : 'none';

  return (
    <div
      className="pointer-events-none absolute inset-x-0 top-0 z-[1] transition-[transform,height,opacity] duration-[1000ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
      style={{
        height: targetMetric ? `${targetMetric.height}px` : undefined,
        opacity: isVisible ? 1 : 0,
        transform: targetMetric ? `translate3d(0, ${targetMetric.top}px, 0)` : 'translate3d(0, 0, 0)',
      }}
    >
      {targetMetric ? (
        <div
          className="absolute inset-x-0 top-1/2 -translate-y-1/2"
          style={{
            height: STAGE_VISUAL_HEIGHT,
            maxHeight: '100%',
          }}
        >
          <WardenBot
            color="blue"
            state={botState}
            gesture={botGesture}
            side={side}
            fullBleedOffsetX={fullBleedOffsetX}
            fullBleed
            className="absolute inset-0 h-full w-full"
          />
        </div>
      ) : null}
    </div>
  );
}
