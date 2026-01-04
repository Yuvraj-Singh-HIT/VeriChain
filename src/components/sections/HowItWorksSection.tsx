import { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import { Factory, Truck, Store, ShoppingBag, CheckCircle } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    icon: Factory,
    title: 'Manufacture',
    description: 'Product is created and an NFT is minted on the blockchain with all metadata stored on IPFS.',
    status: 'Manufactured',
  },
  {
    icon: Truck,
    title: 'Distribute',
    description: 'Distributor receives product and updates the blockchain with transfer details and location.',
    status: 'In Transit',
  },
  {
    icon: Store,
    title: 'Retail',
    description: 'Retailer scans and verifies authenticity, then updates the chain for store arrival.',
    status: 'At Retailer',
  },
  {
    icon: ShoppingBag,
    title: 'Purchase',
    description: 'Customer scans QR code to verify complete product journey and authenticity.',
    status: 'Verified',
  },
];

const HowItWorksSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const stepsContainerRef = useRef<HTMLDivElement>(null);
  const blockchainRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Header animation on scroll
      gsap.from(headerRef.current, {
        y: 100,
        opacity: 0,
        duration: 1,
        scrollTrigger: {
          trigger: headerRef.current,
          start: 'top 80%',
          end: 'top 50%',
          toggleActions: 'play none none reverse',
        },
      });

      // Progress line animation
      gsap.to(progressRef.current, {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: stepsContainerRef.current,
          start: 'top center',
          end: 'bottom center',
          scrub: 1,
        },
      });

      // Steps stagger animation with scroll
      const stepElements = stepsContainerRef.current?.querySelectorAll('.step-card');
      if (stepElements) {
        stepElements.forEach((step, index) => {
          gsap.from(step, {
            y: 100,
            opacity: 0,
            scale: 0.8,
            rotation: index % 2 === 0 ? -5 : 5,
            duration: 0.8,
            scrollTrigger: {
              trigger: step,
              start: 'top 85%',
              end: 'top 60%',
              toggleActions: 'play none none reverse',
            },
          });

          // Icon animation
          const icon = step.querySelector('.step-icon');
          gsap.from(icon, {
            scale: 0,
            rotation: -180,
            duration: 0.6,
            delay: 0.3,
            ease: 'back.out(1.7)',
            scrollTrigger: {
              trigger: step,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          });
        });
      }

      // Blockchain blocks animation
      const blocks = blockchainRef.current?.querySelectorAll('.block-item');
      if (blocks) {
        gsap.from(blocks, {
          x: (i) => (i % 2 === 0 ? -100 : 100),
          opacity: 0,
          scale: 0.5,
          stagger: 0.15,
          duration: 0.8,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: blockchainRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        });

        // Connecting lines
        const connectors = blockchainRef.current?.querySelectorAll('.connector');
        gsap.from(connectors || [], {
          scaleX: 0,
          stagger: 0.2,
          duration: 0.4,
          delay: 0.6,
          scrollTrigger: {
            trigger: blockchainRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        });
      }

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-32 overflow-hidden bg-card/30">
      {/* Background */}
      <div className="absolute inset-0 grid-pattern opacity-20" />
      
      <div className="relative max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div ref={headerRef} className="text-center mb-20">
          <span className="inline-block px-4 py-1.5 rounded-full glass text-primary text-sm font-medium mb-4">
            How It Works
          </span>
          <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="text-foreground">From Factory to </span>
            <span className="text-gradient">Your Hands</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Every step of the supply chain is recorded on the blockchain, 
            creating an immutable trail of authenticity.
          </p>
        </div>

        {/* Timeline */}
        <div ref={stepsContainerRef} className="relative">
          {/* Progress Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-muted transform -translate-y-1/2 rounded-full overflow-hidden">
            <div 
              ref={progressRef}
              className="absolute inset-y-0 left-0 right-0 bg-gradient-to-r from-primary via-secondary to-primary origin-left scale-x-0"
            />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              
              return (
                <div key={step.title} className="step-card relative">
                  {/* Node */}
                  <div className="relative z-10 flex flex-col items-center">
                    {/* Step Number & Icon */}
                    <motion.div
                      className="step-icon relative"
                      whileHover={{ scale: 1.15, rotate: 10 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      {/* Outer glow ring */}
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-secondary blur-lg opacity-50" />
                      
                      {/* Pulse ring */}
                      <div className="absolute inset-0 rounded-full border-2 border-primary/50 animate-ping" style={{ animationDuration: '2s' }} />
                      
                      {/* Main circle */}
                      <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary p-0.5">
                        <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
                          <Icon className="w-8 h-8 text-primary" />
                        </div>
                      </div>
                      
                      {/* Step number */}
                      <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground font-heading font-bold text-sm shadow-lg">
                        {index + 1}
                      </div>
                    </motion.div>

                    {/* Content */}
                    <div className="mt-8 text-center">
                      <h3 className="font-heading font-semibold text-xl text-foreground mb-3">
                        {step.title}
                      </h3>
                      <p className="text-muted-foreground mb-4 max-w-xs mx-auto">
                        {step.description}
                      </p>
                      
                      {/* Status Badge */}
                      <motion.div 
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-sm"
                        whileHover={{ scale: 1.05 }}
                      >
                        <CheckCircle className="w-4 h-4 text-primary" />
                        <span className="text-primary font-medium">{step.status}</span>
                      </motion.div>
                    </div>
                  </div>

                  {/* Mobile connector */}
                  {index < steps.length - 1 && (
                    <div className="lg:hidden flex justify-center my-4">
                      <div className="w-0.5 h-8 bg-gradient-to-b from-primary to-secondary rounded-full" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Blockchain Visual */}
        <div ref={blockchainRef} className="mt-20">
          <div className="glass rounded-2xl p-8 border border-primary/20">
            <div className="flex flex-wrap items-center justify-center gap-4">
              {['Block #001', 'Block #002', 'Block #003', 'Block #004'].map((block, index) => (
                <div key={block} className="flex items-center gap-4">
                  <motion.div
                    className="block-item px-6 py-3 rounded-xl bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30"
                    whileHover={{ scale: 1.1, borderColor: 'hsl(175 85% 50% / 0.6)' }}
                  >
                    <span className="font-heading font-semibold text-primary">{block}</span>
                  </motion.div>
                  {index < 3 && (
                    <div className="connector hidden sm:block w-12 h-0.5 bg-gradient-to-r from-primary to-secondary rounded-full origin-left" />
                  )}
                </div>
              ))}
            </div>
            <p className="text-center text-muted-foreground mt-6 text-sm">
              Each transaction is cryptographically linked, creating an unbreakable chain of custody
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
