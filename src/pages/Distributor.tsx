import { useEffect, useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Dashboard from '../components/Dashboard';
import ProductTracker from '../components/ProductTracker';
import History from '../components/History';
import Settings from '../components/Settings';
import { Truck, Package, Clock, MapPin } from 'lucide-react';
import { API_ENDPOINTS } from '../lib/api';

const Distributor = () => {
  const [statsData, setStatsData] = useState({
    shipments: 0,
    products_handled: 0,
    avg_transit_time: '2.3 days',
    locations: 12,
    shipments_change: '+15%',
    products_handled_change: '+22%',
    avg_transit_time_change: '-8%',
    locations_change: '+2'
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch(API_ENDPOINTS.distributorStats);
      const data = await res.json();
      setStatsData(data);
    } catch (error) {
      console.error('Failed to fetch distributor stats', error);
    }
  };

  const stats = [
    { label: 'Shipments', value: statsData.shipments.toString(), change: statsData.shipments_change, icon: Truck },
    { label: 'Products Handled', value: statsData.products_handled.toString(), change: statsData.products_handled_change, icon: Package },
    { label: 'Avg Transit Time', value: statsData.avg_transit_time, change: statsData.avg_transit_time_change, icon: Clock },
    { label: 'Locations', value: statsData.locations.toString(), change: statsData.locations_change, icon: MapPin },
  ];

  // Define tab contents for the Dashboard component's built-in tabs
  const tabContents = {
    overview: (
      <div className="text-center py-8">
        <h3 className="text-xl font-semibold mb-4">Dashboard Overview</h3>
        <p className="text-muted-foreground">Welcome to your distributor dashboard. Use the tabs above to navigate between different sections.</p>
      </div>
    ),
    products: (
      <div className="space-y-6">
        <h3 className="text-xl font-semibold">Product Management</h3>
        <ProductTracker role="distributor" userName="Logistics Inc" />
      </div>
    ),
    history: <History />,
    settings: <Settings />
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Dashboard
        role="distributor"
        title="Welcome, Distributor"
        stats={stats}
        tabContents={tabContents}
      />
    </div>
  );
};

export default Distributor;
