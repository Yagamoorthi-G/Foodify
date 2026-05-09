import React, { useEffect, useRef } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import ForgotPassword from './pages/ForgotPassword'
import useGetCurrentUser from './hooks/useGetCurrentUser'
import { useDispatch, useSelector } from 'react-redux'
import Home from './pages/Home'
import useGetCity from './hooks/useGetCity'
import useGetMyshop from './hooks/useGetMyShop'
import CreateEditShop from './pages/CreateEditShop'
import AddItem from './pages/AddItem'
import EditItem from './pages/EditItem'
import useGetShopByCity from './hooks/useGetShopByCity'
import useGetItemsByCity from './hooks/useGetItemsByCity'
import CartPage from './pages/CartPage'
import CheckOut from './pages/CheckOut'
import OrderPlaced from './pages/OrderPlaced'
import MyOrders from './pages/MyOrders'
import useGetMyOrders from './hooks/useGetMyOrders'
import useUpdateLocation from './hooks/useUpdateLocation'
import TrackOrderPage from './pages/TrackOrderPage'
import Shop from './pages/Shop'
import { io } from 'socket.io-client'
import { ClipLoader } from 'react-spinners' 

export const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:8000"

function App() {
    // Pull isAuthChecking from Redux
    const { userData, isAuthChecking } = useSelector(state => state.user)
    const dispatch = useDispatch()
    
    useGetCurrentUser()
    useUpdateLocation()
    useGetCity()
    useGetMyshop()
    useGetShopByCity()
    useGetItemsByCity()
    useGetMyOrders()

    const socketRef = useRef(null)
    
    useEffect(() => {
      const socketInstance = io(serverUrl, { withCredentials: true })
      socketRef.current = socketInstance
      
      socketInstance.on("connect", () => {
        if (userData) {
          socketInstance.emit("identity", { userId: userData._id })
        }
      })
      
      return () => {
        socketInstance.disconnect()
      }
    }, [userData?._id])

    // ADDED: Global Loading Screen while checking auth cookie
    if (isAuthChecking) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#F1F8F6' }}>
                <ClipLoader size={50} color="#00754A" />
            </div>
        )
    }

  return (
   <Routes>
      <Route path='/signup' element={!userData ? <SignUp/> : <Navigate to={"/"}/>}/>
      <Route path='/signin' element={!userData ? <SignIn/> : <Navigate to={"/"}/>}/>
      <Route path='/forgot-password' element={!userData ? <ForgotPassword/> : <Navigate to={"/"}/>}/>
      <Route path='/' element={userData ? <Home/> : <Navigate to={"/signin"}/>}/>
      <Route path='/create-edit-shop' element={userData ? <CreateEditShop/> : <Navigate to={"/signin"}/>}/>
      <Route path='/add-item' element={userData ? <AddItem/> : <Navigate to={"/signin"}/>}/>
      <Route path='/edit-item/:itemId' element={userData ? <EditItem/> : <Navigate to={"/signin"}/>}/>
      <Route path='/cart' element={userData ? <CartPage/> : <Navigate to={"/signin"}/>}/>
      <Route path='/checkout' element={userData ? <CheckOut/> : <Navigate to={"/signin"}/>}/>
      <Route path='/order-placed' element={userData ? <OrderPlaced/> : <Navigate to={"/signin"}/>}/>
      <Route path='/my-orders' element={userData ? <MyOrders/> : <Navigate to={"/signin"}/>}/>
      <Route path='/track-order/:orderId' element={userData ? <TrackOrderPage/> : <Navigate to={"/signin"}/>}/>
      <Route path='/shop/:shopId' element={userData ? <Shop/> : <Navigate to={"/signin"}/>}/>
   </Routes>
  )
}

export default App