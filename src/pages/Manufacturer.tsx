import Navbar from '../components/layout/Navbar';
import Dashboard from '../components/Dashboard';
import ProductCreator from '../components/ProductCreator';
import { Factory, Package, CheckCircle, TrendingUp } from 'lucide-react';

const Manufacturer = () => {
  const stats = [
    { label: 'Total Products', value: '1,234', change: '+12%', icon: Package },
    { label: 'NFTs Minted', value: '1,189', change: '+8%', icon: Factory },
    { label: 'Verified', value: '98.2%', change: '+2.1%', icon: CheckCircle },
    { label: 'Revenue', value: '₹1.18Cr', change: '+18%', icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Dashboard role="manufacturer" title="Welcome, Manufacturer" stats={stats}>
        <ProductCreator />
      </Dashboard>
    </div>
  );
};

export default Manufacturer;
