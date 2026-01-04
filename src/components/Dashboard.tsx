import { motion } from 'framer-motion';
import { 
  Factory, 
  CheckCircle2, 
  Clock, 
  Package,
  Plus,
  TrendingUp,
  BarChart3,
  Users
} from 'lucide-react';
import { useState } from 'react';

interface DashboardProps {
  role: 'manufacturer' | 'distributor' | 'retailer';
  title: string;
  stats: Array<{
    label: string;
    value: string;
    change: string;
    icon: typeof Factory;
  }>;
  children?: React.ReactNode;
}

const Dashboard = ({ role, title, stats, children }: DashboardProps) => {
  const [activeTab, setActiveTab] = useState('overview');

  const roleColors = {
    manufacturer: 'from-cyan-500 to-blue-500',
    distributor: 'from-purple-500 to-pink-500',
    retailer: 'from-green-500 to-teal-500',
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'products', label: 'Products' },
    { id: 'history', label: 'History' },
    { id: 'settings', label: 'Settings' },
  ];

  return (
    <div className="min-h-screen pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${roleColors[role]} animate-pulse`} />
                <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  {role} Dashboard
                </span>
              </div>
              <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
                {title}
              </h1>
            </div>
            
            <motion.button
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-xl font-heading font-semibold glow-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus className="w-5 h-5" />
              {role === 'manufacturer' ? 'Create Product' : 'Scan Product'}
            </motion.button>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 p-1 glass rounded-xl w-fit">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-primary/10 rounded-lg border border-primary/30"
                    transition={{ type: "spring", duration: 0.5 }}
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const isPositive = stat.change.startsWith('+');
            
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                whileHover={{ scale: 1.02, y: -2 }}
                className="glass rounded-2xl p-6 border border-border hover:border-primary/30 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${roleColors[role]} p-0.5`}>
                    <div className="w-full h-full rounded-xl bg-background flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                    isPositive ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                  }`}>
                    <TrendingUp className={`w-3 h-3 ${!isPositive && 'rotate-180'}`} />
                    {stat.change}
                  </div>
                </div>
                <div className="font-heading text-3xl font-bold text-foreground mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Main Content Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Main Content */}
          <div className="lg:col-span-2 glass rounded-2xl p-6 border border-border">
            {children || (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
                  <Package className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-heading font-semibold text-xl mb-2">No Products Yet</h3>
                <p className="text-muted-foreground mb-6 max-w-sm">
                  {role === 'manufacturer' 
                    ? 'Create your first product to mint an NFT and generate a QR code.'
                    : 'Scan a product QR code to view and update its status.'
                  }
                </p>
                <motion.button
                  className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Plus className="w-4 h-4" />
                  Get Started
                </motion.button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="glass rounded-2xl p-6 border border-border">
              <h3 className="font-heading font-semibold text-lg mb-4">Quick Actions</h3>
              <div className="space-y-3">
                {[
                  { icon: Package, label: role === 'manufacturer' ? 'Create Product' : 'Scan QR Code' },
                  { icon: BarChart3, label: 'View Analytics' },
                  { icon: Users, label: 'Manage Team' },
                ].map((action) => (
                  <motion.button
                    key={action.label}
                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors text-left"
                    whileHover={{ x: 5 }}
                  >
                    <action.icon className="w-5 h-5 text-primary" />
                    <span className="text-sm font-medium">{action.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="glass rounded-2xl p-6 border border-border">
              <h3 className="font-heading font-semibold text-lg mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {[
                  { status: 'success', message: 'Product #1234 verified', time: '2 min ago' },
                  { status: 'pending', message: 'NFT minting in progress', time: '5 min ago' },
                  { status: 'success', message: 'Transfer completed', time: '12 min ago' },
                ].map((activity, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      activity.status === 'success' ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm text-foreground">{activity.message}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
