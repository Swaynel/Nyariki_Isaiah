import { personalInfo } from '@/src/config/site';

export default function About() {
  return (
    <section id="about" className="section-padding">
      <div className="container-custom">
        <h2 className="text-3xl sm:text-4xl font-bold font-heading mb-8 relative inline-block">
          About Me
          <span className="absolute bottom-0 left-0 w-12 h-1 bg-primary mt-2" />
        </h2>
        <p className="text-lg leading-relaxed max-w-3xl opacity-90">
          {personalInfo.bio}
        </p>
      </div>
    </section>
  );
}