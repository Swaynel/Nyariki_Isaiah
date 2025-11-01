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
      link: 'https://kazisha-connect.vercel.app',
      tags: ['VanillaJs', 'Node.js', 'firestore'],
      thumbnail: '/images/kazisha-preview.jpg',
      featured: true
    },
    {
      id: 'kidcrescent',
      title: 'Musician Website',
      description: 'Author of the kidCrescent website',
      link: 'https://kidcrescent.vercel.app/',
      tags: ['JavaScript', 'Local Storage'],
      thumbnail: '/images/kidcrescent-preview.jpg',
      featured: true
    },
    {
      id: 'weather-dashboard',
      title: 'Weather Dashboard',
      description: 'A weather forecasting app using a third-party API.',
      link: '#',
      tags: ['API Integration', 'CSS Grid'],
      thumbnail: '/images/weather-preview.jpg'
    },
    {
      id: 'grok-chatbot',
      title: 'Grok 3 AI Chatbot',
      description: 'A real-time chatbot integrated with xAI\'s Grok 3 API, showcasing API handling and UI interaction.',
      link: '#',
      tags: ['API Integration', 'JavaScript', 'xAI'],
      thumbnail: '/images/chatbot-preview.jpg'
    }
  ],
  skills: [
    'JavaScript',
    'TypeScript',
    'HTML5',
    'CSS3',
    'React',
    'Next.js',
    'Node.js',
    'Express',
    'MongoDB',
    'Firebase',
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