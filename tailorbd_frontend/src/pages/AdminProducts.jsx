import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });

    const API_URL = import.meta.env.VITE_API_URL;
    const token = localStorage.getItem('tailortech_token');

    useEffect(() => {
        fetchProducts();
    }, [pagination.page]);

    const fetchProducts = async (query = '') => {
        setLoading(true);
        try {
            let url = `${API_URL}/products?page=${pagination.page}&limit=15`;
            if (query) url += `&search=${query}`;
            const res = await fetch(url);
            const data = await res.json();
            if (data.success) {
                setProducts(data.products);
                setPagination(data.pagination);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setPagination({ ...pagination, page: 1 });
        fetchProducts(search);
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this product? This will also remove it from any customer carts.')) return;
        try {
            const res = await fetch(`${API_URL}/products/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setProducts(products.filter(p => p._id !== id));
            } else {
                alert('Error: ' + data.message);
            }
        } catch (error) {
            console.error("Delete error:", error);
        }
    };

    return (
        <div className="flex h-screen bg-gray-50 font-sans text-gray-800 w-full overflow-hidden">
            <AdminSidebar />

            <main className="flex-1 p-8 md:p-10 overflow-y-auto w-full">
                <header className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
                        <p className="text-sm text-gray-500 mt-1">Monitor and manage all tailor-made products on the platform.</p>
                    </div>
                </header>

                {/* Search & Stats */}
                <div className="flex flex-col md:flex-row gap-6 mb-10 items-center justify-between">
                    <form onSubmit={handleSearch} className="w-full md:w-96">
                        <div className="relative">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search products, categories..."
                                className="w-full border border-gray-200 rounded-xl px-5 py-3 outline-none focus:border-indigo-500 transition shadow-sm text-sm"
                            />
                            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-600 font-bold text-sm">Search</button>
                        </div>
                    </form>

                    <div className="flex gap-4">
                        <div className="bg-white px-6 py-3 rounded-xl border border-gray-100 shadow-sm text-center">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Products</p>
                            <p className="text-lg font-bold text-indigo-600">{pagination.total}</p>
                        </div>
                    </div>
                </div>

                {/* Products Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="py-5 px-6 text-xs font-bold text-gray-400 uppercase tracking-widest">Product</th>
                                <th className="py-5 px-6 text-xs font-bold text-gray-400 uppercase tracking-widest">Category</th>
                                <th className="py-5 px-6 text-xs font-bold text-gray-400 uppercase tracking-widest">Price</th>
                                <th className="py-5 px-6 text-xs font-bold text-gray-400 uppercase tracking-widest">Tailor</th>
                                <th className="py-5 px-6 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                [1, 2, 3, 4, 5].map(n => (
                                    <tr key={n} className="animate-pulse">
                                        <td colSpan="5" className="p-6">
                                            <div className="h-4 bg-gray-100 rounded w-full"></div>
                                        </td>
                                    </tr>
                                ))
                            ) : products.length > 0 ? (
                                products.map((product) => (
                                    <tr key={product._id} className="hover:bg-gray-50/50 transition duration-200">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-200 overflow-hidden flex-shrink-0">
                                                    {product.images?.[0] ? (
                                                        <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-gray-300">N/A</div>
                                                    )}
                                                </div>
                                                <div className="truncate max-w-[200px]">
                                                    <p className="text-sm font-bold text-gray-900 truncate">{product.name}</p>
                                                    <p className="text-[10px] text-gray-400 truncate">{product._id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                                                {product.category}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <p className="text-sm font-bold text-gray-900">৳{product.price}</p>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-600">
                                                    {product.tailor?.fullName?.charAt(0) || 'T'}
                                                </div>
                                                <p className="text-xs font-medium text-gray-600">{product.tailor?.fullName || 'Unknown'}</p>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <button 
                                                onClick={() => handleDelete(product._id)}
                                                className="bg-red-50 text-red-600 text-[10px] font-bold px-3 py-1.5 rounded-lg hover:bg-red-600 hover:text-white transition shadow-sm border border-red-100"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="py-20 text-center text-gray-500 font-medium">No products found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-8">
                        {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(page => (
                            <button
                                key={page}
                                onClick={() => setPagination({ ...pagination, page })}
                                className={`w-8 h-8 rounded-lg text-xs font-bold transition ${pagination.page === page ? 'bg-indigo-600 text-white shadow-md' : 'bg-white border text-gray-600 hover:bg-gray-50'}`}
                            >
                                {page}
                            </button>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminProducts;
