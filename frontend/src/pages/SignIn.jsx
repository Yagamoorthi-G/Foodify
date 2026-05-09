import React, { useState } from 'react'
import '../css/SignInOut.css'
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from 'react-router-dom';
import axios from "axios"
import { serverUrl } from '../App';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase';
import { ClipLoader } from 'react-spinners';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';

function SignIn() {
    const [showPassword, setShowPassword] = useState(false)
    const navigate = useNavigate()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [err, setErr] = useState("")
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()

    const handleSignIn = async () => {
        setLoading(true)
        try {
            const result = await axios.post(`${serverUrl}/api/auth/signin`, {
                email, password
            }, { withCredentials: true })
            dispatch(setUserData(result.data))
            setErr("")
            setLoading(false)
        } catch (error) {
            setErr(error?.response?.data?.message || "Sign in failed")
            setLoading(false)
        }
    }

    const handleGoogleAuth = async () => {
        try {
            const provider = new GoogleAuthProvider()
            const result = await signInWithPopup(auth, provider)
            const { data } = await axios.post(`${serverUrl}/api/auth/google-auth`, {
                email: result.user.email,
            }, { withCredentials: true })
            dispatch(setUserData(data))
        } catch (error) {
            console.log(error)
            setErr(error?.response?.data?.message || "Google Auth cancelled or failed.")
        }
    }

    return (
        <div className="auth-page-wrapper">
            <div className="auth-card">
                <h1 className="auth-brand">Foodify</h1>
                <p className="auth-subtitle">Sign in to your account to get started with delicious food and deliveries</p>

                <div className="auth-form">
                    <div className="auth-input-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" placeholder="Enter your Email" onChange={(e) => setEmail(e.target.value)} value={email} required />
                    </div>

                    <div className="auth-input-group">
                        <label htmlFor="password">Password</label>
                        <div className="password-input-wrapper">
                            <input type={showPassword ? "text" : "password"} placeholder="Enter your password" onChange={(e) => setPassword(e.target.value)} value={password} required />
                            <button type="button" className="password-toggle-btn" onClick={() => setShowPassword(prev => !prev)}>
                                {!showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                            </button>
                        </div>
                    </div>

                    <div className="auth-forgot-password" onClick={() => navigate("/forgot-password")}>
                        Forgot Password?
                    </div>

                    <button className="auth-btn-primary" onClick={handleSignIn} disabled={loading}>
                        {loading ? <ClipLoader size={20} color="white" /> : "Sign In"}
                    </button>

                    {err && <p className="auth-error">*{err}</p>}

                    {/* <button className="auth-btn-outline" onClick={handleGoogleAuth} disabled> */}
                    <button className="auth-btn-outline" disabled>
                        <FcGoogle size={20} />
                        <span>Sign In with Google</span>
                    </button>
                    <p className="auth-warning">
                    ⚠️ Google Sign-in is temporarily unavailable due to Firebase service shutdown.
                    </p>

                    <p className="auth-redirect">
                        Want to create a new account? <span onClick={() => navigate("/signup")}>Sign Up</span>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default SignIn