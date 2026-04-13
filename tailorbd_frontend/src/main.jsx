import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google';
import { CartProvider } from './context/CartContext.jsx'
import { ToastContainer } from 'react-toastify';

console.log("MY GOOGLE ID IS: ", import.meta.env.VITE_GOOGLE_CLIENT_ID);

createRoot(document.getElementById('root')).render(
  // <BrowserRouter>
  //   <App />
  // </BrowserRouter>,
  <React.StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      {/* <BrowserRouter>
        <App />
      </BrowserRouter> */}
      <BrowserRouter>
        <CartProvider>
          <App />
          <ToastContainer position="bottom-right" />
        </CartProvider>
      </BrowserRouter>

    </GoogleOAuthProvider>
  </React.StrictMode>,
)
