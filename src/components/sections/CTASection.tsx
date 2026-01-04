import { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import { ArrowRight, Scan } from 'lucide-react';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

const CTASection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const floatingBlocksRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Content reveal with scale
      gsap.from(contentRef.current, {
        scale: 0.8,
        opacity: 0,
        y: 100,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          toggleActions: 'play none none reverse',
        },
      });

      // Floating blocks continuous animation
      const blocks = floatingBlocksRef.current?.querySelectorAll('.floating-block');
      if (blocks) {
        blocks.forEach((block, i) => {
          gsap.to(block, {
            y: `random(-50, 50)`,
            x: `random(-30, 30)`,
            rotation: `random(-20, 20)`,
            duration: `random(4, 7)`,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
            delay: i * 0.5,
          });
        });
      }

      // Parallax on scroll
      gsap.to(floatingBlocksRef.current, {
        y: -100,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-32 overflow-hidden">
      {/* Floating Blocks Background */}
      <div ref={floatingBlocksRef} className="absolute inset-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="floating-block absolute"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
          >
            <div 
              className="w-16 h-16 md:w-24 md:h-24 rounded-xl border border-primary/20 bg-primary/5 backdrop-blur-sm"
              style={{
                transform: `rotate(${Math.random() * 360}deg)`,
              }}
            />
          </div>
        ))}
      </div>
      
      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-radial from-primary/10 via-transparent to-transparent pointer-events-none" />
      
      <div className="relative max-w-4xl mx-auto px-6">
        <div ref={contentRef} className="text-center">
          {/* Decorative elements */}
          <motion.div
            className="inline-block mb-8"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 5, repeat: Infinity }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary blur-2xl opacity-30 animate-pulse" />
              <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-secondary p-0.5 rotate-12">
                <div className="w-full h-full rounded-2xl bg-background flex items-center justify-center -rotate-12">
                  <Scan className="w-10 h-10 text-primary" />
                </div>
              </div>
            </div>
          </motion.div>

          <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="text-foreground">Ready to </span>
            <span className="text-gradient">Authenticate</span>
            <span className="text-foreground">?</span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
            Join thousands of manufacturers protecting their products and millions 
            of customers verifying authenticity every day.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/manufacturer">
              <motion.button
                className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-2xl font-heading font-semibold text-lg glow-primary"
                whileHover={{ scale: 1.05, boxShadow: '0 0 50px hsl(175 85% 50% / 0.5)' }}
                whileTap={{ scale: 0.95 }}
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </motion.button>
            </Link>
            
            <motion.button
              className="flex items-center gap-3 px-8 py-4 glass border border-primary/30 text-foreground rounded-2xl font-heading font-semibold text-lg hover:bg-primary/10 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Schedule Demo
            </motion.button>
          </div>

          {/* Trust badges */}
          <motion.div
            className="mt-16 flex flex-wrap items-center justify-center gap-8 text-muted-foreground"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm">No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm">Free forever for consumers</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm">Enterprise support available</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
