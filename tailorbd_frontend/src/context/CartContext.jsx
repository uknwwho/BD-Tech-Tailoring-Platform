import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    // Determine the storage key based on current user
    const getCartKey = () => {
        const user = JSON.parse(localStorage.getItem('tailortech_user'));
        return user?.id ? `tailortech_cart_${user.id}` : 'tailortech_cart_guest';
    };

    const [cartItems, setCartItems] = useState([]);
    const [storageKey, setStorageKey] = useState(getCartKey());

    // Effect to handle initial load and user session changes
    useEffect(() => {
        const loadCart = () => {
            const currentKey = getCartKey();
            setStorageKey(currentKey);
            const savedCart = localStorage.getItem(currentKey);
            setCartItems(savedCart ? JSON.parse(savedCart) : []);
        };

        // Load initially
        loadCart();

        // Listen for storage changes (login/logout)
        const handleStorageChange = () => {
            const newKey = getCartKey();
            if (newKey !== storageKey) {
                loadCart();
            }
        };

        window.addEventListener('storage', handleStorageChange);
        // Custom interval check for same-tab login/logout updates
        const interval = setInterval(handleStorageChange, 1000);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            clearInterval(interval);
        };
    }, [storageKey]);

    // Effect to persist cart whenever it changes
    useEffect(() => {
        if (storageKey) {
            localStorage.setItem(storageKey, JSON.stringify(cartItems));
        }
    }, [cartItems, storageKey]);

    const addToCart = (product, quantity = 1) => {
        // Prevent adding products from different tailors to the same cart
        if (cartItems.length > 0 && cartItems[0].tailor?._id !== product.tailor?._id) {
            if (window.confirm("Your cart contains items from another tailor. Clear cart and add this item instead?")) {
                setCartItems([{ ...product, quantity }]);
                toast.success("Cart updated with new tailor's product");
            }
            return;
        }

        setCartItems(prev => {
            const existing = prev.find(item => item._id === product._id);
            if (existing) {
                toast.info(`Increased ${product.name} quantity`);
                return prev.map(item => 
                    item._id === product._id 
                        ? { ...item, quantity: item.quantity + quantity } 
                        : item
                );
            }
            toast.success(`Added ${product.name} to cart`);
            return [...prev, { ...product, quantity }];
        });
    };

    const removeFromCart = (id) => {
        setCartItems(prev => prev.filter(item => item._id !== id));
        toast.info("Item removed from cart");
    };

    const updateQuantity = (id, delta) => {
        setCartItems(prev => prev.map(item => {
            if (item._id === id) {
                const newQty = Math.max(1, item.quantity + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        }));
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const getCartTotal = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const getCartCount = () => {
        return cartItems.reduce((count, item) => count + item.quantity, 0);
    };

    return (
        <CartContext.Provider value={{ 
            cartItems, 
            addToCart, 
            removeFromCart, 
            updateQuantity, 
            clearCart, 
            getCartTotal, 
            getCartCount 
        }}>
            {children}
        </CartContext.Provider>
    );
};
