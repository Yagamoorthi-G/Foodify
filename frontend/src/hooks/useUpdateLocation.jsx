import axios from 'axios'
import React, { useEffect } from 'react'
import { serverUrl } from '../App'
import { useDispatch, useSelector } from 'react-redux'

function useUpdateLocation() {
    const dispatch = useDispatch()
    const { userData } = useSelector(state => state.user)
 
    useEffect(() => {
        // BUG FIX: Don't track/update location if no user is logged in
        if (!userData) return;

        const updateLocation = async (lat, lon) => {
            try {
                const result = await axios.post(`${serverUrl}/api/user/update-location`, {lat, lon}, {withCredentials: true})
            } catch (error) {
                console.log(error)
            }
        }

        const watchId = navigator.geolocation.watchPosition((pos) => {
            updateLocation(pos.coords.latitude, pos.coords.longitude)
        })

        return () => navigator.geolocation.clearWatch(watchId)
    }, [userData])
}

export default useUpdateLocation