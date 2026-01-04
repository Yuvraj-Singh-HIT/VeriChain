import { motion } from 'framer-motion';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import QRScanner from '../components/QRScanner';
import ParticleField from '../components/3d/ParticleField';
import { Shield } from 'lucide-react';

const Customer = () => {
  return (
    <div className="min-h-screen bg-background">
      <ParticleField />
      <Navbar />
      <main className="pt-28 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/30 mb-6">
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Consumer Verification</span>
            </div>
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">
              <span className="text-foreground">Verify </span>
              <span className="text-gradient">Authenticity</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-xl mx-auto">
              Scan the QR code on your product to verify it's genuine and trace its complete journey.
            </p>
          </motion.div>
          <QRScanner />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Customer;
