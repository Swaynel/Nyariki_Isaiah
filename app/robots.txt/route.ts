import { NextResponse } from 'next/server';
import { personalInfo } from '@/config/site';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || personalInfo.blogUrl || 'https://isaiahnyariki.com';

export async function GET() {
  const body = `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\nHost: ${SITE_URL}\n`;

  return new NextResponse(body, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
