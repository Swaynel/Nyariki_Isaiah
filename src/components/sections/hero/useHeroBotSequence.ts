'use client';

import { useEffect, useState } from 'react';
import type { BotGesture, BotState, HeroBotSnapshot } from '@/components/sayan/types';

interface UseHeroBotSequenceOptions {
  heroIntro: string;
  heroSupport: string;
  heroMessage: string;
  onBotChange?: (snapshot: HeroBotSnapshot) => void;
}

interface HeroBotSequenceState {
  typedIntro: string;
  typedMessage: string;
  typedSupport: string;
  isTypingIntro: boolean;
  isTypingMessage: boolean;
  isTypingSupport: boolean;
}

const INTRO_INITIAL_DELAY_MS = 320;
const INTRO_SLOW_TYPE_MS = 90;
const INTRO_FAST_TYPE_MS = 55;
const MESSAGE_SLOW_TYPE_MS = 55;
const MESSAGE_FAST_TYPE_MS = 24;
const SUPPORT_SLOW_TYPE_MS = 52;
const SUPPORT_FAST_TYPE_MS = 24;
const MESSAGE_START_DELAY_MS = 120;
const SUPPORT_START_DELAY_MS = 180;
const GREETING_DURATION_MS = 820;
const BOW_START_DELAY_MS = 220;
const BOW_DURATION_MS = 920;
const ABOUT_SCROLL_DELAY_MS = 260;
const BOT_RESET_DELAY_MS = 1400;

export function useHeroBotSequence({
  heroIntro,
  heroSupport,
  heroMessage,
  onBotChange,
}: UseHeroBotSequenceOptions): HeroBotSequenceState {
  const [typedIntro, setTypedIntro] = useState('');
  const [typedMessage, setTypedMessage] = useState('');
  const [typedSupport, setTypedSupport] = useState('');
  const [isTypingIntro, setIsTypingIntro] = useState(true);
  const [isTypingMessage, setIsTypingMessage] = useState(false);
  const [isTypingSupport, setIsTypingSupport] = useState(false);
  const [isGreeting, setIsGreeting] = useState(false);
  const [isBowing, setIsBowing] = useState(false);
  const [hasMovedDown, setHasMovedDown] = useState(false);

  const isSpeaking =
    (isTypingIntro && typedIntro.length > 0) ||
    (isTypingMessage && typedMessage.length > 0) ||
    (isTypingSupport && typedSupport.length > 0);
  const botState: BotState = isSpeaking ? 'active' : isGreeting || isBowing ? 'idle' : 'thinking';
  const botGesture: BotGesture = isGreeting ? 'greeting' : isBowing ? 'bow' : 'none';

  useEffect(() => {
    const timeoutIds: ReturnType<typeof setTimeout>[] = [];
    let introIndex = 0;
    let messageIndex = 0;
    let supportIndex = 0;

    const schedule = (callback: () => void, delay: number) => {
      const timeoutId = setTimeout(callback, delay);
      timeoutIds.push(timeoutId);
      return timeoutId;
    };

    setTypedIntro('');
    setTypedMessage('');
    setTypedSupport('');
    setIsTypingIntro(true);
    setIsTypingMessage(false);
    setIsTypingSupport(false);
    setIsGreeting(false);
    setIsBowing(false);
    setHasMovedDown(false);

    const startBow = () => {
      setIsBowing(true);
      schedule(() => {
        setIsBowing(false);
        setHasMovedDown(true);
        schedule(() => {
          document.getElementById('about')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, ABOUT_SCROLL_DELAY_MS);
        schedule(() => {
          setHasMovedDown(false);
        }, BOT_RESET_DELAY_MS);
      }, BOW_DURATION_MS);
    };

    const typeSupport = () => {
      if (supportIndex <= heroSupport.length) {
        setTypedSupport(heroSupport.slice(0, supportIndex));
        supportIndex += 1;
        schedule(typeSupport, supportIndex < 8 ? SUPPORT_SLOW_TYPE_MS : SUPPORT_FAST_TYPE_MS);
        return;
      }

      setIsTypingSupport(false);
      schedule(startBow, BOW_START_DELAY_MS);
    };

    const typeMessage = () => {
      if (messageIndex <= heroMessage.length) {
        setTypedMessage(heroMessage.slice(0, messageIndex));
        messageIndex += 1;
        schedule(typeMessage, messageIndex < 8 ? MESSAGE_SLOW_TYPE_MS : MESSAGE_FAST_TYPE_MS);
        return;
      }

      setIsTypingMessage(false);
      setIsTypingSupport(true);
      schedule(typeSupport, SUPPORT_START_DELAY_MS);
    };

    const startMessage = () => {
      setIsGreeting(false);
      setIsTypingMessage(true);
      schedule(typeMessage, MESSAGE_START_DELAY_MS);
    };

    const typeIntro = () => {
      if (introIndex <= heroIntro.length) {
        setTypedIntro(heroIntro.slice(0, introIndex));
        introIndex += 1;
        schedule(typeIntro, introIndex < 5 ? INTRO_SLOW_TYPE_MS : INTRO_FAST_TYPE_MS);
        return;
      }

      setIsTypingIntro(false);
      setIsGreeting(true);
      schedule(startMessage, GREETING_DURATION_MS);
    };

    schedule(typeIntro, INTRO_INITIAL_DELAY_MS);

    return () => {
      timeoutIds.forEach(clearTimeout);
    };
  }, [heroIntro, heroMessage, heroSupport]);

  useEffect(() => {
    onBotChange?.({
      state: botState,
      gesture: botGesture,
      advanceToAbout: hasMovedDown,
    });
  }, [botGesture, botState, hasMovedDown, onBotChange]);

  return {
    typedIntro,
    typedMessage,
    typedSupport,
    isTypingIntro,
    isTypingMessage,
    isTypingSupport,
  };
}
