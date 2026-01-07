import { useEffect, useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import HeroSection from '../components/sections/HeroSection';
import FloatingCubes from '../components/3d/FloatingCubes';
import FeaturesSection from '../components/sections/FeaturesSection';
import HowItWorksSection from '../components/sections/HowItWorksSection';
import CTASection from '../components/sections/CTASection';
import AIChatbot from '../components/AIChatbot';

gsap.registerPlugin(ScrollTrigger);

const Index = () => {
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Disable smooth scrolling to prevent hanging
    // const lenis = new Lenis({
    //   duration: 1.2,
    //   easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    //   smoothWheel: true,
    //   wheelMultiplier: 0.8,
    //   touchMultiplier: 1.5,
    //   touchInertiaMultiplier: 20,
    // });

    // lenis.on('scroll', ScrollTrigger.update);

    // const raf = (time: number) => {
    //   lenis.raf(time);
    //   requestAnimationFrame(raf);
    // };
    // requestAnimationFrame(raf);

    // return () => {
    //   lenis.destroy();
    // };
  }, []);

  useLayoutEffect(() => {
    // Page load animation
    const ctx = gsap.context(() => {
      gsap.from(mainRef.current, {
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out',
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div ref={mainRef} className="relative min-h-screen bg-background overflow-x-hidden">
      {/* Floating Cubes Animation - removed to prevent hanging */}
      {/* <FloatingCubes /> */}
      
      {/* Simplified gradient background */}
      <div className="fixed inset-0 -z-20">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
      </div>
      
      {/* Animated grid pattern */}
      <div className="fixed inset-0 -z-10 grid-pattern opacity-20 pointer-events-none" />


      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <CTASection />
      </main>
      <Footer />
      <div className="fixed bottom-4 right-4 z-50">
        <AIChatbot />
      </div>
    </div>
  );
};

export default Index;
