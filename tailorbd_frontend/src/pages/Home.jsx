import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Home = () => {
    const [activeBanners, setActiveBanners] = useState([]);
    const [activePromotions, setActivePromotions] = useState([]);
    const [featuredTailors, setFeaturedTailors] = useState([]);
    const [latestProducts, setLatestProducts] = useState([]);


    // New state to track which banner is currently visible in the carousel
    const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
    const [loadingProducts, setLoadingProducts] = useState(true);

    // const API_URL = 'http://localhost:5000/api/cms';
    const API_URL = import.meta.env.VITE_API_URL;


    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('tailortech_token');
        if (!token) {
            // If no token is found in the browser, instantly kick them to the login page
            navigate('/login');
        }
    }, [navigate]);


    // 1. Fetch data on mount
    useEffect(() => {
        const fetchPublicData = async () => {
            try {
                const bannerRes = await fetch(`${API_URL}/banners`);
                const bannerData = await bannerRes.json();
                if (bannerData.success) {
                    setActiveBanners(bannerData.banners.filter(b => b.active));
                }

                const promoRes = await fetch(`${API_URL}/promotions`);
                const promoData = await promoRes.json();
                if (promoData.success) {
                    setActivePromotions(promoData.promotions.filter(p => p.status === 'Active'));
                }

                //const tailorRes = await fetch(`${API_URL}/tailors`);
                // const tailorRes = await fetch('http://localhost:5000/api/tailors');
                const tailorRes = await fetch(`${API_URL}/tailors`);
                const tailorData = await tailorRes.json();
                if (tailorData.success) {
                    setFeaturedTailors(tailorData.tailors.slice(0, 6));
                }

                //const productRes = await fetch(`${API_URL}/products?limit=10`);
                // const productRes = await fetch('http://localhost:5000/api/products?limit=10');
                const productRes = await fetch(`${API_URL}/products?limit=10`);
                const productData = await productRes.json();
                if (productData.success) {
                    setLatestProducts(productData.products);
                }


            } catch (error) {
                console.error("Failed to load public data:", error);
            } finally {
                setLoadingProducts(false);
            }
        };

        fetchPublicData();
    }, []);

    // 2. Auto-play functionality for the carousel
    useEffect(() => {
        if (activeBanners.length <= 1) return;

        const timer = setInterval(() => {
            setCurrentBannerIndex((prevIndex) =>
                (prevIndex + 1) % activeBanners.length
            );
        }, 4000); // Changes image every 4 seconds

        // Cleanup interval if the user leaves the page
        return () => clearInterval(timer);
    }, [activeBanners.length]);

    // 3. Manual navigation handlers
    const nextBanner = () => {
        setCurrentBannerIndex((prevIndex) => (prevIndex + 1) % activeBanners.length);
    };

    const prevBanner = () => {
        setCurrentBannerIndex((prevIndex) => (prevIndex === 0 ? activeBanners.length - 1 : prevIndex - 1));
    };

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <span key={i} className={`${i <= Math.round(rating) ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
            );
        }
        return stars;
    };


    return (
        <div className="py-10 min-h-screen">

            {/* 1. Dynamic Auto-Swiping Carousel Area */}
            <div className="mb-16 relative w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-lg group bg-gray-100">
                {activeBanners.length > 0 ? (
                    <>
                        {/* Swiping Image Container */}
                        <div
                            className="flex transition-transform duration-700 ease-in-out h-full w-full"
                            style={{ transform: `translateX(-${currentBannerIndex * 100}%)` }}
                        >
                            {activeBanners.map((banner) => (
                                <div key={banner._id} className="min-w-full h-full relative shrink-0">
                                    <img
                                        src={banner.image}
                                        alt={banner.title}
                                        className="w-full h-full object-cover"
                                    />
                                    {/* <div className="absolute inset-0 bg-black/30 flex flex-col justify-end p-8 md:p-12">
                                        <h2 className="text-white text-4xl md:text-5xl font-bold drop-shadow-lg mb-2">
                                            {banner.title}
                                        </h2>
                                    </div> */}
                                </div>
                            ))}
                        </div>

                        {/* Left / Right Navigation Buttons (Visible on Hover) */}
                        {activeBanners.length > 1 && (
                            <>
                                <button
                                    onClick={prevBanner}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/50 hover:bg-white text-gray-800 p-3 rounded-full shadow-md backdrop-blur-sm transition opacity-0 group-hover:opacity-100 z-10"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7"></path>
                                    </svg>
                                </button>

                                <button
                                    onClick={nextBanner}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/50 hover:bg-white text-gray-800 p-3 rounded-full shadow-md backdrop-blur-sm transition opacity-0 group-hover:opacity-100 z-10"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7"></path>
                                    </svg>
                                </button>

                                {/* Bottom Indicator Dots */}
                                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                                    {activeBanners.map((_, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setCurrentBannerIndex(idx)}
                                            className={`w-3 h-3 rounded-full transition-all shadow-sm ${currentBannerIndex === idx ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/80'}`}
                                        ></button>
                                    ))}
                                </div>
                            </>
                        )}
                    </>
                ) : (
                    <div className="w-full h-full flex items-center justify-center border border-gray-200">
                        <p className="text-gray-500 text-lg font-medium">Welcome to BD Tech Tailoring.</p>
                    </div>
                )}
            </div>


            {/* 2. Featured Tailors Section */}
            {featuredTailors.length > 0 && (
                <div className="mb-16">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Our Expert Tailors</h2>
                        <Link to="/tailors" className="text-indigo-600 font-medium text-sm hover:text-indigo-800 transition">
                            View All →
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                        {featuredTailors.map((tailor) => (
                            <Link
                                to={`/tailors/${tailor._id}`}
                                key={tailor._id}
                                className="group bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-lg hover:border-indigo-200 transition-all duration-300 text-center"
                            >
                                {tailor.profileImage ? (
                                    <img src={tailor.profileImage} alt={tailor.fullName} className="w-16 h-16 rounded-full object-cover mx-auto mb-3 border-2 border-indigo-100 group-hover:border-indigo-300 transition" />
                                ) : (
                                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold mx-auto mb-3 border-2 border-indigo-100 group-hover:border-indigo-300 transition">
                                        {tailor.fullName.charAt(0).toUpperCase()}
                                    </div>
                                )}
                                <h3 className="text-sm font-bold text-gray-900 truncate group-hover:text-indigo-700 transition">{tailor.fullName}</h3>
                                <div className="flex justify-center items-center gap-0.5 mt-1 text-xs">
                                    {renderStars(tailor.rating)}
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* 2.5 New Arrivals - Product List */}
            <div className="mb-16">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">New Arrivals</h2>
                </div>

                {loadingProducts ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="bg-white rounded-xl p-3 border border-gray-100 animate-pulse">
                                <div className="h-44 bg-gray-200 rounded-lg mb-3"></div>
                                <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
                                <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                            </div>
                        ))}
                    </div>
                ) : latestProducts.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {latestProducts.map((product) => (
                            <Link
                                to={`/product/${product._id}`}
                                key={product._id}
                                className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden group hover:shadow-md transition-all duration-300 flex flex-col"
                            >
                                <div className="h-44 bg-gray-50 flex items-center justify-center p-2 relative overflow-hidden">
                                    {product.images && product.images.length > 0 ? (
                                        <img
                                            src={product.images[0]}
                                            alt={product.name}
                                            className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="text-gray-400 text-xs">No Image</div>
                                    )}
                                    <div className="absolute top-2 left-2">
                                        <span className="text-[10px] font-bold text-indigo-600 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full shadow-sm">
                                            {product.category.includes(': ') ? product.category.split(': ')[1] : product.category}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-3">
                                    <h3 className="font-bold text-gray-900 text-xs truncate mb-1">{product.name}</h3>
                                    <p className="text-[10px] text-gray-500 mb-2 truncate">By {product.tailor?.fullName || 'Tailor'}</p>
                                    <div className="flex justify-between items-center mt-auto">
                                        <p className="text-sm font-black text-indigo-600">৳{product.price}</p>
                                        <span className="text-[10px] font-bold text-indigo-600 group-hover:underline">
                                            Details
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        <p className="text-gray-500 text-sm font-medium">No products listed yet.</p>
                    </div>
                )}
            </div>


            {/* 3. Active Promotions Area */}
            {activePromotions.length > 0 && (
                <div className="mb-16">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Current Offers</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {activePromotions.map(promo => (
                            <div key={promo._id} className="bg-indigo-50 border border-indigo-100 p-6 rounded-xl shadow-sm text-center">
                                <h3 className="text-lg font-bold text-gray-900">{promo.name}</h3>
                                <p className="text-indigo-600 font-extrabold text-3xl my-3">{promo.discountPercentage}% OFF</p>
                                <div className="bg-white py-2 px-4 rounded border border-dashed border-indigo-300 inline-block mb-3">
                                    <span className="font-mono text-indigo-800 font-bold uppercase tracking-wider">{promo.code}</span>
                                </div>
                                <p className="text-xs text-gray-500">Valid until {new Date(promo.validUntil).toLocaleDateString()}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

        </div>
    );
};

export default Home;