import React, { useEffect, useState } from 'react'
import '../css/CheckOut.css'
import { IoIosArrowRoundBack } from "react-icons/io";
import { IoSearchOutline, IoLocationSharp } from "react-icons/io5";
import { TbCurrentLocation } from "react-icons/tb";
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet';
import { useDispatch, useSelector } from 'react-redux';
import "leaflet/dist/leaflet.css"
import { setAddress, setLocation } from '../redux/mapSlice';
import { MdDeliveryDining } from "react-icons/md";
import { FaCreditCard } from "react-icons/fa";
import { FaMobileScreenButton } from "react-icons/fa6";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { serverUrl } from '../App';
import { addMyOrder, clearCart } from '../redux/userSlice'; // Added clearCart import

function RecenterMap({ location }) {
  if (location.lat && location.lon) {
    const map = useMap()
    map.setView([location.lat, location.lon], 16, { animate: true })
  }
  return null
}

function CheckOut() {
  const { location, address } = useSelector(state => state.map)
  const { cartItems, totalAmount, userData } = useSelector(state => state.user)
  const [addressInput, setAddressInput] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("cod")
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const apiKey = import.meta.env.VITE_GEOAPIKEY
  const deliveryFee = totalAmount > 500 ? 0 : 40
  const AmountWithDeliveryFee = totalAmount + deliveryFee

  const onDragEnd = (e) => {
    const { lat, lng } = e.target._latlng
    dispatch(setLocation({ lat, lon: lng }))
    getAddressByLatLng(lat, lng)
  }

  const getCurrentLocation = () => {
      const latitude = userData.location.coordinates[1]
      const longitude = userData.location.coordinates[0]
      dispatch(setLocation({ lat: latitude, lon: longitude }))
      getAddressByLatLng(latitude, longitude)
  }

  const getAddressByLatLng = async (lat, lng) => {
    try {
      const result = await axios.get(`https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&format=json&apiKey=${apiKey}`)
      dispatch(setAddress(result?.data?.results[0].address_line2))
    } catch (error) {
      console.log(error)
    }
  }

  const getLatLngByAddress = async () => {
    try {
      const result = await axios.get(`https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(addressInput)}&apiKey=${apiKey}`)
      const { lat, lon } = result.data.features[0].properties
      dispatch(setLocation({ lat, lon }))
    } catch (error) {
      console.log(error)
    }
  }

  const handlePlaceOrder = async () => {
    try {
      const result = await axios.post(`${serverUrl}/api/order/place-order`, {
        paymentMethod,
        deliveryAddress: {
          text: addressInput,
          latitude: location.lat,
          longitude: location.lon
        },
        totalAmount: AmountWithDeliveryFee,
        cartItems
      }, { withCredentials: true })

      if(paymentMethod === "cod"){
          dispatch(addMyOrder(result.data))
          dispatch(clearCart())
          navigate("/order-placed")
      } else {
          // STRIPE FLOW: Redirect the user to the Stripe Checkout page
          if (result.data.url) {
              window.location.href = result.data.url;
          }
       }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    setAddressInput(address)
  }, [address])

  return (
    <div className="checkout-wrapper">
      <div className="back-btn-float" onClick={() => navigate("/")}>
        <IoIosArrowRoundBack size={35} />
      </div>
      
      <div className="checkout-card">
        <h1 className="checkout-title">Checkout</h1>

        <section className="co-section">
          <h2 className="section-title"><IoLocationSharp className="icon-green" /> Delivery Location</h2>
          <div className="search-bar">
            <input 
                type="text" 
                className="address-input" 
                placeholder="Enter Your Delivery Address.." 
                value={addressInput} 
                onChange={(e) => setAddressInput(e.target.value)} 
            />
            <button className="btn-icon bg-green" onClick={getLatLngByAddress}><IoSearchOutline size={18} /></button>
            <button className="btn-icon bg-dark" onClick={getCurrentLocation}><TbCurrentLocation size={18} /></button>
          </div>
          
          <div className="map-container-wrapper">
              <MapContainer className="map-view" center={[location?.lat, location?.lon]} zoom={16}>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <RecenterMap location={location} />
                <Marker position={[location?.lat, location?.lon]} draggable eventHandlers={{ dragend: onDragEnd }} />
              </MapContainer>
          </div>
        </section>

        <section className="co-section">
          <h2 className="section-title">Payment Method</h2>
          <div className="payment-grid">
            <div 
                className={`payment-option ${paymentMethod === "cod" ? "active" : ""}`} 
                onClick={() => setPaymentMethod("cod")}
            >
              <div className="payment-icon-circle green-bg">
                <MdDeliveryDining />
              </div>
              <div className="payment-info">
                <p className="pm-title">Cash On Delivery</p>
                <p className="pm-subtitle">Pay when your food arrives</p>
              </div>
            </div>
            
            <div 
                className={`payment-option ${paymentMethod === "online" ? "active" : ""}`} 
                onClick={() => setPaymentMethod("online")}
            >
              <div className="payment-icon-multi">
                  <div className="payment-icon-circle purple-bg"><FaMobileScreenButton /></div>
                  <div className="payment-icon-circle blue-bg"><FaCreditCard /></div>
              </div>
              <div className="payment-info">
                <p className="pm-title">UPI / Credit / Debit Card</p>
                <p className="pm-subtitle">Pay Securely Online</p>
              </div>
            </div>
          </div>
        </section>

        <section className="co-section">
          <h2 className="section-title">Order Summary</h2>
          <div className="summary-box">
            {cartItems.map((item, index) => (
              <div key={index} className="summary-row text-sm">
                <span>{item.name} x {item.quantity}</span>
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))}
            
            <hr className="summary-divider"/>
            
            <div className="summary-row font-medium">
              <span>Subtotal</span>
              <span>₹{totalAmount}</span>
            </div>
            <div className="summary-row text-gray">
              <span>Delivery Fee</span>
              <span>{deliveryFee === 0 ? "Free" : `₹${deliveryFee}`}</span>
            </div>
            <div className="summary-row total-row">
                <span>Total</span>
              <span>₹{AmountWithDeliveryFee}</span>
            </div>
          </div>
        </section>
        
        <button className="btn-primary btn-full" onClick={handlePlaceOrder}>
            {paymentMethod === "cod" ? "Place Order" : "Pay & Place Order"}
        </button>

      </div>
    </div>
  )
}

export default CheckOut