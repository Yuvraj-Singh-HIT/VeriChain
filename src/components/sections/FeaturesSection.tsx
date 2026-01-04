import { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import { 
  Shield, 
  QrCode, 
  Link2, 
  Database, 
  Smartphone, 
  Globe,
  Lock,
  Zap
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: Shield,
    title: 'NFT Authentication',
    description: 'Each product gets a unique NFT token on the blockchain, creating an immutable record of authenticity.',
    color: 'from-cyan-500 to-blue-500',
  },
  {
    icon: QrCode,
    title: 'QR Code Scanning',
    description: 'Instant verification with a simple QR scan. Works on any smartphone, no app required.',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: Link2,
    title: 'Supply Chain Tracking',
    description: 'Track products from manufacturer to consumer with complete transparency at every step.',
    color: 'from-green-500 to-teal-500',
  },
  {
    icon: Database,
    title: 'IPFS Storage',
    description: 'Decentralized storage ensures product data is always available and tamper-proof.',
    color: 'from-orange-500 to-red-500',
  },
  {
    icon: Smartphone,
    title: 'Mobile First',
    description: 'Optimized for mobile devices, making verification quick and easy for consumers.',
    color: 'from-blue-500 to-indigo-500',
  },
  {
    icon: Globe,
    title: 'Global Network',
    description: 'Connect with manufacturers, distributors, and retailers worldwide on one platform.',
    color: 'from-pink-500 to-rose-500',
  },
  {
    icon: Lock,
    title: 'Tamper-Proof',
    description: 'Blockchain immutability ensures records cannot be altered or falsified.',
    color: 'from-teal-500 to-cyan-500',
  },
  {
    icon: Zap,
    title: 'Instant Verification',
    description: 'Real-time verification results with complete product history in seconds.',
    color: 'from-yellow-500 to-orange-500',
  },
];

const FeaturesSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Header reveal
      gsap.from(headerRef.current?.children || [], {
        y: 80,
        opacity: 0,
        stagger: 0.15,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: headerRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });

      // Cards stagger reveal with 3D rotation
      const cards = cardsRef.current?.querySelectorAll('.feature-card');
      if (cards) {
        cards.forEach((card, index) => {
          const direction = index % 2 === 0 ? -1 : 1;
          
          gsap.from(card, {
            x: direction * 100,
            y: 50,
            opacity: 0,
            rotateY: direction * 15,
            scale: 0.9,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          });

          // Icon spin on scroll
          const icon = card.querySelector('.feature-icon');
          gsap.from(icon, {
            scale: 0,
            rotation: -180,
            duration: 0.6,
            delay: 0.2,
            ease: 'back.out(1.7)',
            scrollTrigger: {
              trigger: card,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          });
        });
      }

      // Parallax effect on background particles
      gsap.to('.particle-bg', {
        backgroundPosition: '100% 100%',
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
    <section ref={sectionRef} id="features" className="relative py-32 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 particle-bg opacity-50" />
      
      <div className="relative max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div ref={headerRef} className="text-center mb-20">
          <span className="inline-block px-4 py-1.5 rounded-full glass text-primary text-sm font-medium mb-4">
            Features
          </span>
          <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="text-foreground">Powered by </span>
            <span className="text-gradient">Innovation</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Cutting-edge blockchain technology meets intuitive design to create 
            the ultimate supply chain verification platform.
          </p>
        </div>

        {/* Features Grid */}
        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            
            return (
              <motion.div
                key={feature.title}
                className="feature-card group perspective-1000"
                whileHover={{ y: -10, rotateY: 5 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <div className="relative h-full glass rounded-2xl p-6 transition-all duration-500 hover:bg-card/80 overflow-hidden border border-transparent hover:border-primary/30">
                  {/* Glow effect on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                  
                  {/* Animated border */}
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${feature.color} blur-sm`} style={{ transform: 'scale(1.02)' }} />
                  </div>
                  
                  {/* Icon */}
                  <div className={`feature-icon relative w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} p-0.5 mb-5`}>
                    <div className="w-full h-full rounded-xl bg-background flex items-center justify-center group-hover:bg-transparent transition-colors duration-300">
                      <Icon className="w-6 h-6 text-primary group-hover:text-white transition-colors duration-300" />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="relative font-heading font-semibold text-xl text-foreground mb-3 group-hover:text-gradient transition-all">
                    {feature.title}
                  </h3>
                  <p className="relative text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
