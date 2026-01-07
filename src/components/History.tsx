import { useState, useEffect } from 'react';
import Timeline from './Timeline';
import { API_ENDPOINTS } from '../lib/api';

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
  new_cid?: string;
}

interface Product {
  _id: string;
  product_name: string;
  serial_number: string;
  batch_id: string;
}

const History = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
    fetchAllEvents();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch(API_ENDPOINTS.products);
      const data = await res.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Failed to fetch products', error);
    }
  };

  const fetchAllEvents = async () => {
    try {
      const res = await fetch(API_ENDPOINTS.trackingEvents);
      const data = await res.json();
      const formattedEvents = (data.events || []).map((event: TrackingEvent) => ({
        id: event._id,
        action: event.action,
        actor: event.actor,
        role: event.role,
        location: event.location,
        timestamp: event.timestamp,
        notes: event.notes,
        txHash: event.tx_hash
      }));
      setEvents(formattedEvents);
    } catch (error) {
      console.error('Failed to fetch tracking events', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProductEvents = async (productId: string) => {
    if (!productId) {
      fetchAllEvents();
      return;
    }

    try {
      const res = await fetch(`${API_ENDPOINTS.trackingEvents}/${productId}`);
      const data = await res.json();
      const formattedEvents = (data.events || []).map((event: TrackingEvent) => ({
        id: event._id,
        action: event.action,
        actor: event.actor,
        role: event.role,
        location: event.location,
        timestamp: event.timestamp,
        notes: event.notes,
        txHash: event.tx_hash
      }));
      setEvents(formattedEvents);
    } catch (error) {
      console.error('Failed to fetch product tracking events', error);
    }
  };

  const handleProductChange = (productId: string) => {
    setSelectedProduct(productId);
    fetchProductEvents(productId);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold mb-6">Product History</h2>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Product History</h2>

        {/* Product Filter */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-foreground">Filter by Product:</label>
          <select
            value={selectedProduct}
            onChange={(e) => handleProductChange(e.target.value)}
            className="px-3 py-2 bg-muted border border-border rounded-lg focus:outline-none focus:border-primary text-sm"
          >
            <option value="">All Products</option>
            {products.map((product) => (
              <option key={product._id} value={product._id}>
                {product.product_name} (SN: {product.serial_number})
              </option>
            ))}
          </select>
        </div>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            {selectedProduct ? 'No tracking events found for this product.' : 'No tracking events recorded yet.'}
          </p>
        </div>
      ) : (
        <Timeline events={events} />
      )}
    </div>
  );
};

export default History;