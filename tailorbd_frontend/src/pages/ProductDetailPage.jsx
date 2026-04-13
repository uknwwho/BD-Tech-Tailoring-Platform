import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const ProductDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(0);
    const [showComplaintModal, setShowComplaintModal] = useState(false);
    const [complaintData, setComplaintData] = useState({ title: '', description: '' });
    const [complaintMsg, setComplaintMsg] = useState('');

    const API_URL = import.meta.env.VITE_API_URL;
    const token = localStorage.getItem('tailortech_token');
    const user = JSON.parse(localStorage.getItem('tailortech_user'));

    useEffect(() => {
        fetchProductDetail();
        window.scrollTo(0, 0);
    }, [id]);

    const fetchProductDetail = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/products/${id}`);
            const data = await res.json();
            if (data.success) {
                setProduct(data.product);
            }
        } catch (error) {
            console.error("Error fetching product:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleComplaintSubmit = async (e) => {
        e.preventDefault();
        setComplaintMsg('');
        if (!user) {
            alert("Please login to file a complaint.");
            return;
        }
        try {
            const res = await fetch(`${API_URL}/complaints`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...complaintData,
                    type: 'product',
                    targetProduct: id,
                    targetTailor: product.tailor._id
                })
            });
            const data = await res.json();
            if (data.success) {
                setComplaintMsg('Complaint submitted successfully!');
                setComplaintData({ title: '', description: '' });
                setTimeout(() => setShowComplaintModal(false), 1500);
            } else {
                setComplaintMsg('Error: ' + data.message);
            }
        } catch (error) {
            setComplaintMsg('Failed to submit complaint.');
        }
    };

    const handleDeleteProduct = async () => {
        if (!window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) return;
        
        try {
            const res = await fetch(`${API_URL}/products/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await res.json();
            if (data.success) {
                alert('Product deleted successfully');
                navigate('/products');
            } else {
                alert('Error: ' + data.message);
            }
        } catch (error) {
            alert('Failed to delete product');
        }
    };

    if (loading) {
        return (
            <div className="py-20 min-h-screen flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="w-64 h-80 bg-gray-200 rounded-3xl mb-8"></div>
                    <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
                    <div className="h-4 bg-gray-100 rounded w-64"></div>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="py-20 min-h-screen flex flex-col items-center justify-center text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
                <p className="text-gray-500 mb-8">The product you are looking for doesn't exist or has been removed.</p>
                <Link to="/tailors" className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-indigo-200">
                    Browse All Tailors
                </Link>
            </div>
        );
    }

    return (
        <div className="py-10 min-h-screen">
            {/* Breadcrumbs / Back button */}
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
                <Link to="/" className="hover:text-indigo-600 transition">Home</Link>
                <span>/</span>
                <Link to="/tailors" className="hover:text-indigo-600 transition">Tailors</Link>
                <span>/</span>
                <Link to={`/tailors/${product.tailor._id}`} className="hover:text-indigo-600 transition">{product.tailor.fullName}</Link>
                <span>/</span>
                <span className="text-gray-900 font-medium truncate max-w-[150px]">{product.name}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20">
                {/* Left: Image Gallery */}
                <div className="space-y-6">
                    <div className="aspect-[3/4] rounded-[40px] overflow-hidden bg-gray-50 shadow-2xl shadow-gray-200/50 border border-gray-100">
                        {product.images && product.images.length > 0 ? (
                            <img 
                                src={product.images[activeImage]} 
                                alt={product.name} 
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                                <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                            </div>
                        )}
                    </div>

                    {/* Thumbnails */}
                    {product.images && product.images.length > 1 && (
                        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                            {product.images.map((img, idx) => (
                                <button 
                                    key={idx}
                                    onClick={() => setActiveImage(idx)}
                                    className={`relative w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${activeImage === idx ? 'border-indigo-600 scale-95 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'}`}
                                >
                                    <img src={img} alt="" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right: Product Details */}
                <div className="flex flex-col">
                    <div className="mb-6">
                        <span className="inline-block bg-indigo-50 text-indigo-700 text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full mb-4 border border-indigo-100">
                            {product.category}
                        </span>
                        <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-4">
                            {product.name}
                        </h1>
                        <div className="flex items-end gap-3 mb-8">
                            <span className="text-4xl font-black text-indigo-600">৳{product.price}</span>
                            <span className="text-gray-400 text-sm font-medium mb-1">Tax Included</span>
                        </div>
                    </div>

                    <div className="prose prose-indigo mb-10">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Description</h3>
                        <p className="text-gray-600 leading-relaxed text-lg">
                            {product.description}
                        </p>
                    </div>

                    {/* Tailor Info Card */}
                    <div className="bg-gray-50 rounded-[32px] p-6 border border-gray-100 mb-10">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full overflow-hidden bg-indigo-100 border-2 border-white shadow-sm">
                                {product.tailor.profileImage ? (
                                    <img src={product.tailor.profileImage} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-indigo-600 font-bold text-xl">
                                        {product.tailor.fullName.charAt(0)}
                                    </div>
                                )}
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-gray-900 text-lg">Crafted by {product.tailor.fullName}</h4>
                                <div className="flex items-center gap-2">
                                    <span className="text-yellow-400">★</span>
                                    <span className="text-sm font-bold text-gray-700">{product.tailor.rating}</span>
                                    <span className="text-sm text-gray-400 font-medium whitespace-nowrap">({product.tailor.totalRatings} reviews)</span>
                                </div>
                            </div>
                            <Link 
                                to={`/tailors/${product.tailor._id}`}
                                className="bg-white text-gray-900 text-sm font-bold px-5 py-3 rounded-2xl border border-gray-100 hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                            >
                                View Profile
                            </Link>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-auto">
                        <button 
                            onClick={() => {
                                addToCart(product);
                                navigate('/cart');
                            }}
                            className="flex items-center justify-center gap-3 bg-gray-900 text-white font-bold py-5 rounded-[24px] hover:bg-indigo-600 transition-all shadow-xl shadow-gray-200"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                            Buy Now
                        </button>
                        <button 
                            onClick={() => addToCart(product)}
                            className="flex items-center justify-center gap-3 bg-white text-indigo-600 border-2 border-indigo-50 font-bold py-5 rounded-[24px] hover:bg-indigo-50 transition-all hover:border-indigo-100"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                            Add to Cart
                        </button>
                    </div>

                    {/* Admin Actions */}
                    {user?.role === 'admin' && (
                        <div className="mt-8 pt-8 border-t border-gray-100">
                            <h4 className="text-xs font-black text-red-500 uppercase tracking-widest mb-4">Admin Controls</h4>
                            <button 
                                onClick={handleDeleteProduct}
                                className="w-full bg-red-50 text-red-600 font-bold py-4 rounded-[24px] hover:bg-red-600 hover:text-white transition-all border border-red-100"
                            >
                                Delete Product Permanently
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Product Complaint Modal */}
            {showComplaintModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-[32px] p-8 w-full max-w-md shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="text-2xl font-black text-gray-900">Submit Report</h3>
                                <p className="text-sm text-gray-500 font-medium">For product: {product.name}</p>
                            </div>
                            <button onClick={() => setShowComplaintModal(false)} className="bg-gray-100 text-gray-400 hover:text-gray-900 w-10 h-10 rounded-full flex items-center justify-center transition-colors">✕</button>
                        </div>

                        {complaintMsg && (
                            <div className={`mb-6 p-4 rounded-2xl text-sm font-bold ${complaintMsg.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                {complaintMsg}
                            </div>
                        )}

                        <form onSubmit={handleComplaintSubmit} className="space-y-5">
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Subject</label>
                                <input
                                    type="text" required
                                    value={complaintData.title}
                                    onChange={(e) => setComplaintData({ ...complaintData, title: e.target.value })}
                                    className="w-full border border-gray-100 bg-gray-50 rounded-2xl p-4 text-sm outline-none focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 transition-all font-medium"
                                    placeholder="Issue summary"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Details</label>
                                <textarea
                                    required rows={5}
                                    value={complaintData.description}
                                    onChange={(e) => setComplaintData({ ...complaintData, description: e.target.value })}
                                    className="w-full border border-gray-100 bg-gray-50 rounded-2xl p-4 text-sm outline-none focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 transition-all font-medium resize-none"
                                    placeholder="Tell us what happened..."
                                />
                            </div>
                            <button type="submit" className="w-full bg-red-600 text-white font-black py-4 rounded-2xl hover:bg-red-700 transition shadow-xl shadow-red-100">
                                Send Report
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductDetailPage;
