import { useEffect, useState } from 'react'
import Navbar from '../components/layout/Navbar'
import Dashboard from '../components/Dashboard'
import ProductCreator from '../components/ProductCreator'
import ProductList from '../components/ProductList'
import History from '../components/History'
import Settings from '../components/Settings'
import { Factory, Package, CheckCircle, TrendingUp } from 'lucide-react'
import { API_ENDPOINTS } from '../lib/api'

const Manufacturer = () => {
  const [productCount, setProductCount] = useState(0)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const res = await fetch(API_ENDPOINTS.products)
      const data = await res.json()
      setProductCount(data.products.length)
    } catch (error) {
      console.error('Failed to fetch products', error)
    }
  }

  const stats = [
    {
      label: 'Total Products',
      value: productCount.toLocaleString(),
      change: '+0%',
      icon: Package,
    },
    {
      label: 'NFTs Minted',
      value: productCount.toLocaleString(),
      change: '+0%',
      icon: Factory,
    },
    {
      label: 'Verified',
      value: '100%',
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

  const tabContents = {
    overview: <ProductCreator />,
    products: <ProductList />,
    history: <History />,
    settings: <Settings />,
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Dashboard role="manufacturer" title="Welcome, Manufacturer" stats={stats} tabContents={tabContents} tabs={['overview', 'products', 'settings']}>
        <ProductCreator />
      </Dashboard>
    </div>
  )
}

export default Manufacturer
