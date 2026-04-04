'use client';

import { useCallback, useEffect, useState } from 'react';
import Navigation from './layout/Navigation';
import Hero from './sections/Hero';
import About from './sections/About';
import Skills from './sections/Skills';
import Projects from './sections/Projects';
import Testimonials from './sections/Testimonials';
import Contact from './sections/Contact';
import Footer from './layout/Footer';
import ScrollProgress from './layout/ScrollProgress';
import SayanStage from './layout/SayanStage';
import ChatbotToggle from './chatbot/ChatbotToggle';
import ChatbotContainer from './chatbot/ChatbotContainer';
import type { HeroBotSnapshot, StageBotBehavior } from './sayan/types';
import { initEmailJS } from '@/lib/emailjs';

export default function PageContent() {
  const [heroBotState, setHeroBotState] = useState<HeroBotSnapshot>({
    state: 'thinking',
    gesture: 'none',
    advanceToAbout: false,
  });
  const [sectionBotOverrides, setSectionBotOverrides] = useState<
    Partial<Record<'about' | 'skills' | 'projects', StageBotBehavior>>
  >({});

  useEffect(() => {
    initEmailJS();
  }, []);

  const handleHeroBotChange = useCallback((snapshot: HeroBotSnapshot) => {
    setHeroBotState((current) =>
      current.state === snapshot.state &&
      current.gesture === snapshot.gesture &&
      current.advanceToAbout === snapshot.advanceToAbout
        ? current
        : snapshot
    );
  }, []);

  const handleSkillsBotChange = useCallback((behavior: StageBotBehavior) => {
    setSectionBotOverrides((current) => {
      const existing = current.skills;

      if (
        existing &&
        existing.state === behavior.state &&
        existing.gesture === behavior.gesture
      ) {
        return current;
      }

      return {
        ...current,
        skills: behavior,
      };
    });
  }, []);

  const handleProjectsBotChange = useCallback((behavior: StageBotBehavior) => {
    setSectionBotOverrides((current) => {
      const existing = current.projects;

      if (
        existing &&
        existing.state === behavior.state &&
        existing.gesture === behavior.gesture
      ) {
        return current;
      }

      return {
        ...current,
        projects: behavior,
      };
    });
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <ScrollProgress />
      <Navigation />
      <main id="main-content" className="relative">
        <SayanStage heroState={heroBotState} sectionOverrides={sectionBotOverrides} />
        <Hero onBotChange={handleHeroBotChange} />
        <About />
        <Skills onBotChange={handleSkillsBotChange} />
        <Projects onBotChange={handleProjectsBotChange} />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
      <ChatbotToggle />
      <ChatbotContainer />
    </div>
  );
}
