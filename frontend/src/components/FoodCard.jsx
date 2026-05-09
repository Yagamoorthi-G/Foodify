import React, { useState } from 'react'
import '../css/FoodCard.css'
import { FaLeaf, FaDrumstickBite, FaStar, FaRegStar, FaMinus, FaPlus, FaShoppingCart } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/userSlice';

function FoodCard({data}) {
    const [quantity, setQuantity] = useState(0)
    const dispatch = useDispatch()
    const {cartItems} = useSelector(state => state.user)
    
    const renderStars = (rating) => { 
        const stars = [];
        for (let i = 1; i <= 5; i++) {
           stars.push((i <= rating) ? <FaStar key={i} className="star-icon filled"/> : <FaRegStar key={i} className="star-icon"/>)
        }
        return stars
    }

    const handleIncrease = () => setQuantity(quantity + 1)
    const handleDecrease = () => { if (quantity > 0) setQuantity(quantity - 1) }

    const handleAddToCart = () => {
        if (quantity > 0) {
            dispatch(addToCart({
                id: data._id,
                name: data.name,
                price: Number(data.price),
                image: data.image,
                shop: data.shop?._id || data.shop,
                quantity: Number(quantity),
                foodType: data.foodType
            }));
            setQuantity(0); 
        }
    }

  return (
    <div className="food-card">
      <div className="fc-image-wrapper">
        <div className="fc-type-badge">
            {data.foodType === "veg" ? <FaLeaf color="#0E7C4B"/> : <FaDrumstickBite color="#E63946"/>}
        </div>
        <img src={data.image} alt={data.name} className="fc-image"/>
      </div>

      <div className="fc-content">
        <h3 className="fc-title" title={data.name}>{data.name}</h3>
        <div className="fc-rating">
            {renderStars(data.rating?.average || 0)}
            <span className="fc-rating-count">({data.rating?.count || 0})</span>
        </div>
      </div>

      <div className="fc-footer">
        <span className="fc-price">₹{data.price}</span>
        
        <div className="fc-controls">
            <button className="fc-control-btn" onClick={handleDecrease}><FaMinus size={10}/></button>
            <span className="fc-qty">{quantity}</span>
            <button className="fc-control-btn" onClick={handleIncrease}><FaPlus size={10}/></button>
            <button 
                className={`fc-cart-btn ${cartItems.some(i => i.id === data._id) ? "in-cart" : ""}`}
                onClick={handleAddToCart}
            >
                <FaShoppingCart size={14}/>
            </button>
        </div>
      </div>
    </div>
  )
}

export default FoodCard