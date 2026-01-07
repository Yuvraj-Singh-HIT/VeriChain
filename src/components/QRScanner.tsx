import { motion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { Html5QrcodeScanner, Html5Qrcode } from 'html5-qrcode';
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
  status: string; // "genuine", "tampered", "invalid"
  product: {
    id: string;
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

interface QRScannerProps {
  mode?: 'customer' | 'supply-chain';
  role?: string;
  onClose?: () => void;
}

const QRScanner = ({ mode = 'customer', role, onClose }: QRScannerProps = {}) => {
  const [scanning, setScanning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showActions, setShowActions] = useState(false);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startScanning = async () => {
    try {
      scannerRef.current = new Html5QrcodeScanner(
        'qr-reader',
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
        },
        false
      );

      scannerRef.current.render(
        (decodedText: string) => {
          handleQRDetected(decodedText);
        },
        (errorMessage: string) => {
          console.log('QR scan error:', errorMessage);
        }
      );

      setScanning(true);
      setError(null);
    } catch (err) {
      setError('Failed to initialize camera. Please check permissions.');
    }
  };

  const stopScanning = () => {
    if (scannerRef.current) {
      scannerRef.current.clear().catch(console.error);
      scannerRef.current = null;
    }
    setScanning(false);
  };

  const handleQRDetected = async (qrData: string) => {
    stopScanning();
    setLoading(true);

    try {
      // Parse QR data - assume JSON format: {"tokenId": 123, "verificationToken": "abc..."}
      const parsedData = JSON.parse(qrData);
      const { tokenId, verificationToken } = parsedData;

      // Call backend verification API
      const response = await fetch('http://localhost:8001/api/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token_id: parseInt(tokenId),
          verification_token: verificationToken,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const verificationResult: VerificationResult = {
          authentic: data.authentic,
          status: data.status,
          product: {
            id: data.product.id,
            name: data.product.name,
            serial_number: data.product.serial_number,
            batch_id: data.product.batch_id,
            status: data.product.status,
            nft_token_id: data.product.nft_token_id,
          },
          supply_chain_history: data.supply_chain_history,
        };
        setResult(verificationResult);
        if (mode === 'supply-chain') {
          setShowActions(true);
        }
      } else {
        setError(data.message || 'Verification failed');
      }
    } catch (err) {
      console.error('Verification error:', err);
      setError('Failed to verify product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetScanner = () => {
    setResult(null);
    setError(null);
    setLoading(false);
    setShowActions(false);
  };

  const handleImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      const html5QrCode = new Html5Qrcode("file-scanner");
      const qrCodeResult = await html5QrCode.scanFile(file, true);

      // Clean up the scanner
      await html5QrCode.clear();

      // Process the QR code data
      await handleQRDetected(qrCodeResult);
    } catch (err) {
      console.error('Image scan error:', err);
      setError('Failed to scan QR code from image. Please ensure the image contains a valid QR code.');
      setLoading(false);
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleStatusUpdate = async (action: string) => {
    if (!result) return;

    try {
      setLoading(true);
      const response = await fetch('http://localhost:8001/api/tracking_events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product_id: result.product.id,
          action: action,
          actor: `${role} User`, // Could be made dynamic
          role: role,
          location: `${role} Facility`, // Could be made dynamic
          notes: `Product ${action} by ${role}`,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(`Product marked as ${action} successfully!`);
        if (onClose) onClose();
      } else {
        setError(data.detail || 'Failed to update product status');
      }
    } catch (err) {
      console.error('Status update error:', err);
      setError('Failed to update product status');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(console.error);
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
          result.status === 'genuine'
            ? 'border-green-500/30 bg-green-500/5'
            : 'border-red-500/30 bg-red-500/5'
        }`}>
          <div className="flex items-center gap-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.5 }}
              className={`w-16 h-16 rounded-full flex items-center justify-center ${
                result.status === 'genuine' ? 'bg-green-500/20' : 'bg-red-500/20'
              }`}
            >
              {result.status === 'genuine' ? (
                <CheckCircle className="w-8 h-8 text-green-500" />
              ) : (
                <XCircle className="w-8 h-8 text-red-500" />
              )}
            </motion.div>
            <div>
              <h2 className={`font-heading text-2xl font-bold ${
                result.status === 'genuine' ? 'text-green-500' : 'text-red-500'
              }`}>
                {result.status === 'genuine' ? 'GENUINE PRODUCT' :
                 result.status === 'tampered' ? 'TAMPERED PRODUCT' :
                 'INVALID TOKEN'}
              </h2>
              <p className="text-muted-foreground">
                {result.status === 'genuine'
                  ? 'This product is authentic and verified on blockchain'
                  : result.status === 'tampered'
                  ? 'Product metadata has been tampered with'
                  : 'Invalid or expired verification token'
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
          {mode === 'supply-chain' && showActions ? (
            <>
              <motion.button
                onClick={() => handleStatusUpdate('received')}
                className="flex-1 px-6 py-3 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Mark as Received
              </motion.button>
              <motion.button
                onClick={() => handleStatusUpdate('shipped')}
                className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Mark as Shipped
              </motion.button>
              {role === 'retailer' && (
                <motion.button
                  onClick={() => handleStatusUpdate('sold')}
                  className="flex-1 px-6 py-3 bg-purple-500 text-white rounded-xl font-medium hover:bg-purple-600 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Mark as Sold
                </motion.button>
              )}
            </>
          ) : (
            <>
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
            </>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-xl mx-auto">
      {/* Hidden element for file scanning */}
      <div id="file-scanner" className="hidden"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-8 border border-border text-center"
      >
        {/* Scanner View */}
        <div className="relative aspect-square max-w-sm mx-auto mb-8 rounded-2xl overflow-hidden bg-black">
          {scanning ? (
            <div id="qr-reader" className="w-full h-full" />
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
                onClick={handleImageUpload}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 glass border border-border rounded-xl font-medium hover:bg-muted transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Upload className="w-5 h-5" />
                Upload Image
              </motion.button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default QRScanner;
