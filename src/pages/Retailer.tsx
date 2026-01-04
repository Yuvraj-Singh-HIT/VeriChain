import Navbar from '../components/layout/Navbar';
import Dashboard from '../components/Dashboard';
import { Store, Package, ShoppingBag, Users } from 'lucide-react';

const Retailer = () => {
  const stats = [
    { label: 'In Stock', value: '892', change: '+5%', icon: Package },
    { label: 'Sold Today', value: '47', change: '+23%', icon: ShoppingBag },
    { label: 'Store Locations', value: '8', change: '+1', icon: Store },
    { label: 'Customers', value: '1.2K', change: '+18%', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Dashboard role="retailer" title="Welcome, Retailer" stats={stats} />
    </div>
  );
};

export default Retailer;
