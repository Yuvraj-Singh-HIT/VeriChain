import { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import { ArrowRight, Scan, Box, ChevronDown } from 'lucide-react';
import BlockchainScene from '../3d/BlockchainScene';
import { Link } from 'react-router-dom';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subheadingRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Initial animations
      if (headingRef.current) {
        const words = headingRef.current.querySelectorAll('.word');
        gsap.from(words, {
          y: 50,
          opacity: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out',
        });
      }

      // Subtitle animation
      if (subheadingRef.current) {
        gsap.from(subheadingRef.current, {
          y: 20,
          opacity: 0,
          duration: 0.6,
          delay: 0.2,
          ease: 'power2.out'
        });
      }

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const scrollToFeatures = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section ref={sectionRef} className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* 3D Blockchain Scene Animation - removed to prevent hanging */}
      {/* <BlockchainScene /> */}
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
       
      {/* Grid Pattern */}
      <div className="absolute inset-0 grid-pattern opacity-30" />
      
      {/* Simplified Floating Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-[10%] w-72 h-72 rounded-full bg-gradient-to-br from-primary/20 to-transparent blur-3xl" />
        <div className="absolute top-40 right-[15%] w-96 h-96 rounded-full bg-gradient-to-br from-secondary/20 to-transparent blur-3xl" />
        <div className="absolute bottom-20 left-[20%] w-80 h-80 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 blur-3xl" />
        <div className="absolute bottom-40 right-[10%] w-64 h-64 rounded-full bg-gradient-to-br from-secondary/15 to-transparent blur-3xl" />
      </div>

      {/* Simplified background element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 opacity-20 w-[80vw] h-[80vw] max-w-2xl max-h-2xl">
        <div className="relative w-full h-full">
          <div className="absolute inset-0 border-2 border-primary/20 rounded-full bg-gradient-to-br from-primary/5 to-transparent" />
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/30 mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            <span className="text-sm font-medium text-primary">
              Powered by Blockchain & NFTs
            </span>
          </motion.div>

          {/* Main Heading with split animation */}
          <h1 ref={headingRef} className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight overflow-hidden">
            <span className="word inline-block text-foreground">Verify</span>
            <br />
            <span className="word inline-block text-gradient-animated">Authenticity</span>
            <br />
            <span className="word inline-block text-foreground">Instantly</span>
          </h1>

          {/* Subtitle */}
          <p ref={subheadingRef} className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12">
            NFT-powered supply chain verification. Track every product from 
            manufacturer to consumer with immutable blockchain records.
          </p>

          {/* CTA Buttons */}
          <div ref={ctaRef} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link to="/customer">
              <motion.button
                className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-2xl font-heading font-semibold text-lg glow-primary"
                whileHover={{ scale: 1.05, boxShadow: '0 0 40px hsl(175 85% 50% / 0.5)' }}
                whileTap={{ scale: 0.95 }}
              >
                <Scan className="w-5 h-5" />
                Scan Product
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
            
            <Link to="/manufacturer">
              <motion.button
                className="group flex items-center gap-3 px-8 py-4 glass border border-primary/30 text-foreground rounded-2xl font-heading font-semibold text-lg hover:bg-primary/10 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Box className="w-5 h-5 text-primary" />
                Register Product
              </motion.button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { value: '10M+', label: 'Products Verified' },
              { value: '5K+', label: 'Manufacturers' },
              { value: '99.9%', label: 'Accuracy Rate' },
              { value: '150+', label: 'Countries' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                className="glass rounded-2xl p-6 text-center hover:glow-primary transition-all duration-500"
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <div className="font-heading text-3xl md:text-4xl font-bold text-gradient mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.button
          onClick={scrollToFeatures}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground hover:text-primary transition-colors"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown className="w-8 h-8" />
        </motion.button>
      </div>
    </section>
  );
};

export default HeroSection;
