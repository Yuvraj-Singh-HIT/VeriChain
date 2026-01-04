import { motion } from 'framer-motion';
import { useState } from 'react';
import { 
  Package, 
  FileText, 
  Hash, 
  Calendar, 
  Loader2,
  CheckCircle,
  QrCode,
  Shield,
  ArrowRight
} from 'lucide-react';
import QRCode from 'react-qr-code';

interface FormData {
  name: string;
  description: string;
  serial_number: string;
  batch_id: string;
  manufacturing_date: string;
}

const ProductCreator = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    serial_number: '',
    batch_id: '',
    manufacturing_date: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [qrData, setQrData] = useState<string | null>(null);
  const [step, setStep] = useState(1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate blockchain minting
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockQrData = JSON.stringify({
      product_id: `PROD-${Date.now()}`,
      nft_token_id: Math.floor(Math.random() * 10000),
      verification_token: crypto.randomUUID(),
      api_endpoint: 'https://api.verichain.io/verify'
    });
    
    setQrData(mockQrData);
    setIsLoading(false);
    setIsComplete(true);
  };

  const inputClasses = "w-full px-4 py-3 bg-muted border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-foreground placeholder:text-muted-foreground";
  const labelClasses = "block text-sm font-medium text-foreground mb-2";

  if (isComplete && qrData) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-xl mx-auto"
      >
        <div className="glass rounded-2xl p-8 border border-primary/30 text-center">
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-500/20 to-green-500/5 flex items-center justify-center"
          >
            <CheckCircle className="w-10 h-10 text-green-500" />
          </motion.div>

          <h2 className="font-heading text-2xl font-bold text-foreground mb-2">
            Product Created Successfully!
          </h2>
          <p className="text-muted-foreground mb-8">
            Your product has been registered on the blockchain and an NFT has been minted.
          </p>

          {/* QR Code */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="inline-block p-6 bg-white rounded-2xl mb-6"
          >
            <QRCode 
              value={qrData} 
              size={200}
              level="H"
            />
          </motion.div>

          <p className="text-sm text-muted-foreground mb-6">
            Print this QR code and attach it to your product packaging
          </p>

          {/* Product Details */}
          <div className="glass rounded-xl p-4 mb-6 text-left">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Product:</span>
                <p className="font-medium text-foreground">{formData.name}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Serial:</span>
                <p className="font-medium text-foreground">{formData.serial_number}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Batch:</span>
                <p className="font-medium text-foreground">{formData.batch_id}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Status:</span>
                <p className="font-medium text-green-500">NFT Minted ✓</p>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <motion.button
              onClick={() => {
                setIsComplete(false);
                setQrData(null);
                setFormData({
                  name: '',
                  description: '',
                  serial_number: '',
                  batch_id: '',
                  manufacturing_date: '',
                });
              }}
              className="flex-1 px-6 py-3 glass border border-border rounded-xl font-medium hover:bg-muted transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Create Another
            </motion.button>
            <motion.button
              className="flex-1 px-6 py-3 bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-xl font-medium"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Download QR
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <div className="glass rounded-2xl p-8 border border-border">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-secondary p-0.5">
            <div className="w-full h-full rounded-xl bg-background flex items-center justify-center">
              <Package className="w-7 h-7 text-primary" />
            </div>
          </div>
          <div>
            <h2 className="font-heading text-2xl font-bold text-foreground">
              Create New Product
            </h2>
            <p className="text-muted-foreground">
              Register product and mint NFT on blockchain
            </p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                step >= s 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-muted-foreground'
              }`}>
                {step > s ? <CheckCircle className="w-4 h-4" /> : s}
              </div>
              {s < 3 && (
                <div className={`flex-1 h-0.5 rounded-full transition-colors ${
                  step > s ? 'bg-primary' : 'bg-muted'
                }`} />
              )}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Name */}
          <div>
            <label className={labelClasses}>
              <Package className="w-4 h-4 inline mr-2 text-primary" />
              Product Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Premium Leather Handbag"
              className={inputClasses}
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          {/* Description */}
          <div>
            <label className={labelClasses}>
              <FileText className="w-4 h-4 inline mr-2 text-primary" />
              Description
            </label>
            <textarea
              required
              placeholder="Product description, materials, specifications..."
              rows={3}
              className={inputClasses}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          {/* Serial & Batch */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClasses}>
                <Hash className="w-4 h-4 inline mr-2 text-primary" />
                Serial Number
              </label>
              <input
                type="text"
                required
                placeholder="SN-001234"
                className={inputClasses}
                value={formData.serial_number}
                onChange={(e) => setFormData({...formData, serial_number: e.target.value})}
              />
            </div>
            <div>
              <label className={labelClasses}>
                <Package className="w-4 h-4 inline mr-2 text-primary" />
                Batch ID
              </label>
              <input
                type="text"
                required
                placeholder="BATCH-2024-001"
                className={inputClasses}
                value={formData.batch_id}
                onChange={(e) => setFormData({...formData, batch_id: e.target.value})}
              />
            </div>
          </div>

          {/* Manufacturing Date */}
          <div>
            <label className={labelClasses}>
              <Calendar className="w-4 h-4 inline mr-2 text-primary" />
              Manufacturing Date
            </label>
            <input
              type="datetime-local"
              required
              className={inputClasses}
              value={formData.manufacturing_date}
              onChange={(e) => setFormData({...formData, manufacturing_date: e.target.value})}
            />
          </div>

          {/* Info Box */}
          <div className="flex items-start gap-3 p-4 rounded-xl bg-primary/5 border border-primary/20">
            <Shield className="w-5 h-5 text-primary mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-foreground mb-1">Blockchain Registration</p>
              <p className="text-muted-foreground">
                This will mint a unique NFT on the Polygon network and store metadata on IPFS.
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-xl font-heading font-semibold text-lg glow-primary disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: isLoading ? 1 : 1.02 }}
            whileTap={{ scale: isLoading ? 1 : 0.98 }}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Minting NFT...
              </>
            ) : (
              <>
                <QrCode className="w-5 h-5" />
                Create Product & Mint NFT
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
};

export default ProductCreator;
