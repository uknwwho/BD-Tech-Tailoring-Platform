import React, { useState, useEffect } from 'react';

export default function CMSDashboard() {
    // State ready to be populated from MongoDB
    const [banners, setBanners] = useState([
        { _id: 'b1', title: 'Eid Mega Sale', image: 'Eid Collection', active: true, uploadDate: '2026-10-12' },
        { _id: 'b2', title: 'Winter Collection', image: 'Winter Suits', active: false, uploadDate: '2026-09-05' }
    ]);

    const [promotions, setPromotions] = useState([
        { _id: 'p1', name: 'New Customer Discount', code: 'WELCOME20', validUntil: '2026-12-31', status: 'Active' },
        { _id: 'p2', name: 'Wedding Season Combo', code: 'WEDDING15', validUntil: '2026-11-01', status: 'Expired' }
    ]);

    // Placeholder for MongoDB Fetch
    useEffect(() => {
        // async function fetchData() {
        //   const res = await fetch('/api/cms/content');
        //   const data = await res.json();
        //   setBanners(data.banners);
        //   setPromotions(data.promotions);
        // }
        // fetchData();
    }, []);

    const handleToggleBanner = async (id, currentStatus) => {
        // Optimistic UI update
        setBanners(banners.map(b => b._id === id ? { ...b, active: !currentStatus } : b));

        // MongoDB Update logic goes here
        // await fetch(`/api/cms/banners/${id}`, { method: 'PATCH', body: JSON.stringify({ active: !currentStatus }) });
    };

    const handleDeletePromo = async (id) => {
        setPromotions(promotions.filter(p => p._id !== id));
        // await fetch(`/api/cms/promotions/${id}`, { method: 'DELETE' });
    };

    return (
        <div className="flex-1 p-8 bg-gray-50 h-screen overflow-y-auto font-sans text-gray-800">
            <header className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Content Management</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage homepage banners, promotions, and platform content.</p>
                </div>
                <button className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg shadow-sm hover:bg-indigo-700 font-medium transition">
                    + Add New Content
                </button>
            </header>

            {/* Banners Section */}
            <section className="mb-12">
                <h2 className="text-xl font-semibold mb-6 flex items-center">
                    Homepage Banners
                    <span className="ml-3 px-2.5 py-0.5 bg-gray-200 text-gray-700 text-xs rounded-full">
                        {banners.filter(b => b.active).length} Active
                    </span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {banners.map((banner) => (
                        <div key={banner._id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                            <div className={`h-32 rounded-lg flex items-center justify-center font-medium mb-4 ${banner.active ? 'bg-indigo-100 text-indigo-400 border-2 border-dashed border-indigo-200' : 'bg-gray-100 text-gray-400'}`}>
                                [ {banner.image} ]
                            </div>
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="font-medium text-gray-900">{banner.title}</h3>
                                    <p className="text-xs text-gray-500 mt-0.5">Uploaded: {banner.uploadDate}</p>
                                </div>
                                <button
                                    onClick={() => handleToggleBanner(banner._id, banner.active)}
                                    className={`w-10 h-5 rounded-full relative cursor-pointer shadow-inner transition-colors ${banner.active ? 'bg-green-500' : 'bg-gray-300'}`}
                                >
                                    <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 shadow transition-transform ${banner.active ? 'left-5' : 'left-0.5'}`}></div>
                                </button>
                            </div>
                        </div>
                    ))}

                    {/* Upload Placeholder */}
                    <div className="bg-gray-50 p-5 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-100 cursor-pointer transition min-h-[200px]">
                        <svg className="w-8 h-8 mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                        <span className="font-medium">Upload Banner</span>
                        <span className="text-xs mt-1">PNG, JPG up to 5MB</span>
                    </div>
                </div>
            </section>

            {/* Promotions Table */}
            <section>
                <h2 className="text-xl font-semibold mb-6">Active Promotions & Offers</h2>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Offer Name</th>
                                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Promo Code</th>
                                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Valid Until</th>
                                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {promotions.map((promo) => (
                                <tr key={promo._id} className="hover:bg-gray-50 transition">
                                    <td className="py-4 px-6 text-sm font-medium text-gray-900">{promo.name}</td>
                                    <td className="py-4 px-6 text-sm"><span className="bg-indigo-50 text-indigo-700 py-1 px-2 rounded font-mono text-xs border border-indigo-100">{promo.code}</span></td>
                                    <td className="py-4 px-6 text-sm text-gray-500">{promo.validUntil}</td>
                                    <td className="py-4 px-6 text-sm">
                                        <span className={`py-1 px-2.5 rounded-full text-xs font-medium ${promo.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                            {promo.status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-sm text-right">
                                        <button className="text-indigo-600 font-medium hover:text-indigo-800 mr-3">Edit</button>
                                        <button onClick={() => handleDeletePromo(promo._id)} className="text-red-500 font-medium hover:text-red-700">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}