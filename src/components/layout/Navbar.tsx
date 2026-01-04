import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { 
  Box, 
  Truck, 
  Store, 
  Scan, 
  Shield, 
  Menu,
  X,
  ChevronRight
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { path: '/', label: 'Home', icon: Shield },
  { path: '/manufacturer', label: 'Manufacturer', icon: Box },
  { path: '/distributor', label: 'Distributor', icon: Truck },
  { path: '/retailer', label: 'Retailer', icon: Store },
  { path: '/customer', label: 'Verify', icon: Scan },
];

const Navbar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
      >
        <div className="max-w-7xl mx-auto">
          <div className="glass-strong rounded-2xl px-6 py-3 flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
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

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                
                return (
                  <Link key={item.path} to={item.path}>
                    <motion.div
                      className={`relative px-4 py-2 rounded-xl flex items-center gap-2 transition-colors ${
                        isActive 
                          ? 'text-primary' 
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="navbar-active"
                          className="absolute inset-0 bg-primary/10 rounded-xl border border-primary/30"
                          transition={{ type: "spring", duration: 0.5 }}
                        />
                      )}
                      <Icon className="w-4 h-4 relative z-10" />
                      <span className="relative z-10 font-medium text-sm">
                        {item.label}
                      </span>
                    </motion.div>
                  </Link>
                );
              })}
            </div>

            {/* Auth Button */}
            <Link to="/login">
              <motion.button
                className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-xl font-heading font-semibold text-sm glow-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Sign In
              </motion.button>
            </Link>

            {/* Mobile Menu Button */}
            <motion.button
              className="md:hidden p-2 text-foreground"
              onClick={() => setIsOpen(!isOpen)}
              whileTap={{ scale: 0.9 }}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <motion.div
        initial={false}
        animate={isOpen ? { opacity: 1, x: 0 } : { opacity: 0, x: '100%' }}
        transition={{ duration: 0.3 }}
        className={`fixed inset-y-0 right-0 w-80 z-50 glass-strong border-l border-border p-6 md:hidden ${
          isOpen ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
      >
        <div className="flex flex-col gap-4 mt-20">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, x: 20 }}
                animate={isOpen ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 p-4 rounded-xl transition-colors ${
                    isActive
                      ? 'bg-primary/10 text-primary border border-primary/30'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </motion.div>
            );
          })}

          {/* Mobile Auth Button */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isOpen ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
            transition={{ delay: navItems.length * 0.1 }}
            className="mt-6 pt-6 border-t border-border"
          >
            <Link to="/login" onClick={() => setIsOpen(false)}>
              <motion.button
                className="w-full p-4 bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-xl font-heading font-semibold glow-primary"
                whileTap={{ scale: 0.98 }}
              >
                Sign In
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Backdrop */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
        />
      )}
    </>
  );
};

export default Navbar;
