import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

const TailorDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [tailor, setTailor] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showComplaintModal, setShowComplaintModal] = useState(false);
    const [complaintData, setComplaintData] = useState({ type: 'tailor', title: '', description: '', targetProduct: '' });
    const [complaintMsg, setComplaintMsg] = useState('');

    const API_URL = import.meta.env.VITE_API_URL;
    const token = localStorage.getItem('tailortech_token');
    const user = JSON.parse(localStorage.getItem('tailortech_user'));

    useEffect(() => {
        fetchTailorDetail();
    }, [id]);

    const fetchTailorDetail = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/tailors/${id}`);
            const data = await res.json();
            if (data.success) {
                setTailor(data.tailor);
                setProducts(data.products);
            }
        } catch (error) {
            console.error("Error fetching tailor:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleComplaintSubmit = async (e) => {
        e.preventDefault();
        setComplaintMsg('');
        try {
            const res = await fetch(`${API_URL}/complaints`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...complaintData,
                    targetTailor: id,
                    targetProduct: complaintData.type === 'product' ? complaintData.targetProduct : undefined
                })
            });
            const data = await res.json();
            if (data.success) {
                setComplaintMsg('Complaint submitted successfully!');
                setComplaintData({ type: 'tailor', title: '', description: '', targetProduct: '' });
                setTimeout(() => setShowComplaintModal(false), 1500);
            } else {
                setComplaintMsg('Error: ' + data.message);
            }
        } catch (error) {
            setComplaintMsg('Failed to submit complaint.');
        }
    };

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <span key={i} className={`text-xl ${i <= Math.round(rating) ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
            );
        }
        return stars;
    };

    if (loading) {
        return (
            <div className="py-10 min-h-screen flex items-center justify-center">
                <div className="animate-pulse text-center">
                    <div className="w-28 h-28 bg-gray-200 rounded-full mx-auto mb-6"></div>
                    <div className="h-6 bg-gray-200 rounded w-48 mx-auto mb-3"></div>
                    <div className="h-4 bg-gray-100 rounded w-64 mx-auto"></div>
                </div>
            </div>
        );
    }

    if (!tailor) {
        return (
            <div className="py-10 min-h-screen flex items-center justify-center">
                <p className="text-gray-500 text-lg">Tailor not found.</p>
            </div>
        );
    }

    return (
        <div className="py-10 min-h-screen">
            {/* Back Link */}
            <Link to="/tailors" className="inline-flex items-center text-sm text-indigo-600 font-medium hover:text-indigo-800 mb-8 transition">
                ← Back to Tailors
            </Link>

            {/* Tailor Hero Section */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 md:p-10 mb-10">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                    {/* Avatar */}
                    {tailor.profileImage ? (
                        <img src={tailor.profileImage} alt={tailor.fullName} className="w-28 h-28 rounded-full object-cover border-4 border-indigo-100 shrink-0" />
                    ) : (
                        <div className="w-28 h-28 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold border-4 border-indigo-100 shrink-0">
                            {tailor.fullName.charAt(0).toUpperCase()}
                        </div>
                    )}

                    {/* Info */}
                    <div className="flex-1 text-center md:text-left">
                        <h1 className="text-3xl font-black text-gray-900 mb-2">{tailor.fullName}</h1>
                        <div className="flex items-center justify-center md:justify-start gap-1 mb-3">
                            {renderStars(tailor.rating)}
                            <span className="text-sm text-gray-500 ml-2">({tailor.totalRatings} reviews)</span>
                        </div>
                        <p className="text-gray-600 mb-4 max-w-xl">
                            {tailor.bio || 'Expert tailor with years of experience in premium craftsmanship.'}
                        </p>
                        <div className="flex flex-wrap gap-3 justify-center md:justify-start text-sm text-gray-500">
                            <span className="bg-gray-100 px-3 py-1 rounded-full">📧 {tailor.email}</span>
                            <span className="bg-gray-100 px-3 py-1 rounded-full">📞 {tailor.phone}</span>
                            <span className="bg-gray-100 px-3 py-1 rounded-full">📅 Joined {new Date(tailor.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>

                    {/* Complaint Button */}
                    {user && user.role === 'customer' && (
                        <button
                            onClick={() => setShowComplaintModal(true)}
                            className="bg-red-50 text-red-600 border border-red-200 px-5 py-2 rounded-xl text-sm font-medium hover:bg-red-100 transition shrink-0"
                        >
                            ⚠ File Complaint
                        </button>
                    )}
                </div>
            </div>

            {/* Products Section */}
            <div className="mb-20">
                <div className="flex items-center justify-between mb-10 border-b border-gray-100 pb-6">
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">
                        Product <span className="text-indigo-600">Collection</span>
                        <span className="ml-3 text-sm font-bold bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full border border-indigo-100">
                            {products.length} Items
                        </span>
                    </h2>
                    <div className="flex gap-2">
                        {/* Filter placeholders if needed later */}
                    </div>
                </div>

                {products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
                        {products.map((product) => (
                            <div 
                                key={product._id} 
                                className="group cursor-pointer"
                                onClick={() => navigate(`/product/${product._id}`)}
                            >
                                {/* Image Wrapper */}
                                <div className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-gray-50 mb-5 shadow-sm transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-indigo-100 group-hover:-translate-y-2">
                                    {product.images && product.images.length > 0 ? (
                                        <img 
                                            src={product.images[0]} 
                                            alt={product.name} 
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                                            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                        </div>
                                    )}

                                    {/* Category Overlay */}
                                    <div className="absolute top-4 left-4">
                                        <span className="bg-white/90 backdrop-blur-md text-gray-900 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-sm border border-white/20">
                                            {product.category}
                                        </span>
                                    </div>

                                    {/* Hover Action Overlay */}
                                    <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <button className="w-full bg-white text-gray-900 font-bold py-3 rounded-2xl text-sm shadow-xl hover:bg-gray-100 transition-colors">
                                            View Details
                                        </button>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="px-2">
                                    <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors truncate">
                                        {product.name}
                                    </h3>
                                    <p className="text-sm text-gray-500 line-clamp-2 mb-4 h-10 leading-relaxed">
                                        {product.description}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-2xl font-black text-gray-900 tracking-tight">
                                            <span className="text-sm font-medium text-gray-400 mr-1">BDT</span>
                                            {product.price}
                                        </span>
                                        <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 group-hover:border-indigo-600 group-hover:text-indigo-600 transition-colors">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"></path></svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-gray-50 rounded-2xl p-10 text-center border border-gray-100">
                        <p className="text-gray-500 font-medium">This tailor hasn't added any products yet.</p>
                    </div>
                )}
            </div>

            {/* Complaint Modal */}
            {showComplaintModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-900">File a Complaint</h3>
                            <button onClick={() => setShowComplaintModal(false)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
                        </div>

                        {complaintMsg && (
                            <div className={`mb-4 p-3 rounded-lg text-sm font-medium ${complaintMsg.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                {complaintMsg}
                            </div>
                        )}

                        <form onSubmit={handleComplaintSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">Complaint Type</label>
                                <select
                                    value={complaintData.type}
                                    onChange={(e) => setComplaintData({ ...complaintData, type: e.target.value })}
                                    className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-indigo-500"
                                >
                                    <option value="tailor">Against Tailor</option>
                                    <option value="product">Against Product</option>
                                </select>
                            </div>

                            {complaintData.type === 'product' && products.length > 0 && (
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">Select Product</label>
                                    <select
                                        value={complaintData.targetProduct}
                                        onChange={(e) => setComplaintData({ ...complaintData, targetProduct: e.target.value })}
                                        required
                                        className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-indigo-500"
                                    >
                                        <option value="">Choose a product...</option>
                                        {products.map(p => (
                                            <option key={p._id} value={p._id}>{p.name}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">Title</label>
                                <input
                                    type="text" required
                                    value={complaintData.title}
                                    onChange={(e) => setComplaintData({ ...complaintData, title: e.target.value })}
                                    className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-indigo-500"
                                    placeholder="Brief summary of the issue"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">Description</label>
                                <textarea
                                    required rows={4}
                                    value={complaintData.description}
                                    onChange={(e) => setComplaintData({ ...complaintData, description: e.target.value })}
                                    className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-indigo-500 resize-none"
                                    placeholder="Describe your complaint in detail..."
                                />
                            </div>
                            <button type="submit" className="w-full bg-red-600 text-white font-bold py-3 rounded-xl hover:bg-red-700 transition">
                                Submit Complaint
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TailorDetailPage;
