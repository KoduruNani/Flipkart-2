import React from 'react';
import './Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard">
      <h1 className="dashboard__title">Welcome to Flipkart</h1>
      <div className="dashboard__content">
        <div className="dashboard__card">
          <h2 className="dashboard__card-title">Featured Products</h2>
          <div className="dashboard__card-content">
            Discover our latest products and best deals!
          </div>
        </div>
        <div className="dashboard__card">
          <h2 className="dashboard__card-title">Categories</h2>
          <div className="dashboard__card-content">
            Browse through our wide range of categories
          </div>
        </div>
        <div className="dashboard__card">
          <h2 className="dashboard__card-title">Special Offers</h2>
          <div className="dashboard__card-content">
            Check out our special discounts and promotions
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
