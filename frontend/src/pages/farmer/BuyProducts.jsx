import React, { useState, useEffect } from 'react';
import { ShoppingCart, Search, Filter } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';

const BuyProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [addingToCart, setAddingToCart] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, [category, searchTerm]);

  const fetchProducts = async () => {
    try {
      let url = '/products';
      const params = new URLSearchParams();
      if (category) params.append('category', category);
      if (searchTerm) params.append('search', searchTerm);
      
      const res = await api.get(`${url}?${params.toString()}`);
      setProducts(res.data.products);
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (product) => {
    setAddingToCart(product._id);
    try {
      await api.post('/cart/add', {
        product_id: product._id,
        product_type: 'vendor_product',
        quantity: 1
      });
      toast.success(`${product.item} added to cart`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add to cart');
    } finally {
      setAddingToCart(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-dark-900">Buy Agri-Inputs</h1>
        <p className="text-dark-500">Shop for seeds, fertilizers, and equipment from verified vendors</p>
      </div>

      <div className="card p-4 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-earth-400" />
          </div>
          <input 
            type="text" 
            className="input-field pl-10" 
            placeholder="Search products..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative md:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Filter size={18} className="text-earth-400" />
          </div>
          <select 
            className="input-field pl-10 appearance-none bg-white font-medium"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="seed">Seeds</option>
            <option value="fertilizer">Fertilizers</option>
            <option value="pesticide">Pesticides</option>
            <option value="equipment">Equipment</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">Loading products...</div>
      ) : products.length === 0 ? (
        <div className="card p-12 text-center text-dark-500">
          <ShoppingCart size={48} className="mx-auto text-earth-300 mb-4" />
          <h3 className="text-lg font-semibold text-dark-700">No products found</h3>
          <p>Try adjusting your search or filter</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product._id} className="card group flex flex-col hover:shadow-glow-earth transition-shadow">
              <div className="h-48 bg-earth-100 relative overflow-hidden flex items-center justify-center p-4">
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.item} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <span className="text-earth-400 font-medium">No Image</span>
                )}
                <div className="absolute top-2 right-2 flex gap-1">
                  <span className="bg-white/90 backdrop-blur-sm px-2 py-1 text-xs font-bold rounded-md text-primary-700 shadow-sm border border-earth-100 uppercase tracking-wide">
                    {product.category}
                  </span>
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="font-bold text-dark-900 text-lg mb-1 leading-tight">{product.item}</h3>
                <p className="text-dark-500 text-sm mb-4 line-clamp-2 min-h-10">{product.description || 'No description available.'}</p>
                
                <div className="mt-auto pt-4 border-t border-earth-100 flex items-end justify-between">
                  <div>
                    <p className="text-xs text-dark-400 mb-1">Price</p>
                    <p className="font-display font-bold text-xl text-dark-900">₹{product.price}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-dark-400 mb-1">Stock</p>
                    <p className="font-medium text-sm text-dark-700">{product.stock} left</p>
                  </div>
                </div>

                <button 
                  onClick={() => handleAddToCart(product)}
                  disabled={product.stock === 0 || addingToCart === product._id}
                  className={`mt-4 w-full py-2.5 rounded-lg flex items-center justify-center gap-2 font-medium transition-colors ${
                    product.stock === 0 
                      ? 'bg-earth-100 text-earth-400 cursor-not-allowed' 
                      : 'bg-primary-600 text-white hover:bg-primary-700'
                  }`}
                >
                  {addingToCart === product._id ? (
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : product.stock === 0 ? (
                    'Out of Stock'
                  ) : (
                    <>
                      <ShoppingCart size={18} /> Add to Cart
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BuyProducts;
