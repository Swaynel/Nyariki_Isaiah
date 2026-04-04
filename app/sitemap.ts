import { personalInfo } from '@/config/site';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || personalInfo.blogUrl || 'https://isaiahnyariki.com';

export default function sitemap() {
  const lastModified = new Date().toISOString();

  return [
    {
      url: `${SITE_URL}/`,
      lastModified,
    },
    {
      url: `${SITE_URL}/projects`,
      lastModified,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified,
    },
  ];
}
