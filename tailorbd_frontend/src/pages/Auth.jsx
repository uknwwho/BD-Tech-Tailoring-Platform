import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
    const [mode, setMode] = useState('login');
    const [formData, setFormData] = useState({ fullName: '', email: '', password: '', phone: '' });
    const navigate = useNavigate();

    const API_URL = 'http://localhost:5000/api/auth';

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        let endpoint = `${API_URL}/login`;
        if (mode === 'register') endpoint = `${API_URL}/register`;
        if (mode === 'forgot') endpoint = `${API_URL}/forgot-password`;

        try {

            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (data.success) {
                if (mode === 'forgot') {
                    alert(data.message);
                } else {

                    let finalUser = data.user;

                    if (formData.email.includes('@admin.com')) {
                        finalUser.role = 'admin';
                    }

                    localStorage.setItem('tailortech_token', data.token);
                    localStorage.setItem('tailortech_user', JSON.stringify(finalUser));

                    if (finalUser.role === 'admin') navigate('/AdminDashboard');
                    else if (finalUser.role === 'tailor') navigate('/TailorPortfolio');
                    else navigate('/');
                }
            } else {
                alert("Error: " + data.message);
            }
        } catch (error) {
            console.error("Auth error:", error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100">

                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-indigo-600 mb-2">TailorTech.</h2>
                    <p className="text-gray-500 font-medium">
                        {mode === 'login' && 'Welcome back! Please login.'}
                        {mode === 'register' && 'Create your account.'}
                        {mode === 'forgot' && 'Reset your password.'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {mode === 'register' && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input type="text" name="fullName" required onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-indigo-500" placeholder="John Doe" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                <input type="text" name="phone" required onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-indigo-500" placeholder="01XXXXXXXXX" />
                            </div>
                        </>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input type="email" name="email" required onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-indigo-500" placeholder="you@example.com" />
                    </div>

                    {mode !== 'forgot' && (
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="block text-sm font-medium text-gray-700">Password</label>
                                {mode === 'login' && (
                                    <span onClick={() => setMode('forgot')} className="text-xs text-indigo-600 cursor-pointer hover:underline">Forgot password?</span>
                                )}
                            </div>
                            <input type="password" name="password" required onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-indigo-500" placeholder="••••••••" />
                        </div>
                    )}

                    <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition duration-300 shadow-md">
                        {mode === 'login' && 'Sign In'}
                        {mode === 'register' && 'Create Account'}
                        {mode === 'forgot' && 'Send Reset Link'}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-gray-600">
                    {mode === 'login' ? (
                        <p>Don't have an account? <span onClick={() => setMode('register')} className="text-indigo-600 font-bold cursor-pointer hover:underline">Sign up</span></p>
                    ) : (
                        <p>Back to <span onClick={() => setMode('login')} className="text-indigo-600 font-bold cursor-pointer hover:underline">Login</span></p>
                    )}
                </div>

            </div>
        </div>
    );
};

export default Auth;