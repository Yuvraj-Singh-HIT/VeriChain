import Navbar from '../components/layout/Navbar';
import Dashboard from '../components/Dashboard';
import { Truck, Package, Clock, MapPin } from 'lucide-react';

const Distributor = () => {
  const stats = [
    { label: 'Shipments', value: '456', change: '+15%', icon: Truck },
    { label: 'Products Handled', value: '2,341', change: '+22%', icon: Package },
    { label: 'Avg Transit Time', value: '2.3 days', change: '-8%', icon: Clock },
    { label: 'Locations', value: '12', change: '+2', icon: MapPin },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Dashboard role="distributor" title="Welcome, Distributor" stats={stats} />
    </div>
  );
};

export default Distributor;
