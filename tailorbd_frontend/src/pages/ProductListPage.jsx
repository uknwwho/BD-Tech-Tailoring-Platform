import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ProductListPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });

    const API_URL = import.meta.env.VITE_API_URL;
    const user = JSON.parse(localStorage.getItem('tailortech_user'));
    const token = localStorage.getItem('tailortech_token');

    const categories = [
        'All',
        'Man: Shirt', 'Man: Pant', 'Man: Suit', 'Man: Panjabi', 'Man: Blazer', 'Man: Waistcoat',
        'Woman: Saree', 'Woman: Salwar Kameez', 'Woman: Lehanga', 'Woman: Kurti', 'Woman: Gown', 'Woman: Abaya/Burqa', 'Woman: Blouse', 'Woman: Petticoat',
        'Kids: Frock', 'Kids: Panjabi', 'Kids: Shirt', 'Kids: Pant', 'Kids: Suit/Tuxedo',
        'Other: Alterations', 'Other: Uniforms', 'Other: Wedding Special'
    ];

    useEffect(() => {
        fetchProducts();
        window.scrollTo(0, 0);
    }, [selectedCategory, pagination.page]);

    const fetchProducts = async (query = '') => {
        setLoading(true);
        try {
            let url = `${API_URL}/products?page=${pagination.page}&limit=12`;
            if (query) url += `&search=${query}`;
            if (selectedCategory !== 'All') url += `&category=${encodeURIComponent(selectedCategory)}`;

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

    const handleCategoryChange = (cat) => {
        setSelectedCategory(cat);
        setPagination({ ...pagination, page: 1 });
    };

    const handleDeleteProduct = async (e, id) => {
        e.preventDefault(); // Prevent navigation to detail page
        if (!window.confirm('Delete this product permanently?')) return;
        
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
        <div className="py-10 min-h-screen">
            {/* Header */}
            <div className="mb-12">
                <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
                    Product <span className="text-indigo-600">Catalogue</span>
                </h1>
                <p className="text-gray-500 max-w-xl text-lg">
                    Discover premium tailor-made apparel from top craftsmen across Bangladesh.
                </p>
            </div>

            {/* Filters & Search Bar */}
            <div className="flex flex-col lg:flex-row gap-6 mb-12">
                <form onSubmit={handleSearch} className="flex-1">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search products by name..."
                            className="flex-1 border border-gray-100 bg-white rounded-2xl px-6 py-4 outline-none focus:border-indigo-500 transition shadow-sm font-medium"
                        />
                        <button type="submit" className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-100">
                            Search
                        </button>
                    </div>
                </form>

                <div className="lg:w-72">
                    <select 
                        value={selectedCategory}
                        onChange={(e) => handleCategoryChange(e.target.value)}
                        className="w-full border border-gray-100 bg-white rounded-2xl px-6 py-4 outline-none focus:border-indigo-500 transition shadow-sm font-medium appearance-none"
                    >
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Category Quick Chips (Mobile/Tablet Friendly) */}
            <div className="flex gap-2 overflow-x-auto pb-6 mb-8 scrollbar-hide">
                {['All', 'Man: Shirt', 'Woman: Saree', 'Kids: Frock', 'Man: Panjabi'].map(cat => (
                    <button
                        key={cat}
                        onClick={() => handleCategoryChange(cat)}
                        className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap ${selectedCategory === cat ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-white text-gray-600 border border-gray-100 hover:border-indigo-300'}`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Products Grid */}
            {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(i => (
                        <div key={i} className="bg-white rounded-2xl p-4 border border-gray-100 animate-pulse">
                            <div className="h-48 bg-gray-200 rounded-xl mb-4"></div>
                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                            <div className="h-4 bg-gray-100 rounded w-1/2"></div>
                        </div>
                    ))}
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-5">
                        {products.map((product) => (
                            <Link
                                to={`/product/${product._id}`}
                                key={product._id}
                                className="bg-white rounded-[24px] border border-gray-50 shadow-sm overflow-hidden group hover:shadow-xl hover:border-indigo-100 transition-all duration-500 flex flex-col"
                            >
                                <div className="h-52 bg-gray-50 flex items-center justify-center p-3 relative overflow-hidden">
                                    {product.images && product.images.length > 0 ? (
                                        <img 
                                            src={product.images[0]} 
                                            alt={product.name} 
                                            className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-700" 
                                        />
                                    ) : (
                                        <div className="text-gray-300 flex flex-col items-center gap-2">
                                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                            <span className="text-[10px] font-bold uppercase tracking-widest">No Image</span>
                                        </div>
                                    )}
                                    <div className="absolute top-3 left-3">
                                        <span className="text-[10px] font-black text-indigo-700 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm border border-white/50">
                                            {product.category.includes(': ') ? product.category.split(': ')[1] : product.category}
                                        </span>
                                    </div>
                                    {user?.role === 'admin' && (
                                        <button 
                                            onClick={(e) => handleDeleteProduct(e, product._id)}
                                            className="absolute top-3 right-3 bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors z-10"
                                            title="Delete Product"
                                        >
                                            ✕
                                        </button>
                                    )}
                                </div>
                                <div className="p-4 flex-1 flex flex-col">
                                    <h3 className="font-bold text-gray-900 text-sm truncate mb-1 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{product.name}</h3>
                                    <p className="text-[11px] text-gray-400 mb-4 font-medium">By <span className="text-gray-600">{product.tailor?.fullName || 'Tailor'}</span></p>
                                    <div className="flex justify-between items-center mt-auto">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter leading-none">Price</span>
                                            <p className="text-lg font-black text-gray-900 leading-none mt-1">৳{product.price}</p>
                                        </div>
                                        <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7-7 7"></path></svg>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {products.length === 0 && (
                        <div className="text-center py-24 bg-white rounded-[40px] border border-dashed border-gray-100">
                            <div className="text-5xl mb-4">🧵</div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">No Products Found</h3>
                            <p className="text-gray-500">Try adjusting your search or category filters.</p>
                        </div>
                    )}

                    {/* Pagination */}
                    {pagination.pages > 1 && (
                        <div className="flex justify-center items-center gap-3 mt-16">
                            <button 
                                disabled={pagination.page === 1}
                                onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                                className="w-12 h-12 rounded-2xl border border-gray-100 flex items-center justify-center hover:bg-gray-50 disabled:opacity-30 transition-all font-bold"
                            >
                                ←
                            </button>
                            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(num => (
                                <button 
                                    key={num}
                                    onClick={() => setPagination({ ...pagination, page: num })}
                                    className={`w-12 h-12 rounded-2xl font-bold transition-all ${pagination.page === num ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-white text-gray-600 border border-gray-100 hover:border-indigo-300'}`}
                                >
                                    {num}
                                </button>
                            ))}
                            <button 
                                disabled={pagination.page === pagination.pages}
                                onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                                className="w-12 h-12 rounded-2xl border border-gray-100 flex items-center justify-center hover:bg-gray-50 disabled:opacity-30 transition-all font-bold"
                            >
                                →
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default ProductListPage;
