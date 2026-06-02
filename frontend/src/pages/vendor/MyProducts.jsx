import React, { useState, useEffect } from 'react';
import { Package, Plus, Trash2, Edit2, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const MyProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({ id: '', item: '', price: '', category: 'seed', stock: '', description: '', imageUrl: '' });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products');
      const myProducts = res.data.products.filter(p => p.vendor_email === user.email);
      setProducts(myProducts);
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (product = null) => {
    if (product) {
      setFormData({ 
        id: product._id, item: product.item, price: product.price, 
        category: product.category, stock: product.stock, 
        description: product.description, imageUrl: product.imageUrl 
      });
    } else {
      setFormData({ id: '', item: '', price: '', category: 'seed', stock: '', description: '', imageUrl: '' });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.id) {
        await api.put(`/products/${formData.id}`, formData);
        toast.success('Product updated');
      } else {
        await api.post('/products', formData);
        toast.success('Product added successfully');
      }
      setShowModal(false);
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this product?')) {
      try {
        await api.delete(`/products/${id}`);
        toast.success('Product deleted');
        fetchProducts();
      } catch (error) {
        toast.error('Failed to delete product');
      }
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
      <div className="flex sm:flex-row flex-col justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark-900">Manage Products</h1>
          <p className="text-dark-500">Add or edit your agri-inputs catalog</p>
        </div>
        <button onClick={() => handleOpenModal()} className="btn-primary flex items-center gap-2">
          <Plus size={20} /> Add Product
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.length === 0 ? (
          <div className="col-span-full card p-12 text-center text-dark-500">
            <Package className="mx-auto text-earth-300 mb-4" size={48} />
            <h3 className="text-lg font-semibold text-dark-800">No products found</h3>
            <p>You haven't added any items to your shop yet.</p>
          </div>
        ) : (
          products.map((product) => (
            <div key={product._id} className="card flex flex-col overflow-hidden">
              <div className="h-48 bg-earth-100 relative items-center justify-center flex">
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.item} className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon size={48} className="text-earth-300" />
                )}
                <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded text-xs font-bold shadow-sm tracking-widest text-primary-600 uppercase">
                  {product.category}
                </div>
              </div>
              <div className="p-5 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg leading-tight line-clamp-1">{product.item}</h3>
                  <span className="font-display font-bold text-dark-900">₹{product.price}</span>
                </div>
                <p className="text-sm text-dark-500 line-clamp-2 mb-4 h-10">{product.description}</p>
                
                <div className="mt-auto flex items-center justify-between border-t border-earth-100 pt-3">
                  <span className="text-sm font-medium text-dark-600">Stock: {product.stock} units</span>
                  <div className="flex gap-2">
                    <button onClick={() => handleOpenModal(product)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded bg-white border border-earth-200">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(product._id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded bg-white border border-earth-200">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-dark-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-card w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">{formData.id ? 'Edit Product' : 'Add New Product'}</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-dark-700 mb-1">Product Name *</label>
                <input type="text" name="item" value={formData.item} onChange={(e) => setFormData({...formData, item: e.target.value})} required className="input-field" placeholder="e.g. SuperGrow Fertilizer" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-dark-700 mb-1">Category *</label>
                  <select name="category" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="input-field">
                    <option value="seed">Seed</option>
                    <option value="fertilizer">Fertilizer</option>
                    <option value="pesticide">Pesticide</option>
                    <option value="equipment">Equipment</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-700 mb-1">Price (₹) *</label>
                  <input type="number" name="price" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} required className="input-field" placeholder="0" min="0" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-700 mb-1">Available Stock *</label>
                <input type="number" name="stock" value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})} required className="input-field" placeholder="0" min="0" />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-700 mb-1">Description</label>
                <textarea name="description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="input-field min-h-[80px]" placeholder="Detailed product info" />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-700 mb-1">Image URL (Optional)</label>
                <input type="url" name="imageUrl" value={formData.imageUrl} onChange={(e) => setFormData({...formData, imageUrl: e.target.value})} className="input-field" placeholder="https://example.com/image.png" />
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-earth-100">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Save Product</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProducts;
