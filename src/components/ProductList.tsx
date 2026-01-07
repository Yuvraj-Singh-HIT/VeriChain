import { useEffect, useState } from 'react';
import { Package, Calendar, Hash } from 'lucide-react';
import { API_ENDPOINTS } from '../lib/api';

interface Product {
  _id: string;
  product_name: string;
  serial_number: string;
  batch_id: string;
  manufacturing_date: string;
  qr_code: string;
  verification_token: string;
}

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch(API_ENDPOINTS.products);
      const data = await res.json();
      setProducts(data.products);
    } catch (error) {
      console.error('Failed to fetch products', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading products...</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-6">Product List</h2>
      {products.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No products created yet.
        </div>
      ) : (
        <div className="grid gap-4">
          {products.map((product) => (
            <div key={product._id} className="glass rounded-xl p-6 border border-border">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Package className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{product.product_name}</h3>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Hash className="w-4 h-4" />
                        Serial: {product.serial_number}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {product.manufacturing_date}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Batch: {product.batch_id}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;