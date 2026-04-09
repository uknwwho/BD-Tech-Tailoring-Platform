import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';

const CMSDashboard = () => {
    const [banners, setBanners] = useState([]);
    const [promotions, setPromotions] = useState([]);
    const [newPromo, setNewPromo] = useState({
        name: '', code: '', discountPercentage: '', validUntil: '', status: 'Active'
    });

    const API_URL = 'http://localhost:5000/api/cms';

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const bannerRes = await fetch(`${API_URL}/banners`);
            const bannerData = await bannerRes.json();
            if (bannerData.success) setBanners(bannerData.banners);

            const promoRes = await fetch(`${API_URL}/promotions`);
            const promoData = await promoRes.json();
            if (promoData.success) setPromotions(promoData.promotions);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    // BANNER HANDLERS
    // const handleImageUpload = (e) => {
    //     const file = e.target.files[0];
    //     if (!file) return;

    //     const reader = new FileReader();
    //     reader.onloadend = async () => {
    //         const base64Image = reader.result;
    //         try {
    //             const res = await fetch(`${API_URL}/banners`, {
    //                 method: 'POST',
    //                 headers: { 'Content-Type': 'application/json' },
    //                 body: JSON.stringify({
    //                     title: file.name,
    //                     image: base64Image,
    //                     active: true
    //                 })
    //             });
    //             const data = await res.json();
    //             if (data.success) fetchData();
    //         } catch (error) {
    //             console.error("Upload error:", error);
    //         }
    //     };
    //     reader.readAsDataURL(file);
    // };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Create a FormData object to hold the file and text
        const formData = new FormData();
        formData.append('image', file);
        formData.append('title', file.name);
        formData.append('active', true);

        try {
            const res = await fetch(`${API_URL}/banners`, {
                method: 'POST',
                // IMPORTANT: Do NOT set 'Content-Type': 'application/json' when sending FormData.
                // The browser will automatically set the correct headers for file uploads.
                body: formData
            });

            const data = await res.json();
            if (data.success) {
                fetchData(); // Refresh the list
            }

        } catch (error) {
            console.error("Upload error:", error);
        }
    };

    const toggleBanner = async (id, currentStatus) => {
        try {
            const res = await fetch(`${API_URL}/banners/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ active: !currentStatus })
            });
            const data = await res.json();
            if (data.success) fetchData();
        } catch (error) {
            console.error("Toggle error:", error);
        }
    };

    const deleteBanner = async (id) => {
        try {
            const res = await fetch(`${API_URL}/banners/${id}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.success) fetchData();
        } catch (error) {
            console.error("Delete error:", error);
        }
    };

    // PROMOTION HANDLERS
    const handleAddPromotion = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_URL}/promotions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newPromo)
            });
            const data = await res.json();
            if (data.success) {
                fetchData();
                setNewPromo({ name: '', code: '', discountPercentage: '', validUntil: '', status: 'Active' });
            }
        } catch (error) {
            console.error("Add promo error:", error);
        }
    };

    const togglePromoStatus = async (id, currentStatus) => {
        const newStatus = currentStatus === 'Active' ? 'Expired' : 'Active';
        try {
            const res = await fetch(`${API_URL}/promotions/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            const data = await res.json();
            if (data.success) fetchData();
        } catch (error) {
            console.error("Toggle promo error:", error);
        }
    };

    const deletePromo = async (id) => {
        try {
            const res = await fetch(`${API_URL}/promotions/${id}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.success) fetchData();
        } catch (error) {
            console.error("Delete promo error:", error);
        }
    };

    // ==========================================
    // FULL SCREEN LAYOUT STARTS HERE
    // ==========================================
    return (
        <div className="flex h-screen bg-gray-50 font-sans text-gray-800 w-full overflow-hidden">

            {/* Reusable Sidebar */}
            <AdminSidebar />

            {/* Main Content Area */}
            <main className="flex-1 p-8 md:p-10 overflow-y-auto w-full">
                <header className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Content Management</h1>
                        <p className="text-sm text-gray-500 mt-1">Manage homepage banners, promotions, and platform content.</p>
                    </div>
                </header>

                {/* Homepage Banners Section */}
                <section className="mb-12">
                    <h2 className="text-xl font-semibold mb-6 flex items-center">
                        Homepage Banners
                        <span className="ml-3 px-2.5 py-0.5 bg-gray-200 text-gray-700 text-xs rounded-full">
                            {banners.filter(b => b.active).length} Active
                        </span>
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {banners.map((banner) => (
                            <div key={banner._id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col">
                                <div className="h-32 bg-gray-100 rounded-lg overflow-hidden mb-4 border border-gray-200">
                                    <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex justify-between items-end mt-auto">
                                    <div className="truncate pr-2">
                                        <h3 className="font-medium text-gray-900 truncate" title={banner.title}>{banner.title}</h3>
                                        <p className="text-xs text-gray-500 mt-0.5">
                                            {new Date(banner.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <div
                                            onClick={() => toggleBanner(banner._id, banner.active)}
                                            className={`w-10 h-5 rounded-full relative cursor-pointer shadow-inner transition-colors ${banner.active ? 'bg-green-500' : 'bg-gray-300'}`}
                                        >
                                            <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 shadow transition-all ${banner.active ? 'left-5' : 'left-0.5'}`}></div>
                                        </div>
                                        <button onClick={() => deleteBanner(banner._id)} className="text-xs font-medium text-red-500 hover:text-red-700">Delete</button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <label className="bg-gray-50 p-5 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-100 cursor-pointer transition min-h-[200px]">
                            <svg className="w-8 h-8 mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                            </svg>
                            <span className="font-medium">Upload Banner</span>
                            <span className="text-xs mt-1">PNG, JPG up to 5MB</span>
                            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                        </label>
                    </div>
                </section>

                {/* Promotions Section */}
                <section>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold">Active Promotions & Offers</h2>
                    </div>

                    <form onSubmit={handleAddPromotion} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-wrap gap-4 items-end">
                        <div className="flex-1 min-w-[150px]">
                            <label className="block text-xs text-gray-500 font-medium mb-1">Offer Name</label>
                            <input type="text" required value={newPromo.name} onChange={e => setNewPromo({ ...newPromo, name: e.target.value })} className="w-full border border-gray-200 rounded p-2 text-sm outline-none focus:border-indigo-500" placeholder="e.g. Winter Sale" />
                        </div>
                        <div className="flex-1 min-w-[120px]">
                            <label className="block text-xs text-gray-500 font-medium mb-1">Promo Code</label>
                            <input type="text" required value={newPromo.code} onChange={e => setNewPromo({ ...newPromo, code: e.target.value })} className="w-full border border-gray-200 rounded p-2 text-sm outline-none focus:border-indigo-500 uppercase" placeholder="WINTER20" />
                        </div>
                        <div className="w-24">
                            <label className="block text-xs text-gray-500 font-medium mb-1">Discount %</label>
                            <input type="number" required value={newPromo.discountPercentage} onChange={e => setNewPromo({ ...newPromo, discountPercentage: e.target.value })} className="w-full border border-gray-200 rounded p-2 text-sm outline-none focus:border-indigo-500" placeholder="20" />
                        </div>
                        <div className="flex-1 min-w-[150px]">
                            <label className="block text-xs text-gray-500 font-medium mb-1">Valid Until</label>
                            <input type="date" required value={newPromo.validUntil} onChange={e => setNewPromo({ ...newPromo, validUntil: e.target.value })} className="w-full border border-gray-200 rounded p-2 text-sm outline-none focus:border-indigo-500" />
                        </div>
                        <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded font-medium hover:bg-indigo-700 transition text-sm">Add Promo</button>
                    </form>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Offer Name</th>
                                    <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Promo Code</th>
                                    <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Discount</th>
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
                                        <td className="py-4 px-6 text-sm font-medium text-gray-700">{promo.discountPercentage}%</td>
                                        <td className="py-4 px-6 text-sm text-gray-500">{new Date(promo.validUntil).toLocaleDateString()}</td>
                                        <td className="py-4 px-6 text-sm">
                                            <span
                                                onClick={() => togglePromoStatus(promo._id, promo.status)}
                                                className={`cursor-pointer py-1 px-2.5 rounded-full text-xs font-medium ${promo.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}
                                            >
                                                {promo.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-sm text-right">
                                            <button onClick={() => deletePromo(promo._id)} className="text-red-500 font-medium cursor-pointer hover:text-red-700">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                                {promotions.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="py-4 text-center text-gray-500 text-sm">No promotions found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default CMSDashboard;