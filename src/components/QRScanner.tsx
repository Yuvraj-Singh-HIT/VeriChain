import { motion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { 
  Camera, 
  Upload, 
  CheckCircle, 
  XCircle, 
  Shield, 
  Package,
  MapPin,
  Clock,
  Link2,
  AlertTriangle,
  Loader2
} from 'lucide-react';

interface VerificationResult {
  authentic: boolean;
  product: {
    name: string;
    serial_number: string;
    batch_id: string;
    status: string;
    nft_token_id: string;
  };
  supply_chain_history: Array<{
    action: string;
    actor_role: string;
    location: string;
    timestamp: string;
    notes: string;
  }>;
}

const QRScanner = () => {
  const [scanning, setScanning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startScanning = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setScanning(true);
      setError(null);
      
      // Simulate QR detection after 3 seconds
      setTimeout(() => {
        handleQRDetected();
      }, 3000);
    } catch (err) {
      setError('Camera access denied. Please allow camera permissions.');
    }
  };

  const stopScanning = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    setScanning(false);
  };

  const handleQRDetected = async () => {
    stopScanning();
    setLoading(true);
    
    // Simulate API verification
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockResult: VerificationResult = {
      authentic: Math.random() > 0.2, // 80% chance of authentic
      product: {
        name: 'Premium Leather Handbag',
        serial_number: 'SN-2024-001234',
        batch_id: 'BATCH-2024-Q1-001',
        status: 'at_retailer',
        nft_token_id: '12847',
      },
      supply_chain_history: [
        {
          action: 'manufactured',
          actor_role: 'Manufacturer',
          location: 'Milan, Italy',
          timestamp: '2024-01-15T10:30:00Z',
          notes: 'Product manufactured and NFT minted',
        },
        {
          action: 'shipped',
          actor_role: 'Manufacturer',
          location: 'Milan, Italy',
          timestamp: '2024-01-16T14:00:00Z',
          notes: 'Shipped to distributor',
        },
        {
          action: 'received',
          actor_role: 'Distributor',
          location: 'Frankfurt, Germany',
          timestamp: '2024-01-18T09:15:00Z',
          notes: 'Received at distribution center',
        },
        {
          action: 'shipped',
          actor_role: 'Distributor',
          location: 'Frankfurt, Germany',
          timestamp: '2024-01-19T11:00:00Z',
          notes: 'Shipped to retailer',
        },
        {
          action: 'received',
          actor_role: 'Retailer',
          location: 'New York, USA',
          timestamp: '2024-01-22T16:30:00Z',
          notes: 'Arrived at store',
        },
      ],
    };
    
    setResult(mockResult);
    setLoading(false);
  };

  const resetScanner = () => {
    setResult(null);
    setError(null);
    setLoading(false);
  };

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
            <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
            <Shield className="absolute inset-0 m-auto w-10 h-10 text-primary" />
          </div>
          <h3 className="font-heading text-xl font-semibold mb-2">Verifying Product</h3>
          <p className="text-muted-foreground">Checking blockchain records...</p>
        </motion.div>
      </div>
    );
  }

  if (result) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        {/* Authenticity Status */}
        <div className={`glass rounded-2xl p-6 mb-6 border ${
          result.authentic 
            ? 'border-green-500/30 bg-green-500/5' 
            : 'border-red-500/30 bg-red-500/5'
        }`}>
          <div className="flex items-center gap-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.5 }}
              className={`w-16 h-16 rounded-full flex items-center justify-center ${
                result.authentic ? 'bg-green-500/20' : 'bg-red-500/20'
              }`}
            >
              {result.authentic ? (
                <CheckCircle className="w-8 h-8 text-green-500" />
              ) : (
                <XCircle className="w-8 h-8 text-red-500" />
              )}
            </motion.div>
            <div>
              <h2 className={`font-heading text-2xl font-bold ${
                result.authentic ? 'text-green-500' : 'text-red-500'
              }`}>
                {result.authentic ? 'GENUINE PRODUCT' : 'VERIFICATION FAILED'}
              </h2>
              <p className="text-muted-foreground">
                {result.authentic 
                  ? 'This product is authentic and verified on blockchain'
                  : 'This product could not be verified. It may be counterfeit.'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="glass rounded-2xl p-6 mb-6 border border-border">
          <h3 className="font-heading text-lg font-semibold mb-4 flex items-center gap-2">
            <Package className="w-5 h-5 text-primary" />
            Product Details
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-muted-foreground">Name</span>
              <p className="font-medium text-foreground">{result.product.name}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Serial Number</span>
              <p className="font-medium text-foreground">{result.product.serial_number}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Batch ID</span>
              <p className="font-medium text-foreground">{result.product.batch_id}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">NFT Token ID</span>
              <p className="font-medium text-primary">#{result.product.nft_token_id}</p>
            </div>
          </div>
        </div>

        {/* Supply Chain Timeline */}
        <div className="glass rounded-2xl p-6 mb-6 border border-border">
          <h3 className="font-heading text-lg font-semibold mb-6 flex items-center gap-2">
            <Link2 className="w-5 h-5 text-primary" />
            Supply Chain Journey
          </h3>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-[11px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-secondary to-primary" />
            
            <div className="space-y-6">
              {result.supply_chain_history.map((event, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative pl-8"
                >
                  {/* Node */}
                  <div className={`absolute left-0 w-6 h-6 rounded-full border-2 border-primary bg-background flex items-center justify-center ${
                    index === result.supply_chain_history.length - 1 ? 'animate-pulse' : ''
                  }`}>
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  </div>
                  
                  {/* Content */}
                  <div className="glass rounded-xl p-4">
                    <div className="flex items-start justify-between mb-2">
                      <span className="font-heading font-semibold text-foreground capitalize">
                        {event.action.replace(/_/g, ' ')}
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(event.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{event.notes}</p>
                    <div className="flex items-center gap-4 text-xs">
                      <span className="flex items-center gap-1 text-primary">
                        <MapPin className="w-3 h-3" />
                        {event.location}
                      </span>
                      <span className="text-muted-foreground">
                        by {event.actor_role}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <motion.button
            onClick={resetScanner}
            className="flex-1 px-6 py-3 glass border border-border rounded-xl font-medium hover:bg-muted transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Scan Another
          </motion.button>
          <motion.button
            className="flex-1 px-6 py-3 bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-xl font-medium"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Report Issue
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-8 border border-border text-center"
      >
        {/* Scanner View */}
        <div className="relative aspect-square max-w-sm mx-auto mb-8 rounded-2xl overflow-hidden bg-black">
          {scanning ? (
            <>
              <video 
                ref={videoRef}
                autoPlay 
                playsInline 
                muted 
                className="w-full h-full object-cover"
              />
              {/* Scanning overlay */}
              <div className="absolute inset-0 border-2 border-primary/50 rounded-2xl">
                {/* Corner markers */}
                <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-primary" />
                <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-primary" />
                <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-primary" />
                <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-primary" />
                
                {/* Scan line */}
                <motion.div
                  className="absolute left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent"
                  animate={{ top: ['10%', '90%', '10%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
              </div>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 glass rounded-full text-sm">
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Scanning...
                </span>
              </div>
            </>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <Camera className="w-16 h-16 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Camera preview</p>
            </div>
          )}
        </div>

        {error && (
          <div className="flex items-center gap-2 p-4 mb-6 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-sm">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            {error}
          </div>
        )}

        <h2 className="font-heading text-2xl font-bold mb-2">Scan Product QR Code</h2>
        <p className="text-muted-foreground mb-8">
          Point your camera at the product's QR code to verify its authenticity
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          {scanning ? (
            <motion.button
              onClick={stopScanning}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 glass border border-red-500/30 text-red-500 rounded-xl font-medium"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <XCircle className="w-5 h-5" />
              Stop Scanning
            </motion.button>
          ) : (
            <>
              <motion.button
                onClick={startScanning}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-xl font-medium glow-primary"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Camera className="w-5 h-5" />
                Start Camera
              </motion.button>
              <motion.button
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 glass border border-border rounded-xl font-medium hover:bg-muted transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Upload className="w-5 h-5" />
                Upload Image
              </motion.button>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default QRScanner;
