import React, { useEffect, useRef, useState } from 'react'
import '../css/UserDashboard.css'
import Nav from './Nav.jsx' 
import { categories } from '../category'
import CategoryCard from './CategoryCard'
import { FaCircleChevronLeft, FaCircleChevronRight } from "react-icons/fa6";
import { useSelector } from 'react-redux';
import FoodCard from './FoodCard';
import { useNavigate } from 'react-router-dom';

function UserDashboard() {
  const { currentCity, shopInMyCity, itemsInMyCity, searchItems } = useSelector(state => state.user)
  const cateScrollRef = useRef()
  const shopScrollRef = useRef()
  const navigate = useNavigate()
  
  const [showLeftCateButton, setShowLeftCateButton] = useState(false)
  const [showRightCateButton, setShowRightCateButton] = useState(false)
  const [showLeftShopButton, setShowLeftShopButton] = useState(false)
  const [showRightShopButton, setShowRightShopButton] = useState(false)
  const [updatedItemsList, setUpdatedItemsList] = useState([])

  const handleFilterByCategory = (category) => {
    if(category === "All"){
      setUpdatedItemsList(itemsInMyCity)
    } else {
      const filteredList = itemsInMyCity?.filter(i => i.category === category)
      setUpdatedItemsList(filteredList)
    }
  }

  useEffect(() => {
    setUpdatedItemsList(itemsInMyCity)
  }, [itemsInMyCity])

  const updateButton = (ref, setLeftButton, setRightButton) => {
    const element = ref.current
    if(element){
      setLeftButton(element.scrollLeft > 0)
      setRightButton(element.scrollLeft + element.clientWidth < element.scrollWidth)
    }
  }

  const scrollHandler = (ref, direction) => {
    if(ref.current){
      ref.current.scrollBy({
        left: direction === "left" ? -200 : 200,
        behavior: "smooth"
      })
    }
  }

  useEffect(() => {
    if(cateScrollRef.current){
      updateButton(cateScrollRef, setShowLeftCateButton, setShowRightCateButton)
      updateButton(shopScrollRef, setShowLeftShopButton, setShowRightShopButton)
      
      const handleCateScroll = () => updateButton(cateScrollRef, setShowLeftCateButton, setShowRightCateButton)
      const handleShopScroll = () => updateButton(shopScrollRef, setShowLeftShopButton, setShowRightShopButton)

      cateScrollRef.current.addEventListener('scroll', handleCateScroll)
      shopScrollRef.current.addEventListener('scroll', handleShopScroll)
     
      return () => {
        cateScrollRef.current?.removeEventListener("scroll", handleCateScroll)
        shopScrollRef.current?.removeEventListener("scroll", handleShopScroll)
      }
    }
  }, [categories])

  return (
    <div className="ud-wrapper">
      <Nav />

      {searchItems && searchItems.length > 0 && (
        <div className="ud-section search-results">
          <h1 className="ud-section-title">Search Results</h1>
          <div className="ud-grid">
            {searchItems.map((item) => (
              <FoodCard data={item} key={item._id}/>
            ))}
          </div>
        </div>
      )}

      <div className="ud-section">
        <h1 className="ud-section-title">Inspiration for your first order</h1>
        <div className="ud-carousel-wrapper">
          {showLeftCateButton && (
            <button className="ud-carousel-btn left" onClick={() => scrollHandler(cateScrollRef, "left")}>
                <FaCircleChevronLeft />
            </button>
          )}
          <div className="ud-carousel" ref={cateScrollRef}>
            {categories.map((cate, index) => (
              <CategoryCard name={cate.category} image={cate.image} key={index} onClick={() => handleFilterByCategory(cate.category)}/>
            ))}
          </div>
          {showRightCateButton && (
            <button className="ud-carousel-btn right" onClick={() => scrollHandler(cateScrollRef, "right")}>
                <FaCircleChevronRight />
            </button>
          )}
        </div>
      </div>

      <div className="ud-section">
        <h1 className="ud-section-title">Best Shops in {currentCity}</h1>
        <div className="ud-carousel-wrapper">
          {showLeftShopButton && (
            <button className="ud-carousel-btn left" onClick={() => scrollHandler(shopScrollRef, "left")}>
                <FaCircleChevronLeft />
            </button>
          )}
          <div className="ud-carousel" ref={shopScrollRef}>
            {shopInMyCity?.map((shop, index) => (
              <CategoryCard name={shop.name} image={shop.image} key={index} onClick={() => navigate(`/shop/${shop._id}`)}/>
            ))}
          </div>
          {showRightShopButton && (
             <button className="ud-carousel-btn right" onClick={() => scrollHandler(shopScrollRef, "right")}>
                <FaCircleChevronRight />
             </button>
          )}
        </div>
      </div>

      <div className="ud-section">
       <h1 className="ud-section-title">Suggested Food Items</h1>
        <div className="ud-grid">
            {updatedItemsList?.map((item, index) => (
              <FoodCard key={index} data={item}/>
            ))}
        </div>
      </div>
    </div>
  )
}

export default UserDashboard