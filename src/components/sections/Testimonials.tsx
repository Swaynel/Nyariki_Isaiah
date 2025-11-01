import { testimonials } from '@/config/site';

export default function Testimonials() {
  return (
    <section id="testimonials" className="section-padding">
      <div className="container-custom">
        <h2 className="text-3xl sm:text-4xl font-bold font-heading mb-12 text-center relative inline-block">
          Testimonials
          <span className="absolute bottom-0 left-0 w-12 h-1 bg-primary mt-2" />
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial) => (
            <blockquote
              key={testimonial.id}
              className="bg-card border border-border rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <p className="text-lg italic mb-4">&ldquo;{testimonial.quote}&rdquo;</p>
              <cite className="text-primary font-semibold not-italic">
                - {testimonial.author}, {testimonial.role}
              </cite>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}