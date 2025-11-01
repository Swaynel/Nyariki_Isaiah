'use client';

import { useEffect } from 'react';
import Navigation from '@/src/components/layout/Navigation';
import Hero from '@/src/components/sections/Hero';
import About from '@/src/components/sections/About';
import Skills from '@/src/components/sections/Skills';
import Projects from '@/src/components/sections/Projects';
import Testimonials from '@/src/components/sections/Testimonials';
import Contact from '@/src/components/sections/Contact';
import Footer from '@/src/components/layout/Footer';
import ScrollProgress from '@/src/components/layout/ScrollProgress';
import ChatbotToggle from '@/src/components/chatbot/ChatbotToggle';
import ChatbotContainer from '@/src/components/chatbot/ChatbotContainer';
import { initEmailJS } from '@/src/lib/emailjs';

export default function Home() {
  useEffect(() => {
    initEmailJS();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <ScrollProgress />
      <Navigation />
      <main id="main-content">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
      <ChatbotToggle />
      <ChatbotContainer />
    </div>
  );
}