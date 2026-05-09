import React from 'react'
import '../css/CategoryCard.css'

function CategoryCard({name, image, onClick}) {
  return (
    <div className="category-card" onClick={onClick}>
     <img src={image} alt={name} className="category-image" />
     <div className="category-overlay">
        {name}
     </div>
    </div>
  )
}

export default CategoryCard