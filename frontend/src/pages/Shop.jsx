import axios from 'axios'
import React, { useEffect, useState } from 'react'
import '../css/Shop.css'
import { serverUrl } from '../App'
import { useNavigate, useParams } from 'react-router-dom'
import { FaStore, FaLocationDot, FaArrowLeft, FaUtensils } from "react-icons/fa6";
import FoodCard from '../components/FoodCard';

function Shop() {
    const { shopId } = useParams()
    const [items, setItems] = useState([])
    const [shop, setShop] = useState(null)
    const navigate = useNavigate()
    
    const handleShop = async () => {
        try {
           const result = await axios.get(`${serverUrl}/api/item/get-by-shop/${shopId}`, { withCredentials: true }) 
           setShop(result.data.shop)
           setItems(result.data.items)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        handleShop()
    }, [shopId])
    
  return (
    <div className="shop-page-wrapper">
        <button className="shop-back-btn" onClick={() => navigate("/")}>
            <FaArrowLeft />
            <span>Back</span>
        </button>
        
      {shop && (
          <div className="shop-hero-banner">
            <img src={shop.image} alt={shop.name} className="shop-hero-bg"/>
            <div className="shop-hero-overlay">
                <FaStore className="shop-hero-icon"/>
                <h1 className="shop-hero-title">{shop.name}</h1>
                <div className="shop-hero-location">
                    <FaLocationDot size={18} color="#00754A" />
                    <p>{shop.address}</p>
                </div>
            </div>
          </div>
      )}

        <div className="shop-menu-section">
            <h2 className="shop-menu-title">
                <FaUtensils color="#00754A"/> Our Menu
            </h2>

            {items.length > 0 ? (
                <div className="shop-menu-grid">
                    {items.map((item) => (
                        <FoodCard key={item._id} data={item}/>
                    ))}
                </div>
            ) : (
                <div className="empty-menu-state">
                    <p>No Items Available</p>
                </div>
            )}
        </div>
    </div>
  )
}

export default Shop