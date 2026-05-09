import axios from 'axios'
import React, { useEffect, useState } from 'react'
import '../css/TrackOrderPage.css'
import { useNavigate, useParams } from 'react-router-dom'
import { serverUrl } from '../App'
import { IoIosArrowRoundBack } from "react-icons/io";
import DeliveryBoyTracking from '../components/DeliveryBoyTracking'
import { useSelector } from 'react-redux'

function TrackOrderPage() {
    const { orderId } = useParams()
    const [currentOrder, setCurrentOrder] = useState()
    const navigate = useNavigate()
    const { socket } = useSelector(state => state.user)
    const [liveLocations, setLiveLocations] = useState({})

    const handleGetOrder = async () => {
        try {
            const result = await axios.get(`${serverUrl}/api/order/get-order-by-id/${orderId}`, { withCredentials: true })
            setCurrentOrder(result.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (socket) {
            socket.on('updateDeliveryLocation', ({ deliveryBoyId, latitude, longitude }) => {
                setLiveLocations(prev => ({
                    ...prev,
                    [deliveryBoyId]: { lat: latitude, lon: longitude }
                }))
            })
        }
        
        return () => {
            if (socket) {
                socket.off('updateDeliveryLocation')
            }
        }
    }, [socket])

    useEffect(() => {
        handleGetOrder()
    }, [orderId])

    return (
        <div className="top-wrapper">
            <div className="top-container">
                <div className="top-header">
                    <div className="top-back-btn" onClick={() => navigate("/")}>
                        <IoIosArrowRoundBack size={35} />
                    </div>
                    <h1 className="top-title">Track Order</h1>
                </div>
                
                {currentOrder?.shopOrders?.map((shopOrder, index) => (
                    <div className="top-order-card" key={index}>
                        <div>
                            <h2 className="top-shop-name">{shopOrder.shop.name}</h2>
                            <p className="top-info-row"><strong>Items:</strong> {shopOrder.shopOrderItems?.map(i => i.name).join(", ")}</p>
                            <p className="top-info-row"><strong>Subtotal:</strong> ₹{shopOrder.subtotal}</p>
                            <p className="top-info-row"><strong>Delivery Address:</strong> {currentOrder.deliveryAddress?.text}</p>
                        </div>
                        
                        {shopOrder.status !== "delivered" ? (
                            <>
                                {shopOrder.assignedDeliveryBoy ? (
                                    <div className="top-delivery-box">
                                        <p><strong>Delivery Boy Name:</strong> {shopOrder.assignedDeliveryBoy.fullName}</p>
                                        <p><strong>Contact No:</strong> {shopOrder.assignedDeliveryBoy.mobile}</p>
                                    </div>
                                ) : (
                                    <p className="top-info-row"><strong>Delivery Boy is not assigned yet.</strong></p>
                                )}
                            </>
                        ) : (
                            <p className="top-status-delivered">Delivered</p>
                        )}

                        {(shopOrder.assignedDeliveryBoy && shopOrder.status !== "delivered") && (
                            <div className="top-map-container">
                                <DeliveryBoyTracking data={{
                                    deliveryBoyLocation: liveLocations[shopOrder.assignedDeliveryBoy._id] || {
                                        lat: shopOrder.assignedDeliveryBoy.location.coordinates[1],
                                        lon: shopOrder.assignedDeliveryBoy.location.coordinates[0]
                                    },
                                    customerLocation: {
                                        lat: currentOrder.deliveryAddress.latitude,
                                        lon: currentOrder.deliveryAddress.longitude
                                    }
                                }} />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default TrackOrderPage