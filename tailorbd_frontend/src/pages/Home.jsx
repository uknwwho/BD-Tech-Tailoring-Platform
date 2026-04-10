import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const [activeBanners, setActiveBanners] = useState([]);
    const [activePromotions, setActivePromotions] = useState([]);

    // New state to track which banner is currently visible in the carousel
    const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

    const API_URL = 'http://localhost:5000/api/cms';

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
            } catch (error) {
                console.error("Failed to load public data:", error);
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

            {/* 2. Active Promotions Area */}
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