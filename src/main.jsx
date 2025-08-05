import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import ErrorBoundary from './components/ErrorBoundary';
import { CartWishlistProvider } from './components/CartWishlistContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <CartWishlistProvider>
          <App />
        </CartWishlistProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>,
);
