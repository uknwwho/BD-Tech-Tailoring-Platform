import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const TailorListPage = () => {
    const [tailors, setTailors] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    const API_URL = `${import.meta.env.VITE_API_URL}/tailors`;

    useEffect(() => {
        fetchTailors();
    }, []);

    const fetchTailors = async (query = '') => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}?search=${query}`);
            const data = await res.json();
            if (data.success) setTailors(data.tailors);
        } catch (error) {
            console.error("Error fetching tailors:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchTailors(search);
    };

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <span key={i} className={`text-lg ${i <= Math.round(rating) ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
            );
        }
        return stars;
    };

    return (
        <div className="py-10 min-h-screen">
            {/* Hero Header */}
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
                    Our Expert <span className="text-indigo-600">Tailors</span>
                </h1>
                <p className="text-gray-500 max-w-xl mx-auto text-lg">
                    Browse our curated network of professional tailors. Find the perfect craftsman for your needs.
                </p>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-lg mx-auto mb-12">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search tailors by name..."
                        className="flex-1 border border-gray-200 rounded-xl px-5 py-3 outline-none focus:border-indigo-500 transition shadow-sm text-sm"
                    />
                    <button type="submit" className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-indigo-700 transition shadow-sm text-sm">
                        Search
                    </button>
                </div>
            </form>

            {/* Loading State */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm animate-pulse">
                            <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4"></div>
                            <div className="h-5 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
                            <div className="h-4 bg-gray-100 rounded w-1/2 mx-auto mb-4"></div>
                            <div className="h-3 bg-gray-100 rounded w-full mb-2"></div>
                            <div className="h-3 bg-gray-100 rounded w-5/6"></div>
                        </div>
                    ))}
                </div>
            ) : (
                /* Tailor Cards Grid */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tailors.map((tailor) => (
                        <Link
                            to={`/tailors/${tailor._id}`}
                            key={tailor._id}
                            className="group bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all duration-300 hover:-translate-y-1"
                        >
                            {/* Avatar */}
                            <div className="flex justify-center mb-4">
                                {tailor.profileImage ? (
                                    <img src={tailor.profileImage} alt={tailor.fullName} className="w-20 h-20 rounded-full object-cover border-4 border-indigo-100 group-hover:border-indigo-300 transition" />
                                ) : (
                                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold border-4 border-indigo-100 group-hover:border-indigo-300 transition">
                                        {tailor.fullName.charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>

                            {/* Name & Rating */}
                            <h3 className="text-lg font-bold text-gray-900 text-center mb-1 group-hover:text-indigo-700 transition">
                                {tailor.fullName}
                            </h3>
                            <div className="flex justify-center items-center gap-1 mb-3">
                                {renderStars(tailor.rating)}
                                <span className="text-xs text-gray-500 ml-1">({tailor.totalRatings})</span>
                            </div>

                            {/* Bio */}
                            <p className="text-sm text-gray-500 text-center line-clamp-2 mb-4">
                                {tailor.bio || 'Expert tailor ready to serve you with premium craftsmanship.'}
                            </p>

                            {/* CTA */}
                            <div className="text-center">
                                <span className="inline-block text-xs font-bold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-full group-hover:bg-indigo-600 group-hover:text-white transition">
                                    View Profile →
                                </span>
                            </div>
                        </Link>
                    ))}

                    {tailors.length === 0 && (
                        <div className="col-span-full text-center py-16">
                            <p className="text-gray-500 text-lg font-medium">No tailors found.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default TailorListPage;
