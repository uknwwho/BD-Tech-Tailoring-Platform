import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';

const TailorProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({ name: '', price: '', description: '', category: 'Shirt' });
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const API_URL = `${import.meta.env.VITE_API_URL}/products`;
    const token = localStorage.getItem('tailortech_token');

    useEffect(() => {
        fetchMyProducts();
    }, []);

    const fetchMyProducts = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/my/products`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) setProducts(data.products);
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setIsSubmitting(true);

        const fd = new FormData();
        fd.append('name', formData.name);
        fd.append('price', formData.price);
        fd.append('description', formData.description);
        fd.append('category', formData.category);
        for (const file of selectedFiles) {
            fd.append('images', file);
        }

        try {
            const url = editingProduct ? `${API_URL}/${editingProduct._id}` : API_URL;
            const method = editingProduct ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Authorization': `Bearer ${token}` },
                body: fd
            });
            const data = await res.json();

            if (data.success) {
                setMessage(editingProduct ? 'Product updated!' : 'Product added!');
                setFormData({ name: '', price: '', description: '', category: 'Shirt' });
                setSelectedFiles([]);
                setEditingProduct(null);
                fetchMyProducts();
                setTimeout(() => setShowModal(false), 1000);
            } else {
                setMessage('Error: ' + data.message);
            }
        } catch (error) {
            setMessage('Failed to save product.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setFormData({ name: product.name, price: product.price, description: product.description, category: product.category });
        setSelectedFiles([]);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this product?')) return;
        try {
            const res = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) fetchMyProducts();
        } catch (error) {
            console.error("Delete error:", error);
        }
    };

    const openAddModal = () => {
        setEditingProduct(null);
        setFormData({ name: '', price: '', description: '', category: 'Shirt' });
        setSelectedFiles([]);
        setMessage('');
        setShowModal(true);
    };

    const categories = [
        'Man: Shirt', 'Man: Pant', 'Man: Suit', 'Man: Panjabi', 'Man: Blazer', 'Man: Waistcoat',
        'Woman: Saree', 'Woman: Salwar Kameez', 'Woman: Lehanga', 'Woman: Kurti', 'Woman: Gown', 'Woman: Abaya/Burqa', 'Woman: Blouse', 'Woman: Petticoat',
        'Kids: Frock', 'Kids: Panjabi', 'Kids: Shirt', 'Kids: Pant', 'Kids: Suit/Tuxedo',
        'Other: Alterations', 'Other: Uniforms', 'Other: Wedding Special'
    ];

    return (
        <div className="flex h-screen bg-gray-50 font-sans text-gray-800 w-full overflow-hidden">
            <AdminSidebar />

            <main className="flex-1 p-8 md:p-10 overflow-y-auto w-full">
                <header className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">My Products</h1>
                        <p className="text-sm text-gray-500 mt-1">Manage your product catalogue.</p>
                    </div>
                    <button onClick={openAddModal} className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-indigo-700 transition shadow-sm text-sm">
                        + Add Product
                    </button>
                </header>

                {loading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {[1,2,3,4,5].map(i => (
                            <div key={i} className="bg-white rounded-xl p-3 border border-gray-100 animate-pulse">
                                <div className="h-32 bg-gray-200 rounded-lg mb-3"></div>
                                <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
                                <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                            </div>
                        ))}
                    </div>
                ) : products.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {products.map((product) => (
                            <div key={product._id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden group">
                                <div className="h-44 bg-gray-50 flex items-center justify-center p-2">
                                    {product.images && product.images.length > 0 ? (
                                        <img src={product.images[0]} alt={product.name} className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">No Image</div>
                                    )}
                                </div>
                                <div className="p-3">
                                    <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">{product.category}</span>
                                    <h3 className="font-bold text-gray-900 mt-1 mb-0.5 text-xs truncate">{product.name}</h3>
                                    <p className="text-[10px] text-gray-400 line-clamp-1 mb-2">{product.description}</p>
                                    <div className="flex justify-between items-center">
                                        <p className="text-sm font-black text-indigo-600">৳{product.price}</p>
                                        <div className="flex gap-1.5">
                                            <button onClick={() => handleEdit(product)} className="text-[10px] font-medium text-blue-600 hover:text-blue-800 bg-blue-50 px-2 py-1 rounded-md">Edit</button>
                                            <button onClick={() => handleDelete(product._id)} className="text-[10px] font-medium text-red-600 hover:text-red-800 bg-red-50 px-2 py-1 rounded-md">Delete</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl p-16 text-center border border-gray-100">
                        <p className="text-gray-500 text-lg font-medium mb-2">No products yet.</p>
                        <p className="text-gray-400 text-sm mb-4">Start by adding your first product.</p>
                        <button onClick={openAddModal} className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-medium hover:bg-indigo-700 transition text-sm">
                            + Add Product
                        </button>
                    </div>
                )}

                {/* Add/Edit Modal */}
                {showModal && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-gray-900">{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
                                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
                            </div>

                            {message && (
                                <div className={`mb-4 p-3 rounded-lg text-sm font-medium ${message.includes('!') && !message.includes('Error') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                    {message}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">Product Name</label>
                                    <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-indigo-500" placeholder="e.g. Premium Silk Shirt" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">Price (৳)</label>
                                    <input type="number" required value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-indigo-500" placeholder="2500" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">Category</label>
                                    <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-indigo-500">
                                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">Description</label>
                                    <textarea required rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-indigo-500 resize-none" placeholder="Describe your product..." />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">Images (up to 4)</label>
                                    <input type="file" accept="image/*" multiple onChange={(e) => setSelectedFiles(Array.from(e.target.files).slice(0, 4))} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
                                    {selectedFiles.length > 0 && <p className="text-xs text-gray-400 mt-1">{selectedFiles.length} file(s) selected</p>}
                                </div>
                                <button 
                                    type="submit" 
                                    disabled={isSubmitting}
                                    className={`w-full bg-indigo-600 text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-indigo-700'}`}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Processing...
                                        </>
                                    ) : (
                                        editingProduct ? 'Update Product' : 'Add Product'
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default TailorProducts;
