import { useEffect, useState } from 'react'
import Navbar from '../components/layout/Navbar'
import Dashboard from '../components/Dashboard'
import InvoiceFunder from '../components/InvoiceFunder'
import { DollarSign, TrendingUp, PieChart, Wallet } from 'lucide-react'

interface InvestorStats {
  totalInvested: number
  activeInvestments: number
  returns: number
  balance: number
}

const Investor = () => {
  const [stats, setStats] = useState<InvestorStats>({
    totalInvested: 0,
    activeInvestments: 0,
    returns: 0,
    balance: 10, // default wallet balance
  })

  // 🔥 Fetch persisted stats on page refresh
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('http://localhost:8001/api/invoices_funded')
        const data = await res.json()

        setStats({
          totalInvested: data.total_ivested ?? 0,
          activeInvestments: data.active_investments ?? 0,
          returns: data.returns ?? 0,
          balance: data.available_balance ?? 10,
        })
      } catch (error) {
        console.error('Failed to fetch investor stats:', error)
      }
    }

    fetchStats()
  }, [])

  const dashboardStats = [
    {
      label: 'Total Invested',
      value: `${stats.totalInvested.toFixed(2)} ETH`,
      icon: DollarSign,
    },
    {
      label: 'Active Investments',
      value: stats.activeInvestments.toString(),
      icon: TrendingUp,
    },
    {
      label: 'Returns',
      value: `${stats.returns.toFixed(2)}%`,
      icon: PieChart,
    },
    {
      label: 'Available Balance',
      value: `${stats.balance.toFixed(2)} ETH`,
      icon: Wallet,
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Dashboard role="investor" title="Investor Dashboard" stats={dashboardStats}>
        <InvoiceFunder setStats={setStats} />
      </Dashboard>
    </div>
  )
}

export default Investor
