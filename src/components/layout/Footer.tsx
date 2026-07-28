import { personalInfo } from '@/config/site';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const socialLinks = [
    {
      label: 'GitHub',
      href: `https://github.com/${personalInfo.githubUsername}`,
    },
    {
      label: 'LinkedIn',
      href: personalInfo.linkedinUrl,
    },
    ...(personalInfo.blogUrl
      ? [
          {
            label: 'Blog',
            href: personalInfo.blogUrl,
          },
        ]
      : []),
  ];

  return (
    <footer
      className="relative overflow-hidden border-t border-white/[0.07] bg-[#0e0e0e]"
      style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
    >
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 39px,
            rgba(255,255,255,0.5) 39px,
            rgba(255,255,255,0.5) 40px
          )`,
        }}
      />

      <div className="absolute bottom-0 right-1/4 h-[220px] w-[420px] rounded-full bg-amber-500/8 blur-[120px] pointer-events-none" />

      <div className="container-custom relative z-10 px-6 py-10">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <p
              className="mb-3 text-xs uppercase tracking-[0.35em] text-amber-500"
              style={{ fontFamily: 'system-ui, sans-serif' }}
            >
              Closing note
            </p>
            <p className="text-xl leading-relaxed text-white/80" style={{ fontStyle: 'italic' }}>
              Built to stay clear, reliable, and easy to extend.
            </p>
            <p className="mt-4 text-sm text-white/35" style={{ fontFamily: 'system-ui, sans-serif' }}>
              © {currentYear} {personalInfo.name}. All rights reserved.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] uppercase tracking-[0.25em] text-white/35 transition-colors duration-300 hover:text-amber-400"
                style={{ fontFamily: 'system-ui, sans-serif' }}
                aria-label={link.label}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
