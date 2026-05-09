import React, { useEffect, useState } from 'react'
import '../css/Nav.css'
import { FaLocationDot, FaPlus } from "react-icons/fa6";
import { IoIosSearch } from "react-icons/io";
import { FiShoppingCart } from "react-icons/fi";
import { RxCross2 } from "react-icons/rx";
import { TbReceipt2 } from "react-icons/tb";
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { serverUrl } from '../App';
import { setSearchItems, setUserData } from '../redux/userSlice';
import { useNavigate } from 'react-router-dom';

function Nav() {
    const { userData, currentCity, cartItems } = useSelector(state => state.user)
    const { myShopData } = useSelector(state => state.owner)
    const [showInfo, setShowInfo] = useState(false)
    const [showSearch, setShowSearch] = useState(false)
    const [query, setQuery] = useState("")
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleLogOut = async () => {
        try {
            await axios.get(`${serverUrl}/api/auth/signout`, { withCredentials: true })
            dispatch(setUserData(null))
        } catch (error) {
            console.log(error)
        }
    }

    const handleSearchItems = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/item/search-items?query=${query}&city=${currentCity}`, { withCredentials: true })
        dispatch(setSearchItems(result.data))
      } catch (error) {
        console.log(error)
      }
    }

    useEffect(() => {
        if (query) {
            handleSearchItems()
        } else {
            dispatch(setSearchItems(null))
        }
    }, [query])

    return (
        <header className="nav-header">
            {showSearch && userData?.role === "user" && (
                <div className="nav-mobile-search">
                    <div className="nav-location">
                        <FaLocationDot size={20} className="nav-icon" />
                        <span className="nav-city">{currentCity}</span>
                    </div>
                    <div className="nav-search-input">
                        <IoIosSearch size={22} className="nav-icon" />
                        <input type="text" placeholder="Search delicious food..." onChange={(e) => setQuery(e.target.value)} value={query}/>
                    </div>
                </div>
            )}

            <h1 className="nav-logo" onClick={() => navigate('/')}> 𓆩༺✧Foodify✧༻𓆪 </h1>

            {userData?.role === "user" && (
                <div className="nav-desktop-search">
                    <div className="nav-location">
                        <FaLocationDot size={20} className="nav-icon" />
                        <span className="nav-city">{currentCity}</span>
                    </div>
                    <div className="nav-search-input">
                        <IoIosSearch size={22} className="nav-icon" />
                        <input type="text" placeholder="Search delicious food..." onChange={(e) => setQuery(e.target.value)} value={query}/>
                    </div>
                </div>
            )}

            <div className="nav-actions">
                {userData?.role === "user" && (
                    showSearch ? 
                    <RxCross2 size={24} className="nav-icon mobile-only" onClick={() => setShowSearch(false)} /> : 
                    <IoIosSearch size={24} className="nav-icon mobile-only" onClick={() => setShowSearch(true)} />
                )}

                {userData?.role === "owner" ? (
                    <>
                        {myShopData && (
                            <button className="nav-btn-action" onClick={() => navigate("/add-item")}>
                                <FaPlus size={18} />
                                <span className="desktop-only">Add Food Item</span>
                            </button>
                        )}
                        <button className="nav-btn-action" onClick={() => navigate("/my-orders")}>
                            <TbReceipt2 size={20}/>
                            <span className="desktop-only">My Orders</span>
                        </button>
                    </>
                ) : (
                    <>
                        {userData?.role === "user" && (
                            <div className="nav-cart" onClick={() => navigate("/cart")}>
                                <FiShoppingCart size={24} className="nav-icon" />
                                <span className="nav-cart-badge">{cartItems.length}</span>
                            </div>
                        )}
                        <button className="nav-btn-text desktop-only" onClick={() => navigate("/my-orders")}>
                            My Orders
                        </button>
                    </>
                )}

                <div className="nav-avatar" onClick={() => setShowInfo(prev => !prev)}>
                    {userData?.fullName?.slice(0, 1)}
                </div>

                {showInfo && (
                    <div className="nav-dropdown">
                        <div className="nav-dropdown-name">{userData?.fullName}</div>
                        {userData?.role === "user" && (
                            <div className="nav-dropdown-item mobile-only" onClick={() => navigate("/my-orders")}>My Orders</div>
                        )}
                        <div className="nav-dropdown-item logout" onClick={handleLogOut}>Log Out</div>
                    </div>
                )}
            </div>
        </header>
    )
}

export default Nav