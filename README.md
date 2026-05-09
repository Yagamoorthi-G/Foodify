# Foodify 🍔

Foodify is a full-stack food ordering and delivery web application built using the MERN stack. The platform allows users to browse food items, place orders, track deliveries, and manage their accounts. Shop owners can create and manage shops and food items, while delivery tracking provides a smooth user experience.

---

# Features

## User Features

* User authentication and authorization
* Sign up / Sign in functionality
* Browse food shops and items
* Add items to cart
* Place food orders
* Track order status
* View previous orders
* Forgot password functionality

## Shop Owner Features

* Create and manage shops
* Add, edit, and delete food items
* Manage incoming orders

## Additional Features

* JWT authentication
* Cloudinary image upload integration
* Email functionality
* Redux state management
* Responsive UI
* Real-time order updates using Socket.io

---

# Tech Stack

## Frontend

* React.js
* Redux Toolkit
* React Router DOM
* Axios
* Vite

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* Socket.io
* Multer
* Cloudinary

---

# Folder Structure

```bash
Foodify/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── index.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   └── vite.config.js
│
└── README.md
```

---

# Installation

## Clone Repository

```bash
git clone https://github.com/Yagamoorthi-G/Foodify.git
```

---

# Backend Setup

```bash
cd backend
npm install
npm run dev
```

Create a `.env` file inside backend:

```env
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

# Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Create a `.env` file inside frontend:

```env
VITE_API_URL=http://localhost:5000
```

---

# Screenshots

Add your project screenshots here.

---

# Future Improvements

* Online payment integration
* Admin dashboard
* Push notifications
* Ratings and reviews
* AI-based food recommendations
* Live delivery tracking using maps

---

# Learning Outcomes

This project helped in understanding:

* MERN stack development
* REST API creation
* Authentication and authorization
* State management using Redux
* Real-time communication using Socket.io
* File upload handling
* Project structuring and deployment

---

# Author

## Yagamoorthi

* GitHub: [https://github.com/Yagamoorthi-G](https://github.com/Yagamoorthi-G)

---

# License

This project is developed for learning and academic purposes.
