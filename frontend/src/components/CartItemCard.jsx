import React from 'react'
import '../css/CartItemCard.css'
import { FaMinus, FaPlus } from "react-icons/fa";
import { CiTrash } from "react-icons/ci";
import { useDispatch } from 'react-redux';
import { removeCartItem, updateQuantity } from '../redux/userSlice';

function CartItemCard({data}) {
    const dispatch = useDispatch()
    
    const handleIncrease = (id, currentQty) => {
       dispatch(updateQuantity({id, quantity: currentQty + 1}))
    }
    
    const handleDecrease = (id, currentQty) => {
        if(currentQty > 1){
            dispatch(updateQuantity({id, quantity: currentQty - 1}))
        }
    }
    
  return (
    <div className="cart-item-card">
      <div className="cart-item-info">
        <img src={data.image} alt="" className="cart-item-image"/>
        <div className="cart-item-details">
            <h3>{data.name}</h3>
            <p className="cart-item-meta">₹{data.price} x {data.quantity}</p>
            <p className="cart-item-total">₹{data.price * data.quantity}</p>
        </div>
      </div>
      <div className="cart-item-actions">
        <button className="btn-circle" onClick={() => handleDecrease(data.id, data.quantity)}>
            <FaMinus size={12}/>
        </button>
        <span className="cart-qty">{data.quantity}</span>
        <button className="btn-circle" onClick={() => handleIncrease(data.id, data.quantity)}>
            <FaPlus size={12}/>
        </button>
        <button className="btn-circle btn-delete" onClick={() => dispatch(removeCartItem(data.id))}>
            <CiTrash size={18}/>
        </button>
      </div>
    </div>
  )
}

export default CartItemCard