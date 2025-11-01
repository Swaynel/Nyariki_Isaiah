'use client';

import { personalInfo } from '@/config/site';

export default function Hero() {
  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("/images/izzy.jpg")'
        }}
      />
      <div className="absolute inset-0 bg-black/60" />
      
      <div className="container-custom px-4 sm:px-6 lg:px-8 text-center relative z-10 animate-fade-in-up">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold font-heading mb-6">
          Hi, I'm <span className="text-primary">Isaiah Nyariki</span>
        </h1>
        <h2 className="text-xl sm:text-2xl lg:text-3xl mb-8 opacity-90 font-light">
          Backend Engineer & System Architect
        </h2>
        <p className="text-lg sm:text-xl mb-12 max-w-2xl mx-auto opacity-80 leading-relaxed">
          Specializing in building robust backend systems and scalable applications. 
        </p>
        <button
          onClick={scrollToContact}
          className="bg-primary text-primary-foreground px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary/90 transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          Get in Touch
        </button>
      </div>
    </section>
  );
}