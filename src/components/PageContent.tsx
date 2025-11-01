'use client';

import { useEffect } from 'react';
import Navigation from './layout/Navigation';
import Hero from './sections/Hero';
import About from './sections/About';
import Skills from './sections/Skills';
import Projects from './sections/Projects';
import Testimonials from './sections/Testimonials';
import Contact from './sections/Contact';
import Footer from './layout/Footer';
import ScrollProgress from './layout/ScrollProgress';
import ChatbotToggle from './chatbot/ChatbotToggle';
import ChatbotContainer from './chatbot/ChatbotContainer';
import { initEmailJS } from '@/lib/emailjs';

export default function PageContent() {
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