import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface InvoiceSettlementProps {
  invoiceId: number
}

const InvoiceSettlement = ({ invoiceId }: InvoiceSettlementProps) => {

  const handleSettleInvoice = () => {
    // For demo purposes, always use mock functionality since contracts aren't deployed
    console.log('Mock settling invoice:', invoiceId)
    alert(`Mock: Successfully settled invoice ${invoiceId}`)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Settle Invoice #{invoiceId}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4">Once the buyer has paid, settle the invoice to release funds to investors.</p>
        <Button onClick={handleSettleInvoice} variant="secondary">
          Settle Invoice (Demo)
        </Button>
      </CardContent>
    </Card>
  )
}

export default InvoiceSettlement