'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

const INITIAL_WORD_DELAY_MS = 260;
const WORD_STEP_DELAY_MS = 120;
const LOOP_RESET_DELAY_MS = 900;

export function useAboutReading(text?: string) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isInView, setIsInView] = useState(false);
  const [activeWordIndex, setActiveWordIndex] = useState(-1);
  const safeText = text ?? '';
  const words = useMemo(() => safeText.split(/\s+/).filter(Boolean), [safeText]);

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
    if (!isInView || words.length === 0) {
      setActiveWordIndex(-1);
      return;
    }

    const isStarting = activeWordIndex === -1;
    const isAtEnd = activeWordIndex >= words.length - 1;
    const timeoutId = setTimeout(() => {
      setActiveWordIndex((current) => {
        if (current >= words.length - 1) {
          return 0;
        }

        return current + 1;
      });
    }, isStarting ? INITIAL_WORD_DELAY_MS : isAtEnd ? LOOP_RESET_DELAY_MS : WORD_STEP_DELAY_MS);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [activeWordIndex, isInView, words.length]);

  return {
    sectionRef,
    words,
    activeWordIndex,
    isReading: isInView && activeWordIndex >= 0,
  };
}
