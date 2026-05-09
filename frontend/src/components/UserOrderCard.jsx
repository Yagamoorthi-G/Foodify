import axios from 'axios'
import React, { useState } from 'react'
import '../css/UserOrderCard.css'
import { useNavigate } from 'react-router-dom'
import { serverUrl } from '../App'

function UserOrderCard({ data }) {
    const navigate = useNavigate()
    const [selectedRating, setSelectedRating] = useState({})

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleString('en-GB', {
            day: "2-digit",
            month: "short",
            year: "numeric"
        })
    }

    const handleRating = async (itemId, rating) => {
        try {
            await axios.post(`${serverUrl}/api/item/rating`, { itemId, rating }, { withCredentials: true })
            setSelectedRating(prev => ({
                ...prev, [itemId]: rating
            }))
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="uoc-wrapper">
            <div className="uoc-header">
                <div>
                    <h3 className="uoc-order-id">Order #{data._id.slice(-6)}</h3>
                    <p className="uoc-date">Date: {formatDate(data.createdAt)}</p>
                </div>
                <div className="uoc-header-right">
                    {data.paymentMethod === "cod" ? 
                        <span className="uoc-payment-badge">{data.paymentMethod.toUpperCase()}</span> : 
                        <span className="uoc-payment-badge online">Payment: {data.payment ? "Success" : "Pending"}</span>
                    }
                    <p className="uoc-global-status">{data.shopOrders?.[0]?.status}</p>
                </div>
            </div>

            {data.shopOrders.map((shopOrder, index) => (
                <div className="uoc-shop-section" key={index}>
                    <h4 className="uoc-shop-name">{shopOrder.shop.name}</h4>

                    <div className="uoc-items-scroll">
                        {shopOrder.shopOrderItems.map((item, idx) => (
                            <div key={idx} className="uoc-item-card">
                                <img src={item.item.image} alt={item.name} />
                                <h5>{item.name}</h5>
                                <p>Qty: {item.quantity} x ₹{item.price}</p>

                                {shopOrder.status === "delivered" && (
                                    <div className="uoc-rating">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button 
                                                key={star}
                                                className={`star-btn ${selectedRating[item.item._id] >= star ? 'filled' : ''}`} 
                                                onClick={() => handleRating(item.item._id, star)}
                                            >★</button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    
                    <div className="uoc-shop-footer">
                        <p className="uoc-subtotal">Subtotal: ₹{shopOrder.subtotal}</p>
                        <span className="uoc-shop-status">{shopOrder.status}</span>
                    </div>
                </div>
            ))}

            <div className="uoc-footer">
                <p className="uoc-total">Total: ₹{data.totalAmount}</p>
                <button className="btn-primary" onClick={() => navigate(`/track-order/${data._id}`)}>
                    Track Order
                </button>
            </div>
        </div>
    )
}

export default UserOrderCard