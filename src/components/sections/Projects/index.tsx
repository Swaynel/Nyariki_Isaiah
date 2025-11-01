'use client';

import { useState } from 'react';
import { projects } from '@/src/config/site';
import { ProjectFilter as ProjectFilterType, Project } from '@/src/types';
import ProjectCard from './ProjectCard';
import ProjectFilterComponent from './ProjectFilter';


export default function Projects() {
  const [activeFilter, setActiveFilter] = useState<ProjectFilterType>('all');
  
  const allTags = Array.from(new Set(projects.flatMap((project: Project) => project.tags))) as string[];
  const filteredProjects = activeFilter === 'all' 
    ? projects 
    : projects.filter((project: Project) => project.tags.includes(activeFilter));

  return (
    <section id="projects" className="section-padding bg-card">
      <div className="container-custom">
        <h2 className="text-3xl sm:text-4xl font-bold font-heading mb-12 text-center relative inline-block">
          Projects
          <span className="absolute bottom-0 left-0 w-12 h-1 bg-primary mt-2" />
        </h2>
        
        <ProjectFilterComponent 
          filters={['all', ...allTags]}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
          {filteredProjects.map((project: Project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}