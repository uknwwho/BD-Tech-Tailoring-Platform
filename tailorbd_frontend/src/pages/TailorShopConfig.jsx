import React, { useState, useEffect } from 'react';
import AddressMapPicker from '../components/AddressMapPicker';

const TailorShopConfig = () => {
    const user = JSON.parse(localStorage.getItem('tailortech_user'));
    const API_URL = import.meta.env.VITE_API_URL;

    // State to track if we are in Edit Mode or View Mode
    const [isEditing, setIsEditing] = useState(true);
    const [hasProfile, setHasProfile] = useState(false); // Do they already have a shop?

    // We keep a backup of the original data in case they click "Cancel"
    const [originalData, setOriginalData] = useState(null);

    const [shopData, setShopData] = useState({
        shopName: '',
        description: '',
        serviceAreas: [], // Now an array of { name, lat, lng } objects
        pricing: []
    });

    useEffect(() => {
        if (!user) return;

        const fetchProfile = async () => {
            try {
                const res = await fetch(`${API_URL}/tailor-config/profile/${user.id}`);
                const data = await res.json();

                if (data.success && data.profile) {
                    // Auto-migrate: if serviceAreas contains plain strings, convert them
                    let areas = data.profile.serviceAreas || [];
                    if (areas.length > 0 && typeof areas[0] === 'string') {
                        // Legacy format — convert strings to objects with default coords
                        areas = areas.map((name, idx) => ({
                            name: name,
                            lat: 23.8103 + (idx * 0.01),
                            lng: 90.4125 + (idx * 0.01)
                        }));
                    }

                    const fetchedData = {
                        shopName: data.profile.shopName || '',
                        description: data.profile.description || '',
                        serviceAreas: areas,
                        pricing: data.profile.pricing || []
                    };

                    setShopData(fetchedData);
                    setOriginalData(fetchedData); // Save backup
                    setHasProfile(true);
                    setIsEditing(false); // Lock the form since data exists!
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
            }
        };
        fetchProfile();
    }, [user?.id]);

    // DYNAMIC PRICING HANDLERS
    const addPricingRow = () => {
        setShopData({ ...shopData, pricing: [...shopData.pricing, { category: '', basePrice: '', turnaroundTime: '' }] });
    };

    const removePricingRow = (indexToRemove) => {
        const newPricing = shopData.pricing.filter((_, index) => index !== indexToRemove);
        setShopData({ ...shopData, pricing: newPricing });
    };

    const handlePricingChange = (index, field, value) => {
        const newPricing = [...shopData.pricing];
        newPricing[index][field] = value;
        setShopData({ ...shopData, pricing: newPricing });
    };

    // SERVICE AREAS MAP HANDLER
    const handleServiceAreasChange = (areas) => {
        setShopData({ ...shopData, serviceAreas: areas });
    };

    // FORM ACTION HANDLERS
    const handleCancel = () => {
        setShopData(originalData); // Restore the backup!
        setIsEditing(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            tailorId: user.id,
            shopName: shopData.shopName,
            description: shopData.description,
            serviceAreas: shopData.serviceAreas, // Already structured as [{ name, lat, lng }]
            pricing: shopData.pricing
        };

        try {
            const res = await fetch(`${API_URL}/tailor-config/profile`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();

            if (data.success) {
                setOriginalData(shopData); // Update the backup
                setHasProfile(true);
                setIsEditing(false); // Lock the form on success!
                alert("Shop configuration saved successfully!");
            } else {
                alert("Failed to save: " + data.message);
            }
        } catch (error) {
            console.error("Save error:", error);
            alert("Failed to connect to backend!");
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Are you absolutely sure you want to delete your entire shop profile? This cannot be undone.")) return;

        try {
            const res = await fetch(`${API_URL}/tailor-config/profile/${user.id}`, { method: 'DELETE' });
            const data = await res.json();

            if (data.success) {
                // Wipe everything clean
                setShopData({ shopName: '', description: '', serviceAreas: [], pricing: [] });
                setOriginalData(null);
                setHasProfile(false);
                setIsEditing(true);
                alert("Shop profile deleted.");
            } else {
                alert("Failed to delete: " + data.message);
            }
        } catch (error) {
            console.error("Delete error:", error);
        }
    };

    if (!user) return <div className="p-10 text-center">Please log in first.</div>;

    // Helper for input styling based on Edit Mode
    const inputClass = `w-full rounded-lg p-3 outline-none transition-all ${isEditing
        ? 'border border-gray-300 focus:border-indigo-500 bg-white shadow-sm'
        : 'border-transparent bg-gray-100 text-gray-500 font-medium cursor-not-allowed'
        }`;

    return (
        <div className="max-w-4xl mx-auto py-10 px-4">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Shop Configuration</h1>
                    <p className="text-gray-500">Manage your shop details, service areas, and dynamic pricing.</p>
                </div>

                {/* Top Right Action Buttons */}
                {hasProfile && !isEditing && (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="bg-indigo-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-indigo-700 shadow-md transition"
                    >
                        Edit Profile
                    </button>
                )}
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-8 relative">

                {/* BASIC INFO */}
                <section>
                    <h2 className="text-xl font-semibold text-indigo-600 mb-4 border-b pb-2">Basic Information</h2>
                    <div className="grid grid-cols-1 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Shop Name</label>
                            <input
                                type="text" required disabled={!isEditing}
                                value={shopData.shopName}
                                onChange={(e) => setShopData({ ...shopData, shopName: e.target.value })}
                                className={inputClass}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Shop Description</label>
                            <textarea
                                rows="3" disabled={!isEditing}
                                value={shopData.description}
                                onChange={(e) => setShopData({ ...shopData, description: e.target.value })}
                                className={inputClass}
                            ></textarea>
                        </div>
                    </div>
                </section>

                {/* SERVICE AREAS — Map-based picker */}
                <section>
                    <h2 className="text-xl font-semibold text-indigo-600 mb-4 border-b pb-2">Service Areas</h2>
                    <p className="text-sm text-gray-400 mb-4">
                        {isEditing
                            ? '📍 Click on the map or search to add your service areas. Each pin marks an area you serve.'
                            : '📍 Your current service areas are shown below.'
                        }
                    </p>
                    <AddressMapPicker
                        mode="multi"
                        disabled={!isEditing}
                        selectedAreas={shopData.serviceAreas}
                        onServiceAreasChange={handleServiceAreasChange}
                    />
                </section>

                {/* DYNAMIC PRICING */}
                <section>
                    <div className="flex justify-between items-center mb-4 border-b pb-2">
                        <h2 className="text-xl font-semibold text-indigo-600">Dynamic Pricing</h2>
                        {isEditing && (
                            <button type="button" onClick={addPricingRow} className="text-sm bg-indigo-50 text-indigo-600 font-bold px-3 py-1.5 rounded-lg hover:bg-indigo-100">+ Add Category</button>
                        )}
                    </div>

                    {shopData.pricing.length === 0 && (
                        <p className="text-gray-400 text-sm italic">No pricing categories added yet.</p>
                    )}

                    <div className="space-y-4">
                        {shopData.pricing.map((item, index) => (
                            <div key={index} className="flex flex-wrap md:flex-nowrap gap-4 items-end bg-gray-50 p-4 rounded-xl border border-gray-200">
                                <div className="flex-1 min-w-[150px]">
                                    <label className="block text-xs font-bold text-gray-500 mb-1">Dress Category</label>
                                    <input
                                        type="text" required placeholder="e.g. Suit" disabled={!isEditing}
                                        value={item.category}
                                        onChange={(e) => handlePricingChange(index, 'category', e.target.value)}
                                        className={inputClass}
                                    />
                                </div>
                                <div className="w-full md:w-32">
                                    <label className="block text-xs font-bold text-gray-500 mb-1">Base Price (৳)</label>
                                    <input
                                        type="number" required placeholder="2500" disabled={!isEditing}
                                        value={item.basePrice}
                                        onChange={(e) => handlePricingChange(index, 'basePrice', e.target.value)}
                                        className={inputClass}
                                    />
                                </div>
                                <div className="flex-1 min-w-[120px]">
                                    <label className="block text-xs font-bold text-gray-500 mb-1">Turnaround Time</label>
                                    <input
                                        type="text" required placeholder="e.g. 7-10 Days" disabled={!isEditing}
                                        value={item.turnaroundTime}
                                        onChange={(e) => handlePricingChange(index, 'turnaroundTime', e.target.value)}
                                        className={inputClass}
                                    />
                                </div>

                                {isEditing && (
                                    <button
                                        type="button" onClick={() => removePricingRow(index)}
                                        className="text-red-500 hover:bg-red-50 rounded-lg font-bold p-3 mb-0.5 transition"
                                    >
                                        X
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </section>

                {/* BOTTOM ACTION BAR (Only visible while editing) */}
                {isEditing && (
                    <div className="pt-6 border-t mt-8 flex flex-col sm:flex-row justify-between gap-4 items-center">

                        {/* Delete Button (Only if they actually have a saved profile) */}
                        {hasProfile ? (
                            <button type="button" onClick={handleDelete} className="text-red-600 hover:underline font-bold text-sm">
                                Delete Entire Profile
                            </button>
                        ) : <div></div>}

                        <div className="flex w-full sm:w-auto gap-4">
                            {hasProfile && (
                                <button type="button" onClick={handleCancel} className="w-full sm:w-auto px-6 py-3 rounded-xl text-gray-600 font-bold hover:bg-gray-100 transition">
                                    Cancel
                                </button>
                            )}
                            <button type="submit" className="w-full sm:w-auto bg-green-600 text-white font-bold px-8 py-3 rounded-xl hover:bg-green-700 transition shadow-md">
                                Save Changes
                            </button>
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
};

export default TailorShopConfig;