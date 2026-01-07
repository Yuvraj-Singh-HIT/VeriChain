import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Package,
  Truck,
  Store,
  MapPin,
  Clock,
  CheckCircle,
  Loader2,
  Send
} from 'lucide-react';

interface Product {
  _id: string;
  product_name: string;
  serial_number: string;
  batch_id: string;
  current_location?: string;
  status?: string;
}

interface TrackingEvent {
  _id: string;
  product_id: string;
  action: string;
  actor: string;
  role: string;
  location: string;
  notes: string;
  timestamp: string;
  tx_hash?: string;
}

interface ProductTrackerProps {
  role: 'distributor' | 'retailer';
  userName: string;
}

const ProductTracker = ({ role, userName }: ProductTrackerProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [trackingEvents, setTrackingEvents] = useState<TrackingEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    action: role === 'distributor' ? 'shipped' : 'received',
    location: '',
    notes: ''
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('http://localhost:8001/api/products');
      const data = await res.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Failed to fetch products', error);
    }
  };

  const fetchTrackingEvents = async (productId: string) => {
    try {
      const res = await fetch(`http://localhost:8001/api/tracking_events/${productId}`);
      const data = await res.json();
      setTrackingEvents(data.events || []);
    } catch (error) {
      console.error('Failed to fetch tracking events', error);
    }
  };

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    fetchTrackingEvents(product._id);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8001/api/tracking_events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: selectedProduct._id,
          action: formData.action,
          actor: userName,
          role: role === 'distributor' ? 'Distributor' : 'Retailer',
          location: formData.location,
          notes: formData.notes
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert('Tracking event recorded successfully!');
        // Refresh data
        fetchProducts();
        if (selectedProduct) {
          fetchTrackingEvents(selectedProduct._id);
        }
        // Reset form
        setFormData({
          action: role === 'distributor' ? 'shipped' : 'received',
          location: '',
          notes: ''
        });
      } else {
        alert(data.detail || 'Failed to record tracking event');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Network error. Make sure backend is running on port 8001');
    } finally {
      setIsLoading(false);
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'manufactured': return <Package className="w-4 h-4" />;
      case 'shipped': return <Truck className="w-4 h-4" />;
      case 'received': return <Store className="w-4 h-4" />;
      case 'sold': return <CheckCircle className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary p-0.5">
          <div className="w-full h-full rounded-xl bg-background flex items-center justify-center">
            {role === 'distributor' ? <Truck className="w-6 h-6 text-primary" /> : <Store className="w-6 h-6 text-primary" />}
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            Product Tracking - {role === 'distributor' ? 'Distributor' : 'Retailer'}
          </h2>
          <p className="text-muted-foreground">
            Update product status and track supply chain movement
          </p>
        </div>
      </div>

      {/* Products List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <motion.div
            key={product._id}
            whileHover={{ scale: 1.02 }}
            className="glass rounded-xl p-4 border border-border hover:border-primary/30 transition-colors cursor-pointer"
            onClick={() => handleProductSelect(product)}
          >
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-foreground">{product.product_name}</h3>
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                {product.status || 'manufactured'}
              </span>
            </div>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>Serial: {product.serial_number}</p>
              <p>Batch: {product.batch_id}</p>
              {product.current_location && (
                <p className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {product.current_location}
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Tracking Form */}
      {showForm && selectedProduct && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-xl p-6 border border-primary/30"
        >
          <h3 className="text-lg font-semibold mb-4">
            Update Status for {selectedProduct.product_name}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Action
                </label>
                <select
                  value={formData.action}
                  onChange={(e) => setFormData({...formData, action: e.target.value})}
                  className="w-full px-3 py-2 bg-muted border border-border rounded-lg focus:outline-none focus:border-primary"
                  required
                >
                  {role === 'distributor' ? (
                    <>
                      <option value="shipped">Shipped to Retailer</option>
                      <option value="in_transit">In Transit</option>
                    </>
                  ) : (
                    <>
                      <option value="received">Received from Distributor</option>
                      <option value="sold">Sold to Customer</option>
                      <option value="in_stock">In Stock</option>
                    </>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  placeholder="e.g., New York, USA"
                  className="w-full px-3 py-2 bg-muted border border-border rounded-lg focus:outline-none focus:border-primary"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                placeholder="Additional details about this update..."
                rows={3}
                className="w-full px-3 py-2 bg-muted border border-border rounded-lg focus:outline-none focus:border-primary"
              />
            </div>

            <div className="flex gap-3">
              <motion.button
                type="submit"
                disabled={isLoading}
                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-lg font-medium disabled:opacity-50"
                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                Record Update
              </motion.button>

              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-2 glass border border-border rounded-lg font-medium hover:bg-muted transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Tracking History */}
      {selectedProduct && trackingEvents.length > 0 && (
        <div className="glass rounded-xl p-6 border border-border">
          <h3 className="text-lg font-semibold mb-4">Tracking History</h3>
          <div className="space-y-3">
            {trackingEvents.map((event) => (
              <div key={event._id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  {getActionIcon(event.action)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium capitalize">{event.action}</span>
                    <span className="text-xs text-muted-foreground">by {event.role}</span>
                  </div>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {event.location}
                    </p>
                    <p className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(event.timestamp).toLocaleString()}
                    </p>
                    {event.notes && <p>{event.notes}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductTracker;