import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import RiskScoring from './RiskScoring'
import { API_ENDPOINTS } from '@/lib/api'

const InvoiceCreator = () => {
  const [amount, setAmount] = useState('')
  const [buyer, setBuyer] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [description, setDescription] = useState('')
  const [riskScore, setRiskScore] = useState<number | null>(null)
  const [isSaving, setIsSaving] = useState(false)


  const handleCreateInvoice = async () => {
    if (!amount || !buyer || !dueDate) {
      alert('Please fill all required fields')
      return
    }

    try {
      setIsSaving(true)

      const res = await fetch(API_ENDPOINTS.invoicesCreate, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          buyer,
          due_date: dueDate,
          description,
          // risk_score is now calculated dynamically by backend
        }),
      })

      if (!res.ok) {
        throw new Error('Failed to save invoice')
      }

      const data = await res.json()
      setRiskScore(data.risk_score) // Set the calculated risk score

      // For demo purposes, always use mock NFT minting since contracts aren't deployed
      console.log('Mock NFT minting for invoice')
      alert('Invoice created successfully! (NFT minting simulated)')
    } catch (err) {
      console.error(err)
      alert('Error creating invoice')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Invoice NFT</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <Label>Invoice Amount (ETH)</Label>
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.1"
          />
        </div>

        <div>
          <Label>Buyer Address</Label>
          <Input
            value={buyer}
            onChange={(e) => setBuyer(e.target.value)}
            placeholder="0x..."
          />
        </div>

        <div>
          <Label>Due Date</Label>
          <Input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>

        <div>
          <Label>Description</Label>
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Invoice description"
          />
        </div>

        <Button
          onClick={handleCreateInvoice}
          disabled={isSaving}
        >
          {isSaving ? 'Processing...' : 'Create Invoice NFT'}
        </Button>

        {riskScore !== null && (
          <div className="mt-4">
            <RiskScoring score={riskScore} />
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default InvoiceCreator
