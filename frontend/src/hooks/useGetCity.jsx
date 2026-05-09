import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setCurrentAddress, setCurrentCity, setCurrentState } from '../redux/userSlice'
import { setAddress, setLocation } from '../redux/mapSlice'

function useGetCity() {
    const dispatch = useDispatch()
    const { userData } = useSelector(state => state.user)
    const apiKey = import.meta.env.VITE_GEOAPIFY_API_KEY
    
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const latitude = position.coords.latitude
            const longitude = position.coords.longitude
            dispatch(setLocation({ lat: latitude, lon: longitude }))
            
            try {
                const result = await axios.get(`https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${apiKey}`)
                
                // SAFEGUARD: Added optional chaining to safely fall back if 'city' is missing
                const locData = result?.data?.results?.[0] || {}
                
                dispatch(setCurrentCity(locData?.city || locData?.county || locData?.state_district || "Unknown City"))
                dispatch(setCurrentState(locData?.state || "Unknown State"))
                dispatch(setCurrentAddress(locData?.address_line2 || locData?.address_line1 || "Unknown Address"))
                dispatch(setAddress(locData?.address_line2 || "Unknown Address"))
            } catch (error) {
                console.log("Geocoding Error:", error)
            }
        })
    }, [userData])
}

export default useGetCity