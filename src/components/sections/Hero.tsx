'use client';

import { useEffect, useState } from 'react';
import { personalInfo } from '@/config/site';
import WardenBot from '@/components/WardenBot';

const HERO_INTRO = "I'm Sayan.";
const HERO_SUPPORT =
  "Right now I'm highlighting reliable APIs, scalable backend services, and disciplined system design shaped for production pressure.";
const INTRO_PREFIX = "I'm ";
const INTRO_NAME = 'Sayan';

export default function Hero() {
  const [typedIntro, setTypedIntro] = useState('');
  const [typedMessage, setTypedMessage] = useState('');
  const [typedSupport, setTypedSupport] = useState('');
  const [isTypingIntro, setIsTypingIntro] = useState(true);
  const [isTypingMessage, setIsTypingMessage] = useState(false);
  const [isTypingSupport, setIsTypingSupport] = useState(false);
  const [isGreeting, setIsGreeting] = useState(false);
  const [isBowing, setIsBowing] = useState(false);
  const heroMessage = `I speak for the systems behind ${personalInfo.name}'s work. I help you read the architecture faster, understand the engineering choices, and move through the portfolio with context instead of guesswork.`;
  const isSpeaking =
    (isTypingIntro && typedIntro.length > 0) ||
    (isTypingMessage && typedMessage.length > 0) ||
    (isTypingSupport && typedSupport.length > 0);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    let introIndex = 0;
    let messageIndex = 0;
    let supportIndex = 0;

    setTypedIntro('');
    setTypedMessage('');
    setTypedSupport('');
    setIsTypingIntro(true);
    setIsTypingMessage(false);
    setIsTypingSupport(false);
    setIsGreeting(false);
    setIsBowing(false);

    const startBow = () => {
      setIsBowing(true);
      timeoutId = setTimeout(() => setIsBowing(false), 920);
    };

    const typeSupport = () => {
      if (supportIndex <= HERO_SUPPORT.length) {
        setTypedSupport(HERO_SUPPORT.slice(0, supportIndex));
        supportIndex += 1;
        timeoutId = setTimeout(typeSupport, supportIndex < 8 ? 52 : 24);
        return;
      }

      setIsTypingSupport(false);
      timeoutId = setTimeout(startBow, 220);
    };

    const typeMessage = () => {
      if (messageIndex <= heroMessage.length) {
        setTypedMessage(heroMessage.slice(0, messageIndex));
        messageIndex += 1;
        timeoutId = setTimeout(typeMessage, messageIndex < 8 ? 55 : 24);
        return;
      }

      setIsTypingMessage(false);
      setIsTypingSupport(true);
      timeoutId = setTimeout(typeSupport, 180);
    };

    const startMessage = () => {
      setIsGreeting(false);
      setIsTypingMessage(true);
      timeoutId = setTimeout(typeMessage, 120);
    };

    const typeIntro = () => {
      if (introIndex <= HERO_INTRO.length) {
        setTypedIntro(HERO_INTRO.slice(0, introIndex));
        introIndex += 1;
        timeoutId = setTimeout(typeIntro, introIndex < 5 ? 90 : 55);
        return;
      }

      setIsTypingIntro(false);
      setIsGreeting(true);
      timeoutId = setTimeout(startMessage, 820);
    };

    timeoutId = setTimeout(typeIntro, 320);

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [heroMessage]);

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToProjects = () => {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
  };

  const introPrefix = typedIntro.slice(0, Math.min(typedIntro.length, INTRO_PREFIX.length));
  const introName =
    typedIntro.length > INTRO_PREFIX.length
      ? typedIntro.slice(
          INTRO_PREFIX.length,
          Math.min(typedIntro.length, INTRO_PREFIX.length + INTRO_NAME.length)
        )
      : '';
  const introSuffix =
    typedIntro.length > INTRO_PREFIX.length + INTRO_NAME.length
      ? typedIntro.slice(INTRO_PREFIX.length + INTRO_NAME.length)
      : '';

  return (
    <section id="hero" className="relative min-h-screen overflow-hidden bg-background">
      {/* Bot sits on the LEFT half */}
      <WardenBot
        color="blue"
        state={isSpeaking ? 'active' : isGreeting || isBowing ? 'idle' : 'thinking'}
        gesture={isGreeting ? 'greeting' : isBowing ? 'bow' : 'none'}
        side="left"
        fullBleed
        className="absolute inset-0 h-full min-h-screen w-full"
      />

      {/*
        Soft overlay: keep the LEFT open for the bot and brighten the RIGHT
        slightly so the speech bubble sits naturally on the page background.
      */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_34%,rgba(56,189,248,0.08),transparent_24%),radial-gradient(circle_at_84%_16%,rgba(56,189,248,0.06),transparent_28%),linear-gradient(90deg,rgba(248,250,252,0.02)_0%,rgba(248,250,252,0.12)_32%,rgba(226,232,240,0.42)_64%,rgba(226,232,240,0.62)_100%)] dark:bg-[radial-gradient(circle_at_24%_34%,rgba(56,189,248,0.12),transparent_24%),radial-gradient(circle_at_84%_16%,rgba(56,189,248,0.08),transparent_28%),linear-gradient(90deg,rgba(2,6,23,0.06)_0%,rgba(2,6,23,0.22)_32%,rgba(2,6,23,0.7)_64%,rgba(2,6,23,0.88)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(226,232,240,0.12))] dark:bg-[linear-gradient(180deg,rgba(2,6,23,0.08),rgba(2,6,23,0.38))]" />
      <div className="absolute inset-x-0 top-0 h-32 bg-[linear-gradient(180deg,rgba(255,255,255,0.3),transparent)] dark:bg-[linear-gradient(180deg,rgba(2,6,23,0.42),transparent)]" />

      {/*
        Text content pushed to the RIGHT — use ml-auto so it naturally sits
        in the right half regardless of viewport width.
      */}
      <div className="container-custom relative z-10 flex min-h-screen items-center justify-end px-4 py-24 sm:px-6 lg:px-8">
        <div className="w-full max-w-2xl animate-fade-in-up">
          <div className="mb-5 inline-flex items-center gap-3 rounded-full border border-border/70 bg-background/85 px-4 py-2 text-sm text-muted-foreground shadow-[0_12px_40px_rgba(15,23,42,0.12)] backdrop-blur-md dark:border-sky-300/15 dark:bg-slate-950/55 dark:text-slate-300 dark:shadow-[0_12px_40px_rgba(2,6,23,0.28)]">
            <span className="flex h-2.5 w-2.5 rounded-full bg-sky-300 shadow-[0_0_18px_rgba(125,211,252,0.85)]" />
            <span className="font-medium text-foreground dark:text-slate-100">Sayan is online</span>
            <span className="text-muted-foreground dark:text-slate-400">
              AI system persona for {personalInfo.name}
            </span>
          </div>

          <div className="relative rounded-[2rem] border border-border/80 bg-background/92 px-6 py-6 shadow-[0_24px_80px_rgba(15,23,42,0.14)] backdrop-blur-xl dark:border-sky-300/20 dark:bg-slate-950/76 dark:shadow-[0_24px_80px_rgba(2,6,23,0.58)] sm:px-8 sm:py-8">
            {/*
              Speech-bubble tail pointing LEFT toward the bot.
              Rotated so the corner points left-center of the card.
            */}
            <div className="pointer-events-none absolute -left-3 top-8 h-6 w-6 rotate-45 rounded-[0.35rem] border-l border-t border-border/80 bg-background/92 dark:border-sky-300/20 dark:bg-slate-950/76" />
            <div className="pointer-events-none absolute inset-0 rounded-[2rem] bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.1),transparent_26%)] dark:bg-[radial-gradient(circle_at_top_right,rgba(125,211,252,0.12),transparent_26%)]" />

            <div className="relative">
              <span className="inline-flex items-center gap-3 rounded-full border border-border/70 bg-background/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-sky-700 dark:border-white/10 dark:bg-white/5 dark:text-sky-200/90">
                <span className="h-2 w-2 rounded-full bg-sky-300" />
                Message From Sayan
              </span>

              <h1
                aria-live="polite"
                className="mt-6 min-h-[3.5rem] text-4xl font-bold font-heading leading-tight text-foreground dark:text-white sm:min-h-[4.25rem] sm:text-5xl lg:min-h-[4.75rem] lg:text-6xl"
              >
                {introPrefix}
                <span className="text-sky-600 dark:text-sky-300">{introName}</span>
                {introSuffix}
                {isTypingIntro ? (
                  <span
                    aria-hidden="true"
                    className="ml-1 inline-block h-[0.95em] w-[0.12em] animate-pulse align-[-0.12em] bg-sky-600 dark:bg-sky-300"
                  />
                ) : null}
              </h1>

              <p
                aria-live="polite"
                className="mt-5 min-h-[7.5rem] text-lg leading-relaxed text-foreground/85 dark:text-slate-200 sm:min-h-[6.25rem] sm:text-xl"
              >
                {typedMessage}
                {isTypingMessage ? (
                  <span
                    aria-hidden="true"
                    className="ml-1 inline-block h-[1.05em] w-[0.12em] animate-pulse align-[-0.16em] bg-sky-600 dark:bg-sky-300"
                  />
                ) : null}
              </p>

              <p
                aria-live="polite"
                className="mt-5 min-h-[4.5rem] max-w-xl text-base leading-relaxed text-muted-foreground dark:text-slate-300 sm:min-h-[4rem] sm:text-lg"
              >
                {typedSupport}
                {isTypingSupport ? (
                  <span
                    aria-hidden="true"
                    className="ml-1 inline-block h-[1.05em] w-[0.12em] animate-pulse align-[-0.16em] bg-sky-600 dark:bg-sky-300"
                  />
                ) : null}
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <span className="rounded-full border border-border/70 bg-background/70 px-4 py-2 text-sm text-muted-foreground dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                Node.js
              </span>
              <span className="rounded-full border border-border/70 bg-background/70 px-4 py-2 text-sm text-muted-foreground dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                TypeScript
              </span>
              <span className="rounded-full border border-border/70 bg-background/70 px-4 py-2 text-sm text-muted-foreground dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                Distributed Systems
              </span>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <button
                onClick={scrollToContact}
                className="rounded-full bg-sky-400 px-7 py-3 text-base font-semibold text-slate-950 transition-transform duration-300 hover:-translate-y-1 hover:bg-sky-300"
              >
                Talk to Isaiah
              </button>
              <button
                onClick={scrollToProjects}
                className="rounded-full border border-border/80 bg-background/70 px-7 py-3 text-base font-semibold text-foreground transition-transform duration-300 hover:-translate-y-1 hover:bg-accent hover:text-accent-foreground dark:border-white/15 dark:bg-white/5 dark:text-white dark:hover:bg-white/10 dark:hover:text-white"
              >
                Show Me the Work
              </button>
            </div>
          </div>

        
        </div>
      </div>
    </section>
  );
}
