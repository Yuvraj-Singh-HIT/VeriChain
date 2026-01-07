import { useEffect, useState } from 'react'
import Navbar from '../components/layout/Navbar'
import Dashboard from '../components/Dashboard'
import InvoiceCreator from '../components/InvoiceCreator'
import InvoiceSettlement from '../components/InvoiceSettlement'
import { FileText, DollarSign, CheckCircle, TrendingUp } from 'lucide-react'
import { API_ENDPOINTS } from '../lib/api'

const MSME = () => {
  const [totalInvoices, setTotalInvoices] = useState(0)
  const [nftsMinted, setNftsMinted] = useState(0)

  useEffect(() => {
    fetchInvoices()
    fetchProducts()
  }, [])

  const fetchInvoices = async () => {
    try {
      const res = await fetch(API_ENDPOINTS.getInvoices)
      const data = await res.json()
      setTotalInvoices(data.invoices.length)
    } catch (err) {
      console.error('Failed to fetch invoices', err)
    }
  }

  const fetchProducts = async () => {
    try {
      const res = await fetch(API_ENDPOINTS.products)
      const data = await res.json()
      setNftsMinted(data.products.length)
    } catch (err) {
      console.error('Failed to fetch products', err)
    }
  }

  const stats = [
    {
      label: 'Total Invoices',
      value: totalInvoices.toString(),
      change: '+0%',
      icon: FileText,
    },
    {
      label: 'NFTs Minted',
      value: nftsMinted.toString(),
      change: '+0%',
      icon: DollarSign,
    },
    {
      label: 'Paid Invoices',
      value: '0%',
      change: '+0%',
      icon: CheckCircle,
    },
    {
      label: 'Revenue',
      value: '₹0',
      change: '+0%',
      icon: TrendingUp,
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Dashboard role="msme" title="MSME Dashboard" stats={stats}>
        <div className="space-y-6">
          <InvoiceCreator />
          <InvoiceSettlement invoiceId={1} />
        </div>
      </Dashboard>
    </div>
  )
}

export default MSME
