import { motion } from 'framer-motion';
import { Shield, Github, Twitter, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: 'Product',
      links: [
        { label: 'Features', href: '#features' },
        { label: 'How it Works', href: '#how-it-works' },
        { label: 'Pricing', href: '#pricing' },
        { label: 'API Docs', href: '#docs' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About Us', href: '#about' },
        { label: 'Careers', href: '#careers' },
        { label: 'Blog', href: '#blog' },
        { label: 'Contact', href: '#contact' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { label: 'Documentation', href: '#docs' },
        { label: 'Support', href: '#support' },
        { label: 'Partners', href: '#partners' },
        { label: 'Legal', href: '#legal' },
      ],
    },
  ];

  return (
    <footer className="relative border-t border-border bg-card/50">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <motion.div 
                className="relative w-10 h-10"
                whileHover={{ scale: 1.1, rotate: 180 }}
                transition={{ duration: 0.5 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-lg" />
                <div className="absolute inset-0.5 bg-background rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
              </motion.div>
              <span className="font-heading font-bold text-xl text-gradient">
                VeriChain
              </span>
            </Link>
            <p className="text-muted-foreground max-w-sm mb-6">
              Blockchain-powered supply chain verification. Authenticate products, 
              track provenance, and eliminate counterfeits with NFT technology.
            </p>
            <div className="flex items-center gap-4">
              {[Github, Twitter, Linkedin].map((Icon, index) => (
                <motion.a
                  key={index}
                  href="#"
                  className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h4 className="font-heading font-semibold text-foreground mb-4">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-muted-foreground hover:text-primary transition-colors text-sm"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm">
            © {currentYear} VeriChain. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-primary transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
