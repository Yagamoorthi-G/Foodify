import React, { useState } from 'react'
import { IoIosArrowRoundBack } from "react-icons/io";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaUtensils } from "react-icons/fa";
import axios from 'axios';
import { serverUrl } from '../App';
import { setMyShopData } from '../redux/ownerSlice';
import { ClipLoader } from 'react-spinners';
import '../css/AddEditShopItem.css'

function CreateEditShop() {
    const navigate = useNavigate()
    const { myShopData } = useSelector(state => state.owner)
    const { currentCity, currentState, currentAddress } = useSelector(state => state.user)
    
    const [name, setName] = useState(myShopData?.name || "")
    const [address, setAddress] = useState(myShopData?.address || currentAddress || "")
    const [city, setCity] = useState(myShopData?.city || currentCity || "")
    const [state, setState] = useState(myShopData?.state || currentState || "")
    const [frontendImage, setFrontendImage] = useState(myShopData?.image || null)
    const [backendImage, setBackendImage] = useState(null)
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()
       
    const handleImage = (e) => {
        const file = e.target.files[0]
        setBackendImage(file)
        setFrontendImage(URL.createObjectURL(file))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
           const formData = new FormData()
           formData.append("name", name) 
           formData.append("city", city) 
           formData.append("state", state) 
           formData.append("address", address) 
           if(backendImage){
            formData.append("image", backendImage)
           }
           const result = await axios.post(`${serverUrl}/api/shop/create-edit`, formData, { withCredentials: true })
           dispatch(setMyShopData(result.data))
           setLoading(false)
           navigate("/")
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }
    
    return (
        <div className="form-page-wrapper">
            <div className="back-btn-container" onClick={() => navigate("/")}>
                <IoIosArrowRoundBack size={35} />
            </div>

            <div className="premium-form-card">
                <div className="form-header">
                    <div className="form-icon-wrapper">
                        <FaUtensils className="form-icon" />
                    </div>
                    <h2>{myShopData ? "Edit Shop" : "Add Shop"}</h2>
                </div>
                
                <form className="premium-form" onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Name</label>
                        <input type="text" placeholder="Enter Shop Name" onChange={(e) => setName(e.target.value)} value={name} />
                    </div>
                    
                    <div className="input-group">
                        <label>Shop Image</label>
                        <input type="file" accept="image/*" onChange={handleImage} />
                        {frontendImage && (
                            <div className="image-preview">
                                <img src={frontendImage} alt="Preview" />
                            </div>
                        )}
                    </div>
                    
                    <div className="input-row">
                        <div className="input-group">
                           <label>City</label>
                           <input type="text" placeholder="City" onChange={(e) => setCity(e.target.value)} value={city} /> 
                        </div>
                        <div className="input-group">
                            <label>State</label>
                            <input type="text" placeholder="State" onChange={(e) => setState(e.target.value)} value={state} /> 
                        </div>
                    </div>
                    
                    <div className="input-group">
                        <label>Address</label>
                        <input type="text" placeholder="Enter Shop Address" onChange={(e) => setAddress(e.target.value)} value={address} /> 
                    </div>
                    
                    <button type="submit" className="btn-primary btn-full" disabled={loading}>
                        {loading ? <ClipLoader size={20} color="white" /> : "Save Details"}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default CreateEditShop