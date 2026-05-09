import React, { useEffect, useState, useRef } from 'react'
import '../css/OrderPlaced.css'
import { FaCircleCheck } from "react-icons/fa6";
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearCart, addMyOrder } from '../redux/userSlice';
import axios from 'axios';
import { serverUrl } from '../App';

function OrderPlaced() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const dispatch = useDispatch();
    const [isVerifying, setIsVerifying] = useState(false);
    
    // useRef prevents the API from firing twice in React StrictMode
    const hasVerified = useRef(false); 

    useEffect(() => {
        const success = searchParams.get("success");
        const sessionId = searchParams.get("session_id");
        const orderId = searchParams.get("orderId");

        if (success === "true" && !hasVerified.current) {
            hasVerified.current = true;
            
            // 1. Empty the cart immediately
            dispatch(clearCart());
            
            // 2. If it was an online payment, tell the backend to verify and mark as paid!
            if (sessionId && orderId) {
                setIsVerifying(true);
                
                axios.post(`${serverUrl}/api/order/verify-payment`, {
                    session_id: sessionId,
                    orderId: orderId
                }, { withCredentials: true })
                .then((res) => {
                    // Update Redux with the newly paid order
                    dispatch(addMyOrder(res.data));
                    setIsVerifying(false);
                })
                .catch((err) => {
                    console.log("Payment verification failed", err);
                    setIsVerifying(false);
                });
            }
        }
    }, [searchParams, dispatch]);

    // Show a loading screen while communicating with Stripe
    if (isVerifying) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
                {/* You can use your ClipLoader here if you imported it, or just text! */}
                <h2 style={{ color: '#00754A' }}>Verifying your payment...</h2>
                <p>Please do not close this window.</p>
            </div>
        )
    }

  return (
    <div className="success-page">
      <div className="success-content">
          <FaCircleCheck className="success-icon"/>
          <h1 className="success-title">Order Placed!</h1>
          <p className="success-message">
            Thank you for your purchase. Your order is being prepared.  
            You can track your order status in the "My Orders" section.
         </p>
         <button className="btn-primary" onClick={() => navigate("/my-orders")}>
            Back to My Orders
         </button>
      </div>
    </div>
  )
}

export default OrderPlaced