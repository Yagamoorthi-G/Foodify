import React, { useEffect } from 'react'
import '../css/MyOrders.css'
import { useDispatch, useSelector } from 'react-redux'
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import UserOrderCard from '../components/UserOrderCard';
import OwnerOrderCard from '../components/OwnerOrderCard';
import { setMyOrders, updateRealtimeOrderStatus } from '../redux/userSlice';

function MyOrders() {
  const { userData, myOrders, socket } = useSelector(state => state.user)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  
  useEffect(() => {
    socket?.on('newOrder', (data) => {
        if(data.shopOrders?.owner._id === userData._id){
            dispatch(setMyOrders([data, ...myOrders]))
        }
    })

    socket?.on('update-status', ({ orderId, shopId, status, userId }) => {
        if(userId === userData._id){
            dispatch(updateRealtimeOrderStatus({ orderId, shopId, status }))
        }
    })

    return () => {
        socket?.off('newOrder')
        socket?.off('update-status')
    }
  }, [socket, myOrders, userData, dispatch])
  
  return (
    <div className="myorders-page">
      <div className="myorders-container">
        <div className="myorders-header">
          <div className="back-btn" onClick={() => navigate("/")}>
            <IoIosArrowRoundBack size={35} />
          </div>
          <h1>My Orders</h1>
        </div>
        
        <div className="orders-list">
          {myOrders?.map((order, index) => (
            userData.role === "user" ? (
              <UserOrderCard data={order} key={index} />
            ) : userData.role === "owner" ? (
              <OwnerOrderCard data={order} key={index} />
            ) : null
          ))}
        </div>
      </div>
    </div>
  )
}

export default MyOrders