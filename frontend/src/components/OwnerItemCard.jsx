import axios from 'axios';
import React from 'react'
import '../css/OwnerItemCard.css'
import { FaPen, FaTrashAlt } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { serverUrl } from '../App';
import { useDispatch } from 'react-redux';
import { setMyShopData } from '../redux/ownerSlice';

function OwnerItemCard({data}) {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    
    const handleDelete = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/item/delete/${data._id}`, {withCredentials: true})
        dispatch(setMyShopData(result.data))
      } catch (error) {
        console.log(error)
      }
    }
    
  return (
    <div className="owner-item-card">
      <div className="oic-image-container">
        <img src={data.image} alt={data.name} className="oic-image"/>
      </div>
      <div className="oic-content">
          <div className="oic-details">
            <h2 className="oic-title">{data.name}</h2>
            <p><strong>Category:</strong> {data.category}</p>
            <p><strong>Type:</strong> {data.foodType}</p>
          </div>
          <div className="oic-footer">
            <div className="oic-price">₹{data.price}</div>
            <div className="oic-actions">
                <button className="oic-action-btn edit-btn" onClick={() => navigate(`/edit-item/${data._id}`)}>
                    <FaPen size={14}/>
                </button>
                <button className="oic-action-btn delete-btn" onClick={handleDelete}>
                    <FaTrashAlt size={14}/>
                </button>
            </div>
          </div>
      </div>
    </div>
  )
}

export default OwnerItemCard