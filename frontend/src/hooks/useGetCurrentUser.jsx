import axios from 'axios'
import { useEffect } from 'react'
import { serverUrl } from '../App'
import { useDispatch } from 'react-redux'
import { setUserData, setIsAuthChecking } from '../redux/userSlice' // Import the new action

function useGetCurrentUser() {
    const dispatch = useDispatch()
    
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const result = await axios.get(`${serverUrl}/api/user/current`, { withCredentials: true })
                dispatch(setUserData(result.data))
            } catch (error) {
                dispatch(setUserData(null)) 
            } finally {
                dispatch(setIsAuthChecking(false))
            }
        }
        fetchUser()
    }, [dispatch])
}

export default useGetCurrentUser