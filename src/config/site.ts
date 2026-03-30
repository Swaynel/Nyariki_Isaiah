import { SiteConfig } from '@/types';

export const siteConfig: SiteConfig = {
  personalInfo: {
    name: 'Isaiah Nyariki',
    githubUsername: 'swaynel',
    linkedinUrl: 'https://linkedin.com/in/isaiah-nyariki',
    blogUrl: 'https://isaiahnyariki.com',
    email: 'isaiahnyariki300@gmail.com',
    bio: 'Backend & Systems Engineer focused on building reliable, scalable APIs and data pipelines with Node.js and TypeScript. Experienced in distributed systems, observability, and performance optimization to deliver production-ready services.'
  },
  navigation: [
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Projects', href: '#projects' },
    { label: 'Testimonials', href: '#testimonials' },
    { label: 'Contact', href: '#contact' }
  ],
  socialLinks: {
    github: 'https://github.com/swaynel',
    linkedin: 'https://linkedin.com/in/isaiah-nyariki',
    blog: 'https://isaiahnyariki.com'
  },
  projects: [
    {
      id: 'kazisha-connect',
      title: 'E-Commerce Platform',
      description: 'A full-stack Job connect website built with vanilla javascript, Node.js, and uses fireStore as its database.',
      link: 'https://manualink-nx.vercel.app',
      demoUrl: 'https://manualink-nx.vercel.app',
      tags: ['TypeScript', 'Node.js', 'firestore'],
      featured: true
    },
    {
      id: 'collegia-rerun',
      title: 'Collegia Rerun',
      description: 'A live web experience deployed on Vercel.',
      link: 'https://collegia-rerun.vercel.app',
      demoUrl: 'https://collegia-rerun.vercel.app',
      tags: ['TypeScript', 'Vercel'],
      featured: true
    },
    {
      id: 'bunge-mkononi',
      title: 'Bunge Mkononi',
      description: 'A live web experience deployed on Vercel.',
      link: 'https://bunge-mkononi.vercel.app',
      demoUrl: 'https://bunge-mkononi.vercel.app',
      tags: ['TypeScript', 'Vercel']
    }
  ],
  skills: [
    'JavaScript',
    'TypeScript',
    'SQL',
    'HTML5',
    'CSS3',
    'Next.js',
    'Node.js',
    'Python',
    'Django',
    'Express',
    'MongoDB',
    'Git',
    'Webpack',
    'REST APIs',
    'Tailwind CSS'
  ],
  testimonials: [
    {
      id: '1',
      quote: 'Isaiah delivered an exceptional job platform with seamless functionality and great attention to detail.',
      author: 'Willy Ous',
      role: 'Client, Kazisha Connect'
    },
    {
      id: '2',
      quote: 'His JavaScript expertise brought our musician website to life with a dynamic, user-friendly designing.',
      author: 'Felix ngothi',
      role: 'Client, KidCrescent'
    }
  ]
};

// Export individual configs for easier imports
export const { personalInfo, projects, skills, testimonials } = siteConfig;
