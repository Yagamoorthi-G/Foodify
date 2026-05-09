import axios from 'axios';
import React, { useState } from 'react'
import '../css/OwnerOrderCard.css'
import { MdPhone } from "react-icons/md";
import { serverUrl } from '../App';
import { useDispatch } from 'react-redux';
import { updateOrderStatus } from '../redux/userSlice';

function OwnerOrderCard({ data }) {
    const [availableBoys, setAvailableBoys] = useState([])
    const dispatch = useDispatch()
    
    const handleUpdateStatus = async (orderId, shopId, status) => {
        try {
            const result = await axios.post(`${serverUrl}/api/order/update-status/${orderId}/${shopId}`, {status}, {withCredentials: true})
             dispatch(updateOrderStatus({orderId, shopId, status}))
             setAvailableBoys(result.data.availableBoys)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="ooc-wrapper">
            <div className="ooc-header">
                <div className="ooc-customer-info">
                    <h3>{data.user.fullName}</h3>
                    <p>{data.user.email}</p>
                    <p className="ooc-phone"><MdPhone /><span>{data.user.mobile}</span></p>
                    {data.paymentMethod === "online" ? 
                        <p className="ooc-payment">Payment: {data.payment ? "Completed" : "Pending"}</p> : 
                        <p className="ooc-payment">Method: {data.paymentMethod.toUpperCase()}</p>
                    }
                </div>
                <div className="ooc-address">
                    <p>{data?.deliveryAddress?.text}</p>
                    <span className="ooc-coords">Lat: {data?.deliveryAddress.latitude}, Lon: {data?.deliveryAddress.longitude}</span>
                </div>
            </div>

            <div className="ooc-items-scroll">
                {data.shopOrders.shopOrderItems.map((item, index) => (
                    <div key={index} className="ooc-item-card">
                        <img src={item.item.image} alt={item.name} />
                        <h4>{item.name}</h4>
                        <p>Qty: {item.quantity} x ₹{item.price}</p>
                    </div>
                ))}
            </div>

            <div className="ooc-status-bar">
                <span className="ooc-status-label">
                    Status: <strong className="status-text">{data.shopOrders.status}</strong>
                </span>
                <select className="ooc-status-select" onChange={(e) => handleUpdateStatus(data._id, data.shopOrders.shop._id, e.target.value)}>
                    <option value="">Change Status</option>
                    <option value="pending">Pending</option>
                    <option value="preparing">Preparing</option>
                    <option value="out of delivery">Out Of Delivery</option>
                </select>
            </div>

            {data.shopOrders.status === "out of delivery" && (
                <div className="ooc-delivery-status">
                    {data.shopOrders.assignedDeliveryBoy ? <strong>Assigned Delivery Boy:</strong> : <strong>Available Delivery Boys:</strong>}
                    <div className="ooc-delivery-boys">
                        {availableBoys?.length > 0 ? (
                            availableBoys.map((b, index) => (
                                <div key={b.id || index} className="db-badge">{b.fullName} - {b.mobile}</div>
                            ))
                        ) : data.shopOrders.assignedDeliveryBoy ? (
                            <div className="db-badge assigned">{data.shopOrders.assignedDeliveryBoy.fullName} - {data.shopOrders.assignedDeliveryBoy.mobile}</div>
                        ) : (
                            <div className="db-waiting">Waiting for delivery boy to accept...</div>
                        )}
                    </div>
                </div>
            )}

            <div className="ooc-footer">
                Total: ₹{data.shopOrders.subtotal}
            </div>
        </div>
    )
}

export default OwnerOrderCard