import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';

const TailorProfile = () => {
    const [formData, setFormData] = useState({ fullName: '', phone: '', bio: '' });
    const [profileImage, setProfileImage] = useState(null);
    const [currentImage, setCurrentImage] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const API_URL = `${import.meta.env.VITE_API_URL}/tailors`;
    const token = localStorage.getItem('tailortech_token');
    const user = JSON.parse(localStorage.getItem('tailortech_user'));

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await fetch(`${API_URL}/${user._id}`);
            const data = await res.json();
            if (data.success) {
                setFormData({ fullName: data.tailor.fullName, phone: data.tailor.phone, bio: data.tailor.bio || '' });
                setCurrentImage(data.tailor.profileImage || '');
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        const fd = new FormData();
        fd.append('fullName', formData.fullName);
        fd.append('phone', formData.phone);
        fd.append('bio', formData.bio);
        if (profileImage) fd.append('profileImage', profileImage);

        try {
            const res = await fetch(`${API_URL}/profile`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` },
                body: fd
            });
            const data = await res.json();
            if (data.success) {
                setMessage('Profile updated successfully!');
                if (data.tailor.profileImage) setCurrentImage(data.tailor.profileImage);
                // Update local storage name
                const storedUser = JSON.parse(localStorage.getItem('tailortech_user'));
                // storedUser.name = formData.fullName;
                storedUser.fullName = formData.fullName;
                localStorage.setItem('tailortech_user', JSON.stringify(storedUser));
            } else {
                setMessage('Error: ' + data.message);
            }
        } catch (error) {
            setMessage('Failed to update profile.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen bg-gray-50 font-sans text-gray-800 w-full overflow-hidden">
            <AdminSidebar />

            <main className="flex-1 p-8 md:p-10 overflow-y-auto w-full">
                <header className="mb-10">
                    <h1 className="text-3xl font-bold text-gray-900">Edit Profile</h1>
                    <p className="text-sm text-gray-500 mt-1">Update your public profile information.</p>
                </header>

                <div className="max-w-xl">
                    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                        {message && (
                            <div className={`mb-6 p-3 rounded-lg text-sm font-medium ${message.includes('success') ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                                {message}
                            </div>
                        )}

                        {/* Current Photo */}
                        <div className="flex items-center gap-6 mb-8">
                            {currentImage ? (
                                <img src={currentImage} alt="Profile" className="w-24 h-24 rounded-full object-cover border-4 border-indigo-100" />
                            ) : (
                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold border-4 border-indigo-100">
                                    {formData.fullName.charAt(0).toUpperCase() || '?'}
                                </div>
                            )}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Change Profile Photo</label>
                                <input
                                    type="file" accept="image/*"
                                    onChange={(e) => setProfileImage(e.target.files[0])}
                                    className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                />
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">Full Name</label>
                                <input type="text" required value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} className="w-full border border-gray-200 rounded-lg p-3 text-sm outline-none focus:border-indigo-500 transition" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">Phone Number</label>
                                <input type="text" required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full border border-gray-200 rounded-lg p-3 text-sm outline-none focus:border-indigo-500 transition" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">Bio / Description</label>
                                <textarea rows={5} value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} className="w-full border border-gray-200 rounded-lg p-3 text-sm outline-none focus:border-indigo-500 transition resize-none" placeholder="Tell customers about your expertise, specialties, and experience..." />
                            </div>
                            <button type="submit" disabled={loading} className={`w-full bg-indigo-600 text-white font-bold py-3 rounded-xl transition shadow-md ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-700'}`}>
                                {loading ? 'Saving...' : 'Save Profile'}
                            </button>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default TailorProfile;
