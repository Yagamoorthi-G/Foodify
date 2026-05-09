import React, { useState } from 'react'
import '../css/SignInOut.css'
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from 'react-router-dom';
import axios from "axios"
import { serverUrl } from '../App';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase';
import { ClipLoader } from "react-spinners"
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';

function SignUp() {
    const [showPassword, setShowPassword] = useState(false)
    const [role, setRole] = useState("user")
    const navigate = useNavigate()
    const [fullName, setFullName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [mobile, setMobile] = useState("")
    const [err, setErr] = useState("")
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()

    const handleSignUp = async () => {
        setLoading(true)
        try {
            const result = await axios.post(`${serverUrl}/api/auth/signup`, {
                fullName, email, password, mobile, role
            }, { withCredentials: true })
            dispatch(setUserData(result.data))
            setErr("")
            setLoading(false)
        } catch (error) {
            setErr(error?.response?.data?.message || "Sign up failed")
            setLoading(false)
        }
    }

    const handleGoogleAuth = async () => {
        if (!mobile) {
            return setErr("Mobile number is required for Google Sign Up")
        }
        try {
            const provider = new GoogleAuthProvider()
            const result = await signInWithPopup(auth, provider)
            const { data } = await axios.post(`${serverUrl}/api/auth/google-auth`, {
                fullName: result.user.displayName,
                email: result.user.email,
                role,
                mobile
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
                <p className="auth-subtitle">Create your account to get started with delicious food deliveries</p>

                <div className="auth-input-group">
                        <label>Role</label>
                        <div className="role-selector">
                            {["user", "owner", "deliveryBoy"].map((r) => (
                                <button
                                    key={r}
                                    type="button"
                                    className={`role-btn ${role === r ? "active" : ""}`}
                                    onClick={() => setRole(r)}
                                >
                                    {r}
                                </button>
                            ))}
                        </div>
                    </div>

                <div className="auth-form">
                    <br/>
                    <div className="auth-input-group">
                        <label htmlFor="fullName">Full Name</label>
                        <input type="text" placeholder="Enter your Full Name" onChange={(e) => setFullName(e.target.value)} value={fullName} required />
                    </div>

                    <div className="auth-input-group">
                        <label htmlFor="mobile">Mobile</label>
                        <input type="text" placeholder="Enter your Mobile Number" onChange={(e) => setMobile(e.target.value)} value={mobile} required />
                    </div>

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

                    

                    <button className="auth-btn-primary" onClick={handleSignUp} disabled={loading}>
                        {loading ? <ClipLoader size={20} color="white" /> : "Sign Up"}
                    </button>

                    {err && <p className="auth-error">*{err}</p>}

                    {/* <button className="auth-btn-outline" onClick={handleGoogleAuth}> */}
                    <button className="auth-btn-outline" disabled>
                        <FcGoogle size={20} />
                        <span>Sign In with Google</span>
                    </button>
                    <p className="auth-warning">
                        ⚠️ Google Sign-in is temporarily unavailable due to Firebase service shutdown. 
                    </p>

                    <p className="auth-redirect">
                        Already have an account? <span onClick={() => navigate("/signin")}>Sign In</span>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default SignUp