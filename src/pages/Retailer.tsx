import { useEffect, useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Dashboard from '../components/Dashboard';
import ProductTracker from '../components/ProductTracker';
import History from '../components/History';
import Settings from '../components/Settings';
import { Store, Package, ShoppingBag, Users } from 'lucide-react';
import { API_ENDPOINTS } from '../lib/api';

const Retailer = () => {
  const [statsData, setStatsData] = useState({
    in_stock: 0,
    sold_today: 47,
    store_locations: 8,
    customers: '1.2K',
    in_stock_change: '+5%',
    sold_today_change: '+23%',
    store_locations_change: '+1',
    customers_change: '+18%'
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch(API_ENDPOINTS.retailerStats);
      const data = await res.json();
      setStatsData(data);
    } catch (error) {
      console.error('Failed to fetch retailer stats', error);
    }
  };

  const stats = [
    { label: 'In Stock', value: statsData.in_stock.toString(), change: statsData.in_stock_change, icon: Package },
    { label: 'Sold Today', value: statsData.sold_today.toString(), change: statsData.sold_today_change, icon: ShoppingBag },
    { label: 'Store Locations', value: statsData.store_locations.toString(), change: statsData.store_locations_change, icon: Store },
    { label: 'Customers', value: statsData.customers, change: statsData.customers_change, icon: Users },
  ];

  // Define tab contents for the Dashboard component's built-in tabs
  const tabContents = {
    overview: (
      <div className="text-center py-8">
        <h3 className="text-xl font-semibold mb-4">Dashboard Overview</h3>
        <p className="text-muted-foreground">Welcome to your retailer dashboard. Use the tabs above to navigate between different sections.</p>
      </div>
    ),
    products: (
      <div className="space-y-6">
        <h3 className="text-xl font-semibold">Product Management</h3>
        <ProductTracker role="retailer" userName="Retail Store" />
      </div>
    ),
    history: <History />,
    settings: <Settings />
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Dashboard
        role="retailer"
        title="Welcome, Retailer"
        stats={stats}
        tabContents={tabContents}
      />
    </div>
  );
};

export default Retailer;
