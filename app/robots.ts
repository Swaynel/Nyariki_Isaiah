import { personalInfo } from '@/config/site';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || personalInfo.blogUrl || 'https://isaiahnyariki.com';

export default function robots() {
  return `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\nHost: ${SITE_URL}\n`;
}
