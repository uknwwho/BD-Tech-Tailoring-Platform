import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const CartPage = () => {
    const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [shippingDetails, setShippingDetails] = useState({
        fullName: '',
        phone: '',
        city: '',
        address: '',
        notes: ''
    });

    const API_URL = import.meta.env.VITE_API_URL;
    const token = localStorage.getItem('tailortech_token');

    const handleCheckout = async (e) => {
        e.preventDefault();
        if (!token) {
            toast.error("Please login to place an order");
            navigate('/login');
            return;
        }

        if (cartItems.length === 0) {
            toast.error("Your cart is empty");
            return;
        }

        setLoading(true);
        try {
            const orderData = {
                tailorId: cartItems[0].tailor._id,
                items: cartItems.map(item => ({
                    product: item._id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity
                })),
                shippingAddress: {
                    fullName: shippingDetails.fullName,
                    phone: shippingDetails.phone,
                    city: shippingDetails.city,
                    address: shippingDetails.address
                },
                notes: shippingDetails.notes,
                totalAmount: getCartTotal()
            };

            const res = await fetch(`${API_URL}/orders/place`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(orderData)
            });

            const data = await res.json();
            if (data.success) {
                toast.success("Order placed successfully!");
                clearCart();
                navigate('/my-orders');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Failed to place order");
        } finally {
            setLoading(false);
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="py-20 min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6 text-4xl">🛒</div>
                <h2 className="text-3xl font-black text-gray-900 mb-2">Your cart is empty</h2>
                <p className="text-gray-500 mb-8 max-w-xs">Looks like you haven't added anything to your cart yet.</p>
                <Link to="/tailors" className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">
                    Explore Tailors
                </Link>
            </div>
        );
    }

    return (
        <div className="py-10 min-h-screen">
            <h1 className="text-4xl font-black text-gray-900 mb-10">Shopping <span className="text-indigo-600">Cart</span></h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Left: Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-2xl flex items-center gap-3 mb-6">
                        <span className="text-xl">🧵</span>
                        <p className="text-sm font-bold text-indigo-700">Ordering from: <span className="underline">{cartItems[0].tailor.fullName}</span></p>
                    </div>

                    {cartItems.map((item) => (
                        <div key={item._id} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center gap-6">
                            <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0">
                                <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 text-center sm:text-left">
                                <h3 className="font-bold text-gray-900 text-lg mb-1">{item.name}</h3>
                                <p className="text-sm text-gray-400 font-medium mb-3">{item.category}</p>
                                <div className="flex items-center justify-center sm:justify-start gap-4">
                                    <div className="flex items-center border border-gray-100 rounded-xl px-2 bg-gray-50">
                                        <button onClick={() => updateQuantity(item._id, -1)} className="p-2 text-gray-400 hover:text-gray-900">−</button>
                                        <span className="w-8 text-center font-bold text-gray-900">{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item._id, 1)} className="p-2 text-gray-400 hover:text-gray-900">+</button>
                                    </div>
                                    <button onClick={() => removeFromCart(item._id)} className="text-red-500 text-sm font-bold hover:underline">Remove</button>
                                </div>
                            </div>
                            <div className="text-right shrink-0">
                                <p className="text-xl font-black text-gray-900">৳{item.price * item.quantity}</p>
                                <p className="text-xs text-gray-400 font-bold">৳{item.price} each</p>
                            </div>
                        </div>
                    ))}

                    <div className="pt-6">
                        <Link to={`/tailors/${cartItems[0].tailor._id}`} className="text-indigo-600 font-bold hover:underline flex items-center gap-2">
                            ← Add more from this tailor
                        </Link>
                    </div>
                </div>

                {/* Right: Checkout Form */}
                <div className="space-y-6">
                    <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-xl shadow-gray-100/50">
                        <h2 className="text-2xl font-black text-gray-900 mb-6">Order Summary</h2>
                        <div className="space-y-4 mb-6">
                            <div className="flex justify-between text-gray-500 font-medium">
                                <span>Subtotal</span>
                                <span>৳{getCartTotal()}</span>
                            </div>
                            <div className="flex justify-between text-gray-500 font-medium">
                                <span>Shipping</span>
                                <span className="text-green-600 font-bold">Free</span>
                            </div>
                            <div className="border-t border-dashed border-gray-200 pt-4 flex justify-between items-center ring-offset-2">
                                <span className="font-black text-gray-900 text-lg">Total</span>
                                <span className="font-black text-indigo-600 text-3xl">৳{getCartTotal()}</span>
                            </div>
                        </div>

                        <form onSubmit={handleCheckout} className="space-y-4">
                            <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest pt-2">Shipping Details</h3>
                            <input 
                                type="text" required placeholder="Full Name" 
                                className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-medium focus:ring-4 focus:ring-indigo-50 outline-none transition-all"
                                onChange={(e) => setShippingDetails({...shippingDetails, fullName: e.target.value})}
                            />
                            <input 
                                type="text" required placeholder="Phone Number" 
                                className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-medium focus:ring-4 focus:ring-indigo-50 outline-none transition-all"
                                onChange={(e) => setShippingDetails({...shippingDetails, phone: e.target.value})}
                            />
                            <input 
                                type="text" required placeholder="City" 
                                className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-medium focus:ring-4 focus:ring-indigo-50 outline-none transition-all"
                                onChange={(e) => setShippingDetails({...shippingDetails, city: e.target.value})}
                            />
                            <textarea 
                                required placeholder="Complete Address" rows="3"
                                className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-medium focus:ring-4 focus:ring-indigo-50 outline-none transition-all resize-none"
                                onChange={(e) => setShippingDetails({...shippingDetails, address: e.target.value})}
                            ></textarea>
                            <textarea 
                                placeholder="Order Notes (Optional / Measurements)" rows="3"
                                className="w-full bg-gray-100/50 border-none rounded-2xl p-4 text-sm font-medium outline-none resize-none"
                                onChange={(e) => setShippingDetails({...shippingDetails, notes: e.target.value})}
                            ></textarea>

                            <button 
                                type="submit" disabled={loading}
                                className="w-full bg-indigo-600 text-white font-black py-5 rounded-[24px] shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all disabled:bg-gray-300"
                            >
                                {loading ? 'Processing...' : 'Place Order'}
                            </button>
                        </form>
                    </div>
                    
                    <p className="text-center text-xs text-gray-400 font-medium px-6">
                        By placing an order, you agree to our terms of service and tailoring policies.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
