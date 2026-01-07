import { motion } from 'framer-motion'
import {
  Factory,
  Package,
  Plus,
  TrendingUp,
  BarChart3,
  Users,
  X
} from 'lucide-react'
import { useState } from 'react'
import QRScanner from './QRScanner'

interface DashboardProps {
  role: 'manufacturer' | 'distributor' | 'retailer' | 'msme' | 'investor'
  title: string
  stats: Array<{
    label: string
    value: string
    icon: typeof Factory
    change?: string   // ✅ OPTIONAL NOW
  }>
  children?: React.ReactNode
  tabContents?: Record<string, React.ReactNode>
  tabs?: string[]
}

const Dashboard = ({ role, title, stats, children, tabContents, tabs = ['overview', 'products', 'history', 'settings'] }: DashboardProps) => {
  const [activeTab, setActiveTab] = useState(tabs[0])
  const [showScanModal, setShowScanModal] = useState(false)

  const roleColors = {
    manufacturer: 'from-cyan-500 to-blue-500',
    distributor: 'from-purple-500 to-pink-500',
    retailer: 'from-green-500 to-teal-500',
    msme: 'from-orange-500 to-red-500',
    investor: 'from-yellow-500 to-orange-500',
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${roleColors[role]} animate-pulse`} />
                <span className="text-sm uppercase text-muted-foreground">
                  {role} Dashboard
                </span>
              </div>
              <h1 className="text-3xl font-bold">{title}</h1>
            </div>

            {role !== 'manufacturer' && (
              <button
                onClick={() => setShowScanModal(true)}
                className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Scan Product
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8 flex gap-2 glass p-1 rounded-xl w-fit">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm ${
                activeTab === tab ? 'bg-primary/10 text-primary' : 'text-muted-foreground'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon
            const isPositive = stat.change?.startsWith('+')

            return (
              <div
                key={stat.label}
                className="glass rounded-2xl p-6 border border-border"
              >
                <div className="flex justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${roleColors[role]} flex items-center justify-center`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>

                  {/* ✅ Only show change badge if present */}
                  {stat.change && (
                    <div
                      className={`text-xs px-2 py-1 rounded-full ${
                        isPositive ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                      }`}
                    >
                      <TrendingUp className={`w-3 h-3 inline ${!isPositive && 'rotate-180'}`} />
                      {stat.change}
                    </div>
                  )}
                </div>

                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            )
          })}
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 glass rounded-2xl p-6 border border-border">
            {tabContents?.[activeTab] || children}
          </div>


        </div>

        {/* Scan Product Modal */}
        {showScanModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-background rounded-2xl max-w-4xl w-full max-h-[95vh] flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-border flex-shrink-0">
                <h2 className="text-2xl font-bold">Scan Product QR Code</h2>
                <button
                  onClick={() => setShowScanModal(false)}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 flex-1 overflow-y-auto">
                <QRScanner mode="supply-chain" role={role} onClose={() => setShowScanModal(false)} />
              </div>
            </motion.div>
          </div>
        )}

      </div>
    </div>
  )
}

export default Dashboard
