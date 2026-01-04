import { useEffect, useRef, useLayoutEffect } from 'react';
import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const useSmoothScroll = () => {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
    };
  }, []);

  return lenisRef;
};

export const useScrollAnimation = (
  ref: React.RefObject<HTMLElement>,
  animation: gsap.TweenVars,
  triggerOptions?: ScrollTrigger.Vars
) => {
  useLayoutEffect(() => {
    if (!ref.current) return;

    const ctx = gsap.context(() => {
      gsap.from(ref.current, {
        ...animation,
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse',
          ...triggerOptions,
        },
      });
    });

    return () => ctx.revert();
  }, [ref, animation, triggerOptions]);
};

export const useParallax = (
  ref: React.RefObject<HTMLElement>,
  speed: number = 0.5
) => {
  useLayoutEffect(() => {
    if (!ref.current) return;

    const ctx = gsap.context(() => {
      gsap.to(ref.current, {
        yPercent: -100 * speed,
        ease: 'none',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    });

    return () => ctx.revert();
  }, [ref, speed]);
};

export const usePinSection = (
  ref: React.RefObject<HTMLElement>,
  duration: number = 1
) => {
  useLayoutEffect(() => {
    if (!ref.current) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: ref.current,
        start: 'top top',
        end: `+=${window.innerHeight * duration}`,
        pin: true,
        pinSpacing: true,
      });
    });

    return () => ctx.revert();
  }, [ref, duration]);
};
