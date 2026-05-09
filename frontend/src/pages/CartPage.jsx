import React from 'react'
import '../css/CartPage.css'
import { IoIosArrowRoundBack } from "react-icons/io";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CartItemCard from '../components/CartItemCard';

function CartPage() {
    const navigate = useNavigate()
    const { cartItems, totalAmount } = useSelector(state => state.user)
    
    return (
        <div className="cart-page-wrapper">
            <div className="cart-container">
                <div className="cart-header">
                    <div className="back-icon" onClick={() => navigate("/")}>
                        <IoIosArrowRoundBack size={35} />
                    </div>
                    <h1>Your Cart</h1>
                </div>
                
                {cartItems?.length === 0 ? (
                    <div className="empty-cart-state">
                        <p>Your Cart is Empty</p>
                    </div>
                ) : (
                    <>
                        <div className="cart-items-list">
                            {cartItems?.map((item, index) => (
                                <CartItemCard data={item} key={index} />
                            ))}
                        </div>
                        
                        <div className="cart-total-card">
                            <h2>Total Amount</h2>
                            <span className="total-price">₹{totalAmount}</span>
                        </div>
                        
                        <div className="cart-actions">
                            <button className="btn-primary" onClick={() => navigate("/checkout")}>
                                Proceed to Checkout
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default CartPage