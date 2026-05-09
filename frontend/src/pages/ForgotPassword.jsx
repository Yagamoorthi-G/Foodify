import axios from 'axios';
import React, { useState } from 'react'
import '../css/ForgotPassword.css'
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { serverUrl } from '../App';
import { ClipLoader } from 'react-spinners';

function ForgotPassword() {
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [err, setErr] = useState("")
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  
  const handleSendOtp = async () => {
    setLoading(true)
    try {
      await axios.post(`${serverUrl}/api/auth/send-otp`, { email }, { withCredentials: true })
      setErr("")
      setStep(2)
      setLoading(false)
    } catch (error) {
       setErr(error.response?.data?.message || "Error sending OTP")
       setLoading(false)
    }
  }
  
  const handleVerifyOtp = async () => {
      setLoading(true)
    try {
      await axios.post(`${serverUrl}/api/auth/verify-otp`, { email, otp }, { withCredentials: true })
      setErr("")
      setStep(3)
      setLoading(false)
    } catch (error) {
        setErr(error?.response?.data?.message || "Invalid OTP")
        setLoading(false)
    }
  }
  
  const handleResetPassword = async () => {
    if(newPassword !== confirmPassword) {
      setErr("Passwords do not match")
      return null
    }
    setLoading(true)
    try {
      await axios.post(`${serverUrl}/api/auth/reset-password`, { email, newPassword }, { withCredentials: true })
      setErr("")
      setLoading(false)
      navigate("/signin")
    } catch (error) {
       setErr(error?.response?.data?.message || "Error resetting password")
       setLoading(false)
    }
  }
  
  return (
    <div className="auth-page-wrapper">
      <div className="auth-card">
        <div className="auth-header">
          <IoIosArrowRoundBack size={30} className="auth-back-icon" onClick={() => navigate("/signin")} />
          <h1>Reset Password</h1>
        </div>
        
        {step === 1 && (
            <div className="auth-form">
                <div className="auth-input-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" placeholder="Enter your Email" onChange={(e) => setEmail(e.target.value)} value={email} required />
                </div>
                <button className="auth-btn-primary" onClick={handleSendOtp} disabled={loading}>
                    {loading ? <ClipLoader size={20} color="white" /> : "Send OTP"}
                </button>
                 {err && <p className="auth-error">*{err}</p>}
            </div>
        )}

         {step === 2 && (
            <div className="auth-form">
                <div className="auth-input-group">
                    <label htmlFor="otp">OTP</label>
                    <input type="text" placeholder="Enter OTP" onChange={(e) => setOtp(e.target.value)} value={otp} required />
                </div>
                <button className="auth-btn-primary" onClick={handleVerifyOtp} disabled={loading}>
                    {loading ? <ClipLoader size={20} color="white" /> : "Verify"}
                </button>
                {err && <p className="auth-error">*{err}</p>}
            </div>
        )}
        
        {step === 3 && (
            <div className="auth-form">
                <div className="auth-input-group">
                    <label htmlFor="newPassword">New Password</label>
                    <input type="password" placeholder="Enter New Password" onChange={(e) => setNewPassword(e.target.value)} value={newPassword} required />
                </div>
                <div className="auth-input-group">
                    <label htmlFor="ConfirmPassword">Confirm Password</label>
                    <input type="password" placeholder="Confirm Password" onChange={(e) => setConfirmPassword(e.target.value)} value={confirmPassword} required />
                </div>
                <button className="auth-btn-primary" onClick={handleResetPassword} disabled={loading}>
                    {loading ? <ClipLoader size={20} color="white" /> : "Reset Password"}
                </button>
                {err && <p className="auth-error">*{err}</p>}
            </div>
        )}
      </div>
    </div>
  )
}

export default ForgotPassword