import React, { useEffect, useState } from 'react'
import '../css/DeliveryBoy.css'
import Nav from './Nav'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { serverUrl } from '../App'
import DeliveryBoyTracking from './DeliveryBoyTracking'
import { ClipLoader } from 'react-spinners'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

function DeliveryBoy() {
  const {userData, socket} = useSelector(state => state.user)
  const [currentOrder, setCurrentOrder] = useState()
  const [showOtpBox, setShowOtpBox] = useState(false)
  const [availableAssignments, setAvailableAssignments] = useState([])
  const [otp, setOtp] = useState("")
  const [todayDeliveries, setTodayDeliveries] = useState([])
  const [deliveryBoyLocation, setDeliveryBoyLocation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    if(!socket || userData.role !== "deliveryBoy") return
    let watchId
    if(navigator.geolocation){
        watchId = navigator.geolocation.watchPosition(
            (position) => {
                const latitude = position.coords.latitude
                const longitude = position.coords.longitude
                setDeliveryBoyLocation({lat: latitude, lon: longitude})
                socket.emit('updateLocation', {
                  latitude,
                  longitude,
                  userId: userData._id
                })
            },
            (error) => {
                console.log(error)
            },
            { enableHighAccuracy: true }
        )
    }

    return () => {
      if(watchId) navigator.geolocation.clearWatch(watchId)
    }
  }, [socket, userData])

  const ratePerDelivery = 50
  const totalEarning = todayDeliveries.reduce((sum, d) => sum + d.count * ratePerDelivery, 0)

  const getAssignments = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/order/get-assignments`, {withCredentials: true})
      setAvailableAssignments(result.data)
    } catch (error) {
      console.log(error)
    }
  }

  const getCurrentOrder = async () => {
     try {
      const result = await axios.get(`${serverUrl}/api/order/get-current-order`, {withCredentials: true})
      setCurrentOrder(result.data)
    } catch (error) {
      console.log(error)
    }
  }

  const acceptOrder = async (assignmentId) => {
    try {
      await axios.get(`${serverUrl}/api/order/accept-order/${assignmentId}`, {withCredentials: true})
      await getCurrentOrder()
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (socket) {
        socket.on('newAssignment', (data) => {
          setAvailableAssignments(prev => ([...prev, data]))
        })
        return () => socket.off('newAssignment')
    }
  }, [socket])
  
  const sendOtp = async () => {
    setLoading(true)
    try {
      await axios.post(`${serverUrl}/api/order/send-delivery-otp`, {
        orderId: currentOrder._id, shopOrderId: currentOrder.shopOrder._id
      }, {withCredentials: true})
      setLoading(false)
      setShowOtpBox(true)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  const verifyOtp = async () => {
    setMessage("")
    try {
      const result = await axios.post(`${serverUrl}/api/order/verify-delivery-otp`, {
        orderId: currentOrder._id, shopOrderId: currentOrder.shopOrder._id, otp
      }, {withCredentials: true})
      setMessage(result.data.message)
      location.reload()
    } catch (error) {
      console.log(error)
    }
  }

  const handleTodayDeliveries = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/order/get-today-deliveries`, {withCredentials: true})
      setTodayDeliveries(result.data)
    } catch (error) {
      console.log(error)
    }
  }
 
  useEffect(() => {
    getAssignments()
    getCurrentOrder()
    handleTodayDeliveries()
  }, [userData])

  return (
    <div className="db-page-wrapper">
      <Nav/>
      <div className="db-container">
        
        <div className="db-card db-header-card">
            <h2>🤝𝐖𝐄𝐋𝐂𝐎𝐌𝐄, {userData.fullName}</h2>
              <p>
              <strong>Latitude:</strong> {deliveryBoyLocation?.lat || userData?.location?.coordinates[1] || "Loading..."}, 
              <strong> Longitude:</strong> {deliveryBoyLocation?.lon || userData?.location?.coordinates[0] || "Loading..."}
            </p>
        </div>

        <div className="db-card db-stats-card">
            <h3>Today Deliveries</h3>
            <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={todayDeliveries}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#D4E9E2"/>
                        <XAxis dataKey="hour" tickFormatter={(h) => `${h}:00`} tick={{fill: '#333'}}/>
                        <YAxis allowDecimals={false} tick={{fill: '#333'}}/>
                        <Tooltip formatter={(value) => [value, "orders"]} labelFormatter={label => `${label}:00`}/>
                        <Bar dataKey="count" fill="#0E7C4B" radius={[4, 4, 0, 0]}/>
                    </BarChart>
                </ResponsiveContainer>
            </div>
            <div className="earnings-box">
                <h4>Today's Earnings</h4>
                <span className="earnings-amount">₹{totalEarning}</span>
            </div>
        </div>

        {!currentOrder && (
            <div className="db-card db-assignments-card">
                <h3>Available Orders</h3>
                <div className="assignments-list">
                    {availableAssignments?.length > 0 ? (
                        availableAssignments.map((a, index) => (
                            <div className="assignment-item" key={index}>
                                <div className="assignment-info">
                                    <h4>{a?.shopName}</h4>
                                    <p><strong>Address:</strong> {a?.deliveryAddress.text}</p>
                                    <span className="assignment-meta">{a.items.length} items | ₹{a.subtotal}</span>
                                </div>
                                <button className="btn-primary" onClick={() => acceptOrder(a.assignmentId)}>Accept</button>
                            </div>
                        ))
                    ) : <p className="empty-state">No Available Orders</p>}
                </div>
            </div>
        )}

        {currentOrder && (
            <div className="db-card db-current-order-card">
                <h3>📦 Current Order</h3>
                <div className="current-order-info">
                    <h4>{currentOrder?.shopOrder.shop.name}</h4>
                    <p>{currentOrder.deliveryAddress.text}</p>
                    <span className="assignment-meta">{currentOrder.shopOrder.shopOrderItems.length} items | ₹{currentOrder.shopOrder.subtotal}</span>
                </div>
                
                <DeliveryBoyTracking data={{ 
                    deliveryBoyLocation: deliveryBoyLocation || {
                        lat: userData.location.coordinates[1],
                        lon: userData.location.coordinates[0]
                    },
                    customerLocation: {
                        lat: currentOrder.deliveryAddress.latitude,
                        lon: currentOrder.deliveryAddress.longitude
                    }
                }} />

                {!showOtpBox ? (
                    <button className="btn-primary btn-full mt-16" onClick={sendOtp} disabled={loading}>
                        {loading ? <ClipLoader size={20} color='white'/> : "Mark As Delivered"}
                    </button>
                ) : (
                    <div className="otp-box mt-16">
                        <p>Enter OTP sent to <strong>{currentOrder.user.fullName}</strong></p>
                        <input type="text" className="premium-input" placeholder="Enter OTP" onChange={(e) => setOtp(e.target.value)} value={otp}/>
                        {message && <p className="success-msg">{message}</p>}
                        <button className="btn-primary btn-full mt-8" onClick={verifyOtp}>Submit OTP</button>
                    </div>
                )}
            </div>
        )}
      </div>
    </div>
  )
}

export default DeliveryBoy