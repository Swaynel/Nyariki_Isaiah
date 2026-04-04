import { testimonials } from '@/config/site';

export default function Testimonials() {
  return (
    <section
      id="testimonials"
      className="section-padding relative overflow-hidden bg-[#0e0e0e]"
      style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
    >
      {/* Background texture */}
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

      {/* Accent glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-amber-500/10 blur-[120px] pointer-events-none" />

      <div className="container-custom relative z-10 max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="mb-20 flex items-end gap-6">
          <div>
            <p
              className="text-amber-500 text-xs tracking-[0.35em] uppercase mb-3"
              style={{ fontFamily: "'Georgia', serif", letterSpacing: "0.35em" }}
            >
              What people say
            </p>
            <h2
              className="text-white leading-none"
              style={{
                fontSize: "clamp(3rem, 8vw, 6rem)",
                fontFamily: "'Georgia', 'Times New Roman', serif",
                fontStyle: "italic",
                fontWeight: 400,
              }}
            >
              Testi&shy;monials
            </h2>
          </div>
          <div className="mb-4 hidden md:block flex-1 h-px bg-gradient-to-r from-amber-500/50 to-transparent" />
        </div>

        {/* Cards */}
        <div className="space-y-6">
          {testimonials.map((testimonial, i) => (
            <blockquote
              key={testimonial.id}
              className="group relative"
              style={{
                marginLeft: i % 2 === 1 ? "clamp(0px, 8vw, 80px)" : "0",
              }}
            >
              {/* Card */}
              <div
                className="relative border border-white/[0.07] rounded-sm p-8 md:p-10 overflow-hidden transition-all duration-500 group-hover:border-amber-500/30"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)",
                  backdropFilter: "blur(4px)",
                }}
              >
                {/* Hover fill */}
                <div className="absolute inset-0 bg-amber-500/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Left accent bar */}
                <div className="absolute left-0 top-8 bottom-8 w-[2px] bg-gradient-to-b from-amber-500/0 via-amber-500 to-amber-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Giant decorative quote */}
                <span
                  aria-hidden="true"
                  className="absolute -top-4 -left-2 text-[9rem] leading-none text-amber-500/10 select-none group-hover:text-amber-500/20 transition-colors duration-500"
                  style={{
                    fontFamily: "'Georgia', serif",
                    fontStyle: "italic",
                    lineHeight: 1,
                  }}
                >
                  &ldquo;
                </span>

                <div className="relative">
                  {/* Quote text */}
                  <p
                    className="text-white/80 text-lg md:text-xl leading-relaxed mb-8 group-hover:text-white/95 transition-colors duration-300"
                    style={{
                      fontFamily: "'Georgia', serif",
                      fontStyle: "italic",
                      fontWeight: 400,
                    }}
                  >
                    {testimonial.quote}
                  </p>

                  {/* Author */}
                  <cite className="not-italic flex items-center gap-4">
                    {/* Monogram avatar */}
                    <div
                      className="w-10 h-10 rounded-full border border-amber-500/40 flex items-center justify-center text-amber-500 text-sm flex-shrink-0 group-hover:border-amber-500 group-hover:bg-amber-500/10 transition-all duration-300"
                      style={{ fontFamily: "'Georgia', serif", fontStyle: "italic" }}
                      aria-hidden="true"
                    >
                      {testimonial.author.charAt(0)}
                    </div>
                    <div>
                      <p
                        className="text-white font-normal text-sm tracking-wide"
                        style={{ fontFamily: "'Georgia', serif" }}
                      >
                        {testimonial.author}
                      </p>
                      <p
                        className="text-amber-500/70 text-xs tracking-[0.15em] uppercase mt-0.5"
                        style={{ fontFamily: "system-ui, sans-serif" }}
                      >
                        {testimonial.role}
                      </p>
                    </div>

                    {/* Trailing line */}
                    <div className="hidden md:block flex-1 h-px bg-gradient-to-r from-white/10 to-transparent" />

                    {/* Issue number */}
                    <span
                      className="hidden md:block text-white/10 text-xs group-hover:text-white/20 transition-colors duration-300"
                      style={{ fontFamily: "system-ui, monospace" }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </cite>
                </div>
              </div>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}