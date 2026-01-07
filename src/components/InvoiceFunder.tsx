import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import RiskScoring from './RiskScoring'

interface Props {
   setStats?: React.Dispatch<
     React.SetStateAction<{
       totalInvested: number
       activeInvestments: number
       returns: number
       balance: number
     }>
   >
 }

interface Invoice {
  _id: string
  amount: number
  buyer: string
  due_date: string
  risk_score: number
}

const InvoiceFunder = ({ setStats }: Props) => {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [fundAmount, setFundAmount] = useState<{ [key: string]: string }>({})
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    fetchInvoices()
  }, [])

  const fetchInvoices = async () => {
    try {
      const res = await fetch('http://localhost:8001/api/get_invoices')
      const data = await res.json()
      setInvoices(data.invoices)
    } catch (error) {
      console.error('Error fetching invoices:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFundInvoice = async (invoiceId: string, amount: string) => {
    const ethAmount = parseFloat(amount)
    if (!ethAmount || ethAmount <= 0) return

    // For demo purposes, always use mock functionality since contracts aren't deployed
    console.log('Mock funding invoice:', { invoiceId, amount: ethAmount })
    alert(`Mock: Successfully funded invoice ${invoiceId} with ${ethAmount} ETH`)

    // 🔥 Update dashboard + persist to backend (only if setStats is provided)
    if (setStats) {
      setStats((prev) => {
        const updatedStats = {
          totalInvested: prev.totalInvested + ethAmount,
          activeInvestments: prev.activeInvestments + 1,
          returns: prev.returns,
          balance: prev.balance - ethAmount,
        }

        // Persist to DB
        fetch('http://localhost:8001/api/invoices_funded', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            total_ivested: updatedStats.totalInvested,
            active_investments: updatedStats.activeInvestments,
            returns: updatedStats.returns,
            available_balance: updatedStats.balance,
            status: 'active',
          }),
        }).catch((err) =>
          console.error('Failed to persist funding data:', err)
        )

        return updatedStats
      })
    }

    setFundAmount((prev) => ({ ...prev, [invoiceId]: '' }))
  }

  if (loading) return <div>Loading invoices...</div>

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Available Invoices for Funding</h2>

      {setStats && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
          <p className="text-sm text-yellow-600 dark:text-yellow-400">
            ⚠️ Demo Mode: Smart contracts not configured. Funding will be simulated.
          </p>
        </div>
      )}

      {invoices.map((invoice) => (
        <Card key={invoice._id}>
          <CardHeader>
            <CardTitle>Invoice #{invoice._id}</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div>
              <p><strong>Amount:</strong> {invoice.amount} ETH</p>
              <p><strong>Buyer:</strong> {invoice.buyer}</p>
              <p><strong>Due Date:</strong> {invoice.due_date}</p>
            </div>

            <RiskScoring score={invoice.risk_score} />

            <div>
              <Label htmlFor={`fundAmount-${invoice._id}`}>
                Fund Amount (ETH)
              </Label>
              <Input
                id={`fundAmount-${invoice._id}`}
                type="number"
                value={fundAmount[invoice._id] || ''}
                onChange={(e) =>
                  setFundAmount({
                    ...fundAmount,
                    [invoice._id]: e.target.value,
                  })
                }
                placeholder="0.1"
              />
            </div>

            <Button
              onClick={() =>
                handleFundInvoice(invoice._id, fundAmount[invoice._id])
              }
              variant="secondary"
            >
              Fund Invoice (Demo)
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default InvoiceFunder
