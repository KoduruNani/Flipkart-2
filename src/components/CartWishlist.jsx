import React from 'react';
import { useCartWishlist } from './CartWishlistContext';
import './CartWishlist.css';

const Cart = () => {
  const { cart, removeFromCart } = useCartWishlist();
  return (
    <div className="cart-wishlist-container">
      <h2>Cart</h2>
      {cart.length === 0 ? <p>Your cart is empty.</p> : (
        <ul>
          {cart.map(item => (
            <li key={item.id}>
              <img src={item.image} alt={item.title} width={40} />
              {item.title} - ${item.price.toFixed(2)}
              <button onClick={() => removeFromCart(item.id)}>Remove</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const Wishlist = () => {
  const { wishlist, removeFromWishlist, addToCart, cart } = useCartWishlist();
  return (
    <div className="cart-wishlist-container">
      <h2>Wishlist</h2>
      {wishlist.length === 0 ? <p>Your wishlist is empty.</p> : (
        <ul>
          {wishlist.map(item => (
            <li key={item.id}>
              <img src={item.image} alt={item.title} width={40} />
              {item.title} - ${item.price.toFixed(2)}
              <button onClick={() => addToCart(item)} disabled={cart.find(c => c.id === item.id)}>
                {cart.find(c => c.id === item.id) ? 'In Cart' : 'Add to Cart'}
              </button>
              <button onClick={() => removeFromWishlist(item.id)}>Remove</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export { Cart, Wishlist };
