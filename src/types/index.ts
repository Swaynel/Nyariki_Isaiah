export interface PersonalInfo {
  name: string;
  githubUsername: string;
  linkedinUrl: string;
  blogUrl?: string;
  email: string;
  bio?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  link: string;
  tags: string[];
  thumbnail?: string;
  featured?: boolean;
  githubUrl?: string;
  demoUrl?: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  avatar?: string;
  company?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ContactFormResponse {
  success: boolean;
  message: string;
  error?: string;
}

export interface ChatbotRequest {
  message: string;
  conversationHistory?: ChatMessage[];
}

export interface ChatbotResponse {
  message: string;
  success: boolean;
  error?: string;
}

export type Theme = 'light' | 'dark';
export type ProjectFilter = 'all' | string;

export interface NavLink {
  label: string;
  href: string;
  external?: boolean;
}

export interface SiteConfig {
  personalInfo: PersonalInfo;
  projects: Project[];
  skills: string[];
  testimonials: Testimonial[];
  navigation: NavLink[];
  socialLinks: {
    github: string;
    linkedin: string;
    blog?: string;
  };
}

export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  success: boolean;
  statusCode: number;
}

export interface ScrollProgress {
  progress: number;
  isScrolled: boolean;
}

export type FormErrors = Record<string, string>;

export interface FirebaseContact extends ContactFormData {
  timestamp: Date;
  status?: 'pending' | 'read' | 'responded';
}