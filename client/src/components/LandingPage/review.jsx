import React from "react";

const testimonials = [
  {
    name: "Sofia Rodriguez",
    handle: "@sofiaml",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face",
    text: "Finally, an AI tool that actually understands context! The accuracy in natural language processing is impressive.",
  },
  {
    name: "Emma Thompson",
    handle: "@emmaai",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face",
    text: "Using this AI platform has transformed how we handle data analysis. The speed and accuracy are unprecedented.",
  },
  {
    name: "David Park",
    handle: "@davidtech",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
    text: "The API integration is flawless. We've reduced our development time by 60% since implementing this solution.",
  },
];

export default function TestimonialsMarquee() {
  return (
    <section className="relative w-full overflow-hidden bg-white py-28 text-black">
      {/* Heading */}
      <div className="mx-auto max-w-4xl px-4 text-center">
        <h2 className="text-4xl font-semibold md:text-5xl">
          Trusted by developers worldwide
        </h2>
        <p className="mt-6 text-lg text-gray-500">
          Join thousands of developers who are already building the future
          <br />
          with our AI platform
        </p>
      </div>

      {/* Marquee Container */}
      <div className="relative mt-20 flex overflow-hidden">
        <div className="group flex gap-6 animate-marquee-smooth hover:[animation-play-state:paused]">
          {[...Array(4)].map((_, i) =>
            testimonials.map((t, idx) => (
              <div
                key={`${i}-${idx}`}
                className="w-[320px] shrink-0 rounded-xl border border-black/5 bg-gradient-to-b from-black/5 to-black/0 p-6 backdrop-blur-md transition-all duration-300 hover:border-black/10"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold">{t.name}</p>
                    <p className="text-sm text-gray-500">{t.handle}</p>
                  </div>
                </div>
                <p className="mt-4 text-sm text-gray-600 leading-relaxed">{t.text}</p>
              </div>
            ))
          )}
        </div>

        {/* Improved Gradient Fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-1/4 bg-gradient-to-r from-white via-white/70 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-1/4 bg-gradient-to-l from-white via-white/70 to-transparent" />
      </div>

      {/* Optimized Keyframes */}
      <style>
        {`
          @keyframes marquee-smooth {
            0% {
              transform: translateX(0);
            }
            100% {
              /* Using percentage ensures it stays seamless regardless of item count */
              transform: translateX(-50%);
            }
          }

          .animate-marquee-smooth {
            display: flex;
            width: max-content;
            /* will-change tells the browser to use the GPU for smoother motion */
            will-change: transform;
            animation: marquee-smooth 40s linear infinite;
          }

          /* Improves performance on mobile devices */
          @media (prefers-reduced-motion: reduce) {
            .animate-marquee-smooth {
              animation-play-state: paused;
            }
          }
        `}
      </style>
    </section>
  );
}