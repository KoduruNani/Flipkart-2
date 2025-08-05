import React from 'react';
import './Order.css';

const Order = ({ order }) => {
  if (!order) {
    return <div className="order-container">No order details available.</div>;
  }

  return (
    <div className="order-container">
      <h2>Order Summary</h2>
      <div className="order-info">
        <div><strong>Order ID:</strong> {order.id}</div>
        <div><strong>Date:</strong> {order.date}</div>
        <div><strong>Status:</strong> {order.status}</div>
      </div>
      <h3>Items</h3>
      <ul className="order-items">
        {order.items && order.items.length > 0 ? (
          order.items.map((item, idx) => (
            <li key={idx} className="order-item">
              <span>{item.name}</span> x <span>{item.quantity}</span> - ₹{item.price}
            </li>
          ))
        ) : (
          <li>No items in this order.</li>
        )}
      </ul>
      <div className="order-total">
        <strong>Total:</strong> ₹{order.total}
      </div>
    </div>
  );
};

export default Order;
