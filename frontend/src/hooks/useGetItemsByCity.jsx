import axios from 'axios'
import React, { useEffect } from 'react'
import { serverUrl } from '../App'
import { useDispatch, useSelector } from 'react-redux'
import { setItemsInMyCity } from '../redux/userSlice'

function useGetItemsByCity() {
    const dispatch = useDispatch()
    // BUG FIX: Pull userData from Redux state
    const { currentCity, userData } = useSelector(state => state.user)
    
    useEffect(() => {
        // BUG FIX: Abort if there is no city OR if the user is not logged in
        if (!currentCity || !userData) return;

        const fetchItems = async () => {
            try {
                const result = await axios.get(`${serverUrl}/api/item/get-by-city/${currentCity}`, { withCredentials: true })
                dispatch(setItemsInMyCity(result.data))
            } catch (error) {
                console.log(error)
            }
        }
        fetchItems()
    }, [currentCity, userData]) // Added userData to dependency array
}
export default useGetItemsByCity