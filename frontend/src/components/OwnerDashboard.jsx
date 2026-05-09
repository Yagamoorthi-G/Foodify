import React from 'react'
import '../css/OwnerDashboard.css'
import Nav from './Nav.jsx'
import { useSelector } from 'react-redux'
import { FaUtensils, FaPen } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import OwnerItemCard from './OwnerItemCard';

function OwnerDashboard() {
  const { myShopData } = useSelector(state => state.owner)
  const navigate = useNavigate()

  return (
    <div className="owner-dashboard-wrapper">
      <Nav />
      
      {!myShopData && (
        <div className="od-empty-state-wrapper">
          <div className="od-empty-state-card">
            <FaUtensils className="od-icon-large" />
            <h2>Add Your Restaurant</h2>
            <p>Join our food delivery platform and reach thousands of hungry customers every day.</p>
            <button className="btn-primary" onClick={() => navigate("/create-edit-shop")}>
              Get Started
            </button>
          </div>
        </div>
      )}

      {myShopData && (
        <div className="od-content">
          <h1 className="od-page-title">
            <FaUtensils className="od-title-icon" /> Welcome to {myShopData.name}
          </h1>

          <div className="od-shop-banner-card">
            <div className="od-edit-float-btn" onClick={() => navigate("/create-edit-shop")}>
                <FaPen size={18}/>
            </div>
             <img src={myShopData.image} alt={myShopData.name} className="od-shop-image"/>
             <div className="od-shop-info">
              <h2>{myShopData.name}</h2>
              <p className="od-location">{myShopData.city}, {myShopData.state}</p>
              <p className="od-address">{myShopData.address}</p>
            </div>
          </div>

          {myShopData.items.length === 0 && (
            <div className="od-empty-state-wrapper">
              <div className="od-empty-state-card">
                <FaUtensils className="od-icon-large" />
                <h2>Add Your Food Item</h2>
                <p>Share your delicious creations with our customers by adding them to the menu.</p>
                <button className="btn-primary" onClick={() => navigate("/add-item")}>
                  Add Food
                </button>
              </div>
            </div>
          )}

          {myShopData.items.length > 0 && (
            <div className="od-items-list">
                {myShopData.items.map((item, index) => (
                    <OwnerItemCard data={item} key={index}/>
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default OwnerDashboard