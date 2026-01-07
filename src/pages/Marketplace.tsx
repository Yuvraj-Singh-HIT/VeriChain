import Navbar from '../components/layout/Navbar'
import InvoiceFunder from '../components/InvoiceFunder'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const Marketplace = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 pt-24 pb-8">
        <Card>
          <CardHeader>
            <CardTitle>Invoice Financing Marketplace</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <p className="text-muted-foreground">
              Browse and fund tokenized invoices from MSMEs. Earn returns when buyers pay on time.
            </p>

            {/* ✅ InvoiceFunder now fetches invoices itself */}
            <InvoiceFunder />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Marketplace
