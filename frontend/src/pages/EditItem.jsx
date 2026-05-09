import React, { useEffect, useState } from 'react'
import { IoIosArrowRoundBack } from "react-icons/io";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { FaUtensils } from "react-icons/fa";
import axios from 'axios';
import { serverUrl } from '../App';
import { setMyShopData } from '../redux/ownerSlice';
import { ClipLoader } from 'react-spinners';
import '../css/AddEditShopItem.css'

function EditItem() {
    const navigate = useNavigate()
    const { myShopData } = useSelector(state => state.owner)
    const { itemId } = useParams()
    const [currentItem, setCurrentItem] = useState(null)
    const [name, setName] = useState("")
    const [price, setPrice] = useState(0)
    const [frontendImage, setFrontendImage] = useState("")
    const [backendImage, setBackendImage] = useState(null)
    const [category, setCategory] = useState("")
    const [foodType, setFoodType] = useState("")
    const [loading, setLoading] = useState(false)
    const categories = ["Snacks", "Main Course", "Desserts", "Pizza", "Burgers", "Sandwiches", "South Indian", "North Indian", "Chinese", "Fast Food", "Others"]
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
            formData.append("category", category)
            formData.append("foodType", foodType)
            formData.append("price", price)
            if (backendImage) {
                formData.append("image", backendImage)
            }
            const result = await axios.post(`${serverUrl}/api/item/edit-item/${itemId}`, formData, { withCredentials: true })
            dispatch(setMyShopData(result.data))
            setLoading(false)
            navigate("/")
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }

    useEffect(() => {
      const handleGetItemById = async () => {
        try {
           const result = await axios.get(`${serverUrl}/api/item/get-by-id/${itemId}`, { withCredentials: true }) 
           setCurrentItem(result.data)
        } catch (error) {
            console.log(error)
        }
      }
      handleGetItemById()
    }, [itemId])

    useEffect(() => {
     setName(currentItem?.name || "")
     setPrice(currentItem?.price || 0)
     setCategory(currentItem?.category || "")
     setFoodType(currentItem?.foodType || "")
     setFrontendImage(currentItem?.image || "")
    }, [currentItem])
    
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
                    <h2>Edit Food</h2>
                </div>
                <form className="premium-form" onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Name</label>
                        <input type="text" placeholder="Enter Item Name" onChange={(e) => setName(e.target.value)} value={name} />
                    </div>
                    <div className="input-group">
                        <label>Food Image</label>
                        <input type="file" accept="image/*" onChange={handleImage} />
                        {frontendImage && (
                            <div className="image-preview">
                                <img src={frontendImage} alt="Preview" />
                            </div>
                        )}
                    </div>
                    <div className="input-group">
                        <label>Price (₹)</label>
                        <input type="number" placeholder="0" onChange={(e) => setPrice(e.target.value)} value={price} />
                    </div>
                    <div className="input-group">
                        <label>Select Category</label>
                        <select onChange={(e) => setCategory(e.target.value)} value={category}>
                            <option value="">Select Category</option>
                            {categories.map((cate, index) => (
                                <option value={cate} key={index}>{cate}</option>
                            ))}
                        </select>
                    </div>
                    <div className="input-group">
                        <label>Select Food Type</label>
                        <select onChange={(e) => setFoodType(e.target.value)} value={foodType}>
                            <option value="veg">Veg</option>
                            <option value="non veg">Non Veg</option>
                        </select>
                    </div>

                    <button type="submit" className="btn-primary btn-full" disabled={loading}>
                        {loading ? <ClipLoader size={20} color="white" /> : "Save Changes"}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default EditItem