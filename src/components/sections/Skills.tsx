import { skills } from '@/config/site';

export default function Skills() {
  return (
    <section id="skills" className="section-padding bg-card">
      <div className="container-custom">
        <h2 className="text-3xl sm:text-4xl font-bold font-heading mb-12 text-center relative inline-block">
          Skills
          <span className="absolute bottom-0 left-0 w-12 h-1 bg-primary mt-2" />
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {skills.map((skill, index) => (
            <div
              key={skill}
              className="bg-background border border-border rounded-lg p-4 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden"
            >
              <span className="font-medium relative z-10">{skill}</span>
              <div className="absolute top-0 left-0 w-full h-1 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}